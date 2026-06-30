import React, { useState, useEffect } from 'react';
import { Mail, Phone, AlertCircle, CheckCircle2, AlertTriangle, Trash2, Download, RefreshCw, Lock, Shield, Search, Filter, ChevronDown, Clock, Eye, Sparkles } from 'lucide-react';
import { submitContactForm } from '../services/contactService';

interface ContactSectionProps {
  initialFormData?: Partial<{ name: string; email: string; company: string; phone: string; subject: string; message: string } | Record<string, string>> | null;
}

export default function ContactSection({ initialFormData = null }: ContactSectionProps) {
  // Form states matching requested required and optional fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [requestId, setRequestId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Administrative CRM States & Callbacks
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

  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'In Progress' | 'Contacted' | 'Resolved'>('All');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        console.error("Failed to fetch submissions");
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus as any } : sub));
        showActionMessage('success', `Request ${id} status updated to ${newStatus}.`);
      } else {
        showActionMessage('error', 'Failed to update status.');
      }
    } catch (err) {
      showActionMessage('error', 'Network error while updating status.');
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete request ${id}?`)) return;
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        showActionMessage('success', `Request ${id} deleted successfully.`);
      } else {
        showActionMessage('error', 'Failed to delete request.');
      }
    } catch (err) {
      showActionMessage('error', 'Network error while deleting request.');
    }
  };

  const handleClearAllSubmissions = async () => {
    if (!window.confirm("CRITICAL: Are you sure you want to clear ALL contact inquiries from the server? This action is irreversible.")) return;
    try {
      const response = await fetch('/api/submissions/clear', {
        method: 'POST'
      });
      if (response.ok) {
        setSubmissions([]);
        showActionMessage('success', 'All contact submissions purged from the server.');
      } else {
        showActionMessage('error', 'Failed to clear submissions.');
      }
    } catch (err) {
      showActionMessage('error', 'Network error while purging database.');
    }
  };

  const showActionMessage = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'admin' || passcode.trim() === 'admin123') {
      setIsAdminAuthorized(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid access code. Please use default code: "admin"');
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      showActionMessage('error', 'No submissions to export.');
      return;
    }
    const headers = ['Request ID', 'Timestamp', 'Full Name', 'Business Email', 'Company Name', 'Phone Number', 'Subject', 'Message', 'Status'];
    const rows = submissions.map(s => [
      s.id,
      new Date(s.timestamp).toLocaleString(),
      s.fullName,
      s.businessEmail,
      s.companyName,
      s.phoneNumber,
      s.subject,
      s.message.replace(/\n/g, ' '),
      s.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showActionMessage('success', 'Inquiries exported as CSV successfully.');
  };

  useEffect(() => {
    if (isAdminAuthorized) {
      fetchSubmissions();
    }
  }, [isAdminAuthorized]);

  // Form input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific error as the user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    // Reset general submit error on input
    if (submitError) {
      setSubmitError(null);
    }
  };

  // When parent supplies initial form values (e.g. via "Post Job" CTA), prefill the form
  useEffect(() => {
    if (initialFormData) {
      setFormData((prev) => ({ ...prev, ...initialFormData }));
    }
  }, [initialFormData]);

  // Proper trim-enabled validation conforming to requirements
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // 1. Validate Full Name (Required, Trimmed, Reject empty)
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Full Name is required and cannot be empty.';
    }

    // 2. Validate Business Email (Required, Trimmed, Reject empty, Proper format)
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'Business Email is required and cannot be empty.';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'Please provide a valid business email address.';
    }

    // 3. Validate Detailed Message (Required, Trimmed, Reject empty)
    if (!formData.message || formData.message.trim() === '') {
      errors.message = 'Detailed message is required to route your query.';
    }

    return errors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form inputs
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Enter submitting state (automatically disables buttons & shows loading spinner)
    setFormStatus('submitting');
    
    try {
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        setRequestId(response.requestId || `REQ-${Math.floor(100000 + Math.random() * 900000)}`);
        setFormStatus('success');
      } else {
        throw new Error(response.message || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      console.error('Contact submit error:', error);
      setSubmitError(error.message || 'Failed to connect to Google Sheet backend. Please verify your script URL configuration.');
      setFormStatus('idle');
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
    });
    setFormErrors({});
    setSubmitError(null);
    setFormStatus('idle');
    setRequestId('');
  };

  return (
    <section id="contact" className="py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Contact Details) */}
          <div className="lg:col-span-5 space-y-6 text-left reveal-on-scroll">
            <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded">
              CONNECT TO BASE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Let's Start a Conversation
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
              Have an ambitious project blueprint or need to fill crucial technical capacity gaps? Reach out to our strategy teams. We consistently answer all verified business inquiries within 24 business hours.
            </p>

            <div className="pt-6 space-y-4 border-t border-slate-100">
              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">ENTERPRISE INQUIRIES</span>
                  <a
                    href="mailto:aahil@ba-softtech.com?cc=Nipun@ba-softtech.com&subject=BA%20Soft%20Tech%20Inquiry"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                  >
                    aahil@ba-softtech.com • Nipun@ba-softtech.com
                  </a>
                </div>
              </div>


            </div>
          </div>

          {/* Right Column (Lead Generation Form) */}
          <div className="lg:col-span-7 reveal-on-scroll">
            <div className="premium-card p-6 sm:p-10 rounded-2xl shadow-lg border border-slate-200/50">
              
              {formStatus !== 'success' ? (
                <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                  
                  {/* General Submit Error Alert Banner */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3.5 text-red-800 text-sm">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-red-950">Submission Failed</span>
                        <p className="mt-0.5 text-red-800 leading-relaxed font-light">{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Full Name *
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Dr. Evelyn Vance"
                        disabled={formStatus === 'submitting'}
                        className={`w-full bg-white/85 border ${
                          formErrors.name ? 'border-red-400' : 'border-slate-200'
                        } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans disabled:opacity-50`}
                      />
                      {formErrors.name && (
                        <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Email input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Business Email *
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="vance@ba-softtech.com"
                        disabled={formStatus === 'submitting'}
                        className={`w-full bg-white/85 border ${
                          formErrors.email ? 'border-red-400' : 'border-slate-200'
                        } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans disabled:opacity-50`}
                      />
                      {formErrors.email && (
                        <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Company name and Phone (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Company name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Company Name <span className="text-slate-400 font-light lowercase">(optional)</span>
                      </label>
                      <input
                        id="contact-form-company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="BA Software Technologies Ltd"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-white/85 border border-slate-200 focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans disabled:opacity-50"
                      />
                    </div>

                    {/* Phone input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Phone Number <span className="text-slate-400 font-light lowercase">(optional)</span>
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 019-2831"
                        disabled={formStatus === 'submitting'}
                        className="w-full bg-white/85 border border-slate-200 focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Row 3: Subject (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                      Subject <span className="text-slate-400 font-light lowercase">(optional)</span>
                    </label>
                    <input
                      id="contact-form-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enterprise Scaling or Staffing Inquiry"
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-white/85 border border-slate-200 focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans disabled:opacity-50"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                      Detailed Message *
                    </label>
                    <textarea
                      id="contact-form-message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={formStatus === 'submitting'}
                      placeholder="Describe your technical capacity gaps, infrastructure modernization objectives, or workload scale requirements..."
                      className={`w-full bg-white/85 border ${
                        formErrors.message ? 'border-red-400' : 'border-slate-200'
                      } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans resize-none disabled:opacity-50`}
                    />
                    {formErrors.message && (
                      <span className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button (Includes loading spinner & prevents double-clicking via 'disabled') */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold uppercase tracking-widest text-xs rounded transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 premium-btn-glow disabled:opacity-75 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Establishing Secure Connection...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              ) : (
                // Elegant, high-craftsmanship Success State Alert
                <div className="text-center py-10 space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-slate-900">Message Received</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Thank you, {formData.name}. Your secure pipeline query has been saved to our databases and logged directly in our queue.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-100 p-5 rounded-lg text-left max-w-sm mx-auto space-y-3 font-mono text-xs shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <span className="text-slate-400 font-semibold">REQUEST ID:</span>
                      <span className="text-[#2563EB] font-bold">{requestId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ROUTING STATUS:</span>
                      <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        Priority Saved
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ESTIMATED RESPONSE:</span>
                      <span className="text-slate-700 font-semibold">Under 60 Minutes (SLA)</span>
                    </div>
                  </div>

                  <button
                    id="reset-form-btn"
                    onClick={handleResetForm}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded transition-all duration-300 cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>


      </div>
    </section>
  );
}
