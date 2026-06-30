import "dotenv/config";
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
  recipientEmails: string[];
  timestamp: string;
  status: 'New' | 'In Progress' | 'Contacted' | 'Resolved';
}

const SUBMISSIONS_FILE = path.join(process.cwd(), "submissions.json");
const JOBS_FILE = path.join(process.cwd(), "jobs.json");

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

interface JobPost {
  id: string;
  title: string;
  location?: string;
  type?: string;
  skills?: string;
  compensation?: string;
  contact?: string;
  description?: string;
  timestamp: string;
}

function readJobs(): JobPost[] {
  try {
    if (fs.existsSync(JOBS_FILE)) {
      const data = fs.readFileSync(JOBS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading jobs file:', err);
  }
  return [];
}

function writeJobs(jobs: JobPost[]) {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing jobs file:', err);
  }
}

function getConfiguredRecipients(): string[] {
  const rawRecipients = process.env.CONTACT_RECIPIENTS || process.env.VITE_CONTACT_RECIPIENTS || "aahil@ba-softtech.com,Nipun@ba-softtech.com";
  return rawRecipients
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

async function forwardSubmissionToSheet(payload: Record<string, unknown>, recipients: string[]) {
  const sheetUrl = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL;

  if (!sheetUrl) {
    console.log("No Google Apps Script URL configured. Submission saved locally only.");
    return;
  }

  try {
    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        recipientEmails: recipients,
      }),
    });

    const responseText = await response.text().catch(() => "");
    if (!response.ok) {
      console.warn(`Google Apps Script responded with ${response.status}: ${responseText}`);
      return;
    }

    console.log("Submission forwarded to Google Sheet endpoint.");
  } catch (error) {
    console.warn("Failed to forward submission to Google Sheet endpoint:", error);
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

  // Jobs API: list jobs
  app.get('/api/jobs', (req, res) => {
    const jobs = readJobs();
    return res.json(jobs);
  });

  // Forward job to Google Sheet (if configured)
  async function forwardJobToSheet(payload: Record<string, unknown>) {
    const sheetUrl = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL;
    if (!sheetUrl) return;
    try {
      const response = await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.warn(`Google Sheet forwarding failed: ${response.status} ${text}`);
      }
    } catch (err) {
      console.warn('Failed to forward job to Google Sheet:', err);
    }
  }

  // Create a new job posting
  app.post('/api/jobs', async (req, res) => {
    try {
      const { id, title, location, type, skills, compensation, contact, description, timestamp } = req.body;
      if (!title || !contact) {
        return res.status(400).json({ success: false, message: 'Job must include title and contact.' });
      }

      const job = {
        id: id || `JOB-${Math.floor(100000 + Math.random() * 900000)}`,
        title: String(title).trim(),
        location: String(location || '').trim(),
        type: String(type || '').trim(),
        skills: String(skills || '').trim(),
        compensation: String(compensation || '').trim(),
        contact: String(contact || '').trim(),
        description: String(description || '').trim(),
        timestamp: timestamp || new Date().toISOString(),
      };

      const jobs = readJobs();
      jobs.unshift(job);
      writeJobs(jobs);

      // Forward to Google Sheet if configured on server (keeps URL secret)
      forwardJobToSheet(job).catch(() => {});

      return res.json({ success: true, job });
    } catch (err: any) {
      console.error('Error saving job:', err);
      return res.status(500).json({ success: false, message: err.message || 'Failed to save job.' });
    }
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

      const recipients = getConfiguredRecipients();

      // Generate a unique Request ID
      const requestId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;

      const submissionPayload = {
        fullName: String(fullName).trim(),
        businessEmail: String(businessEmail).trim(),
        companyName: String(companyName || "").trim(),
        phoneNumber: String(phoneNumber || "").trim(),
        subject: String(subject || "General Inquiry").trim(),
        message: String(message).trim(),
        recipientEmails: recipients,
        requestId,
        source: "website-contact-form",
      };
      
      const newSubmission: Submission = {
        id: requestId,
        fullName: submissionPayload.fullName,
        businessEmail: submissionPayload.businessEmail,
        companyName: submissionPayload.companyName,
        phoneNumber: submissionPayload.phoneNumber,
        subject: submissionPayload.subject,
        message: submissionPayload.message,
        recipientEmails: recipients,
        timestamp: new Date().toISOString(),
        status: 'New'
      };

      // Read current, append, and save
      const submissions = readSubmissions();
      submissions.unshift(newSubmission); // Add to the top of the list
      writeSubmissions(submissions);

      await forwardSubmissionToSheet(submissionPayload, recipients);

      console.log(`New submission successfully saved local file with ID: ${requestId}`);

      return res.json({
        success: true,
        message: "Your message has been securely submitted and logged in our system.",
        requestId,
        recipients,
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
