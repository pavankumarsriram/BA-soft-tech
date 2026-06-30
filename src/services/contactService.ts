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

  const scriptUrl = (import.meta.env.VITE_GOOGLE_SCRIPT_URL as string) || '';

  try {
    let result: any = null;
    let response: Response | null = null;

    if (scriptUrl) {
      try {
        response = await fetch(scriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        result = await response.json().catch(() => null);

        if (response.ok && result?.success) {
          return {
            success: true,
            message: result.message || 'Message submitted successfully!',
            requestId: result.requestId
          };
        }

        console.warn('Google Script POST failed or returned no success:', response.status, result);
      } catch (err) {
        console.warn('Google Script POST threw error, falling back to server proxy:', err);
      }
    }

    response = await fetch('/api/submit-contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    result = await response.json().catch(() => null);

    if (response.ok && result?.success) {
      return {
        success: true,
        message: result.message || 'Message submitted successfully!',
        requestId: result.requestId
      };
    }

    throw new Error(result?.message || `HTTP error: Received status ${response?.status}`);
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    const userFriendlyMsg = error.message || 'Failed to submit form due to a server or network connection error. Please try again.';
    throw new Error(userFriendlyMsg);
  }
}

