export interface ContactData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Function to submit contact data to the Google Apps Script Web App
export async function submitContactForm(data: ContactData): Promise<{ success: boolean; message: string; requestId?: string }> {
  // Prepare submission payload matching our Apps Script schema
  const payload = {
    fullName: data.name.trim(),
    businessEmail: data.email.trim(),
    companyName: (data.company || '').trim(),
    phoneNumber: (data.phone || '').trim(),
    subject: (data.subject || '').trim(),
    message: data.message.trim()
  };

  try {
    // Call our server-side API proxy endpoint which handles the cross-origin Google Script request securely
    const response = await fetch('/api/submit-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || `HTTP error: Received status ${response.status}`);
    }

    if (result && result.success) {
      return {
        success: true,
        message: result.message || 'Message submitted successfully!',
        requestId: result.requestId
      };
    } else {
      throw new Error(result?.message || 'The Google Sheet server returned an unsuccessful response.');
    }
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    const userFriendlyMsg = error.message || 'Failed to submit form due to a server or network connection error. Please try again.';
    throw new Error(userFriendlyMsg);
  }
}
