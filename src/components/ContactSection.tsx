import React, { useState, useEffect } from 'react';
import { Mail, Phone, AlertCircle, CheckCircle2, AlertTriangle, Trash2, Download, RefreshCw, Lock, Shield, Search, Filter, ChevronDown, Clock, Eye, Sparkles } from 'lucide-react';
import { submitContactForm } from '../services/contactService';

export default function ContactSection() {
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
                    href="mailto:info@yourcompany.com"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                  >
                    info@yourcompany.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-mono block">DIRECT SECURE CALLBACK LINE</span>
                  <a
                    href="tel:+15550192831"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                  >
                    +1 (555) 019-2831
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

        {/* --- ADMINISTRATIVE CRM SECTION --- */}
        <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col items-center">
          <button
            id="admin-console-toggle-btn"
            onClick={() => setIsAdminPanelVisible(!isAdminPanelVisible)}
            className="text-xs font-mono text-slate-400 hover:text-[#2563EB] flex items-center gap-1.5 transition-all duration-300 py-1.5 px-3 rounded hover:bg-blue-50/50 cursor-pointer"
          >
            <Shield className="h-3 w-3" />
            {isAdminPanelVisible ? "Close Secure CRM Workspace" : "Launch Administrative CRM Console (Admin)"}
          </button>

          {isAdminPanelVisible && (
            <div className="w-full mt-8 animate-fadeIn text-left">
              {!isAdminAuthorized ? (
                /* Secure Login Gateway Card */
                <div className="max-w-md mx-auto bg-white border border-slate-200/80 shadow-lg rounded-xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-slate-900">Administrative Gate</h4>
                      <p className="text-xs text-slate-500">Access registered contact form submissions</p>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyPasscode} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                        Gateway Access Passcode
                      </label>
                      <input
                        type="password"
                        placeholder="Enter admin passcode (default: admin)"
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          if (passcodeError) setPasscodeError('');
                        }}
                        className="w-full border border-slate-200 rounded px-4 py-2.5 text-sm font-mono focus:border-[#2563EB] focus:outline-none transition"
                      />
                      {passcodeError && (
                        <p className="text-xs text-red-500 font-mono flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {passcodeError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-black text-white font-semibold text-xs tracking-wider uppercase rounded transition duration-200 cursor-pointer"
                    >
                      Verify Gateway
                    </button>
                  </form>

                  <div className="bg-slate-50 border border-slate-100 p-3 rounded text-[11px] font-mono text-slate-400 space-y-1">
                    <span className="font-bold text-slate-500 uppercase block">DEMO TESTING GUIDE</span>
                    <p>Enter passcode <code className="text-[#2563EB] font-bold">admin</code> to authenticate. This bypasses fragile third-party sheet authorization hurdles by logging lead inquiries to local, fast server-side workspace files.</p>
                  </div>
                </div>
              ) : (
                /* Authenticated CRM Workspace Dashboard */
                <div className="space-y-6 bg-slate-50/50 border border-slate-200/60 rounded-xl p-5 md:p-8 shadow-inner">
                  {/* Dashboard Title Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#2563EB] animate-pulse" />
                        <h4 className="font-display font-extrabold text-xl text-slate-900">CRM Interaction Workspace</h4>
                      </div>
                      <p className="text-xs text-slate-500">Live feed monitoring, pipeline follow-up, and spreadsheet export metrics.</p>
                    </div>

                    {/* Quick notification bubble */}
                    {actionMessage && (
                      <div className={`text-xs font-mono font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 animate-fadeIn ${
                        actionMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {actionMessage.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                        {actionMessage.text}
                      </div>
                    )}
                  </div>

                  {/* Operational KPI Dashboard Widgets */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                      <span className="text-slate-400 font-mono text-[10px] uppercase block tracking-wider">TOTAL INQUIRIES</span>
                      <span className="text-2xl font-extrabold text-slate-900 font-display block mt-1">{submissions.length}</span>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                      <span className="text-amber-500 font-mono text-[10px] uppercase block tracking-wider">NEW LEADS</span>
                      <span className="text-2xl font-extrabold text-amber-600 font-display block mt-1">
                        {submissions.filter(s => s.status === 'New').length}
                      </span>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                      <span className="text-[#2563EB] font-mono text-[10px] uppercase block tracking-wider">ACTIVE PIPELINE</span>
                      <span className="text-2xl font-extrabold text-[#2563EB] font-display block mt-1">
                        {submissions.filter(s => s.status === 'In Progress' || s.status === 'Contacted').length}
                      </span>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                      <span className="text-green-500 font-mono text-[10px] uppercase block tracking-wider">RESOLVED</span>
                      <span className="text-2xl font-extrabold text-green-600 font-display block mt-1">
                        {submissions.filter(s => s.status === 'Resolved').length}
                      </span>
                    </div>
                  </div>

                  {/* Workspace Filters & Download Tools */}
                  <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                    {/* Left Filters */}
                    <div className="flex flex-col sm:flex-row gap-2.5 flex-1 max-w-2xl">
                      {/* Search */}
                      <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search sender, company, request ID, keywords..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-xs focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      {/* Status filter select */}
                      <div className="relative min-w-[140px]">
                        <select
                          value={statusFilter}
                          onChange={(e: any) => setStatusFilter(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs appearance-none focus:outline-none focus:border-[#2563EB] font-sans"
                        >
                          <option value="All">All Inquiries</option>
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Right Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        title="Sync Inquiries Feed"
                        onClick={fetchSubmissions}
                        disabled={loadingSubmissions}
                        className="p-2 border border-slate-200 hover:border-[#2563EB] hover:text-[#2563EB] bg-white rounded text-slate-600 transition cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                      </button>

                      <button
                        onClick={exportToCSV}
                        className="px-3.5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-200"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export CSV
                      </button>

                      <button
                        onClick={handleClearAllSubmissions}
                        disabled={submissions.length === 0}
                        className="px-3.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Purge Db
                      </button>
                    </div>
                  </div>

                  {/* Submissions Feed List */}
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {loadingSubmissions ? (
                      /* Skeleton Loading Panel */
                      <div className="space-y-3 py-4 text-center">
                        <div className="animate-pulse flex space-x-4 max-w-md mx-auto">
                          <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                            <div className="space-y-2">
                              <div className="h-3 bg-slate-200 rounded mx-auto"></div>
                              <div className="h-3 bg-slate-200 rounded w-5/6 mx-auto"></div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-2">Connecting database sockets...</p>
                      </div>
                    ) : submissions.filter(sub => {
                      const matchesSearch = 
                        sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        sub.id.toLowerCase().includes(searchQuery.toLowerCase());
                        
                      const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    }).length === 0 ? (
                      /* Empty State alert */
                      <div className="text-center py-12 bg-white border border-slate-100 rounded-lg space-y-3">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400">
                          <Search className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-bold text-slate-700">No Inquiries Found</h5>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto">
                            {submissions.length === 0 
                              ? "New form entries submitted by users will stream into this dashboard instantly." 
                              : "No inquiry matches the active search query or filter index."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Submissions List Loops */
                      submissions
                        .filter(sub => {
                          const matchesSearch = 
                            sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.businessEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.id.toLowerCase().includes(searchQuery.toLowerCase());
                            
                          const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((sub) => (
                          <div key={sub.id} className="bg-white border border-slate-200/80 hover:border-[#2563EB]/40 rounded-lg p-5 shadow-sm transition hover:shadow duration-200 space-y-4 animate-slideIn">
                            {/* Card Header Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-50">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                                  {sub.id}
                                </span>
                                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(sub.timestamp).toLocaleString()}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Lead Status Controls */}
                                <div className="relative">
                                  <select
                                    value={sub.status}
                                    onChange={(e) => handleUpdateStatus(sub.id, e.target.value)}
                                    className={`text-[10px] font-mono font-bold uppercase rounded px-2.5 py-1 pr-6 border appearance-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer ${
                                      sub.status === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      sub.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      sub.status === 'Contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                      'bg-green-50 text-green-700 border-green-200'
                                    }`}
                                  >
                                    <option value="New">🆕 New</option>
                                    <option value="In Progress">⚙️ In Progress</option>
                                    <option value="Contacted">💬 Contacted</option>
                                    <option value="Resolved">✅ Resolved</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-2 h-2.5 w-2.5 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Delete lead item */}
                                <button
                                  onClick={() => handleDeleteSubmission(sub.id)}
                                  className="p-1 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded transition cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">SENDER</span>
                                <span className="font-bold text-slate-900 block mt-0.5">{sub.fullName}</span>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">BUSINESS EMAIL</span>
                                <a href={`mailto:${sub.businessEmail}`} className="font-semibold text-[#2563EB] hover:underline block mt-0.5 break-all">
                                  {sub.businessEmail}
                                </a>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">COMPANY NAME</span>
                                <span className="text-slate-800 font-medium block mt-0.5">{sub.companyName || "Not Specified"}</span>
                              </div>
                              <div>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block">PHONE NUMBER</span>
                                <span className="text-slate-800 block mt-0.5">{sub.phoneNumber || "Not Specified"}</span>
                              </div>
                            </div>

                            {/* Subject & Message Content Box */}
                            <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                              <p className="font-bold text-slate-800">
                                <span className="font-mono text-[10px] uppercase text-slate-400 mr-2">Subject:</span>
                                {sub.subject || "No Subject"}
                              </p>
                              <div className="text-slate-600 leading-relaxed font-sans whitespace-pre-wrap mt-2 select-text border-t border-slate-200/50 pt-2 text-[12px]">
                                {sub.message}
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
