import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface Submission {
  id: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  phoneNumber: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'New' | 'In Progress' | 'Contacted' | 'Resolved';
}

const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions.json");

// Helper to read submissions from file
function readSubmissions(): Submission[] {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading submissions file:", error);
  }
  return [];
}

// Helper to write submissions to file
function writeSubmissions(submissions: Submission[]) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing submissions file:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON requests
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all submissions for the Admin panel
  app.get("/api/submissions", (req, res) => {
    const submissions = readSubmissions();
    res.json(submissions);
  });

  // Update status of a submission
  app.patch("/api/submissions/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["New", "In Progress", "Contacted", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const submissions = readSubmissions();
    const index = submissions.findIndex(s => s.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    submissions[index].status = status;
    writeSubmissions(submissions);

    return res.json({ success: true, submission: submissions[index] });
  });

  // Delete a submission
  app.delete("/api/submissions/:id", (req, res) => {
    const { id } = req.params;
    const submissions = readSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    
    if (submissions.length === filtered.length) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    writeSubmissions(filtered);
    return res.json({ success: true, message: "Submission deleted successfully." });
  });

  // Clear all submissions
  app.post("/api/submissions/clear", (req, res) => {
    writeSubmissions([]);
    return res.json({ success: true, message: "All submissions cleared successfully." });
  });

  // Submit contact form (called by frontend)
  app.post("/api/submit-contact", async (req, res) => {
    try {
      const { fullName, businessEmail, companyName, phoneNumber, subject, message } = req.body;

      if (!fullName || !businessEmail || !message) {
        return res.status(400).json({
          success: false,
          message: "Please fill in all required fields (Name, Email, Message)."
        });
      }

      // Generate a unique Request ID
      const requestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newSubmission: Submission = {
        id: requestId,
        fullName: String(fullName).trim(),
        businessEmail: String(businessEmail).trim(),
        companyName: String(companyName || "").trim(),
        phoneNumber: String(phoneNumber || "").trim(),
        subject: String(subject || "General Inquiry").trim(),
        message: String(message).trim(),
        timestamp: new Date().toISOString(),
        status: 'New'
      };

      // Read current, append, and save
      const submissions = readSubmissions();
      submissions.unshift(newSubmission); // Add to the top of the list
      writeSubmissions(submissions);

      console.log(`New submission successfully saved local file with ID: ${requestId}`);

      return res.json({
        success: true,
        message: "Your message has been securely submitted and logged in our system.",
        requestId: requestId
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to process form submission on the server."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
