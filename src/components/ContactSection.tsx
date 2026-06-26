import React, { useState } from 'react';
import { Mail, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ContactSection() {
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [ticketId, setTicketId] = useState('');

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Business Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';
    return errors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus('submitting');
    
    // Simulate API delay
    setTimeout(() => {
      const generatedId = `BA-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setFormStatus('success');
    }, 1200);
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
                    href="mailto:growth@basofttech.com"
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#2563EB] transition-colors"
                  >
                    growth@basofttech.com
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
                        className={`w-full bg-white/85 border ${
                          formErrors.name ? 'border-red-400' : 'border-slate-200'
                        } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans`}
                      />
                      {formErrors.name && (
                        <span className="text-xs text-red-500 font-mono flex items-center gap-1">
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
                        className={`w-full bg-white/85 border ${
                          formErrors.email ? 'border-red-400' : 'border-slate-200'
                        } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans`}
                      />
                      {formErrors.email && (
                        <span className="text-xs text-red-500 font-mono flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {formErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company name (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block">
                      Company Name
                    </label>
                    <input
                      id="contact-form-company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="BA Software Technologies Ltd"
                      className="w-full bg-white/85 border border-slate-200 focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans"
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
                      placeholder="Describe your technical capacity gaps, infrastructure modernization objectives, or workload scale requirements..."
                      className={`w-full bg-white/85 border ${
                        formErrors.message ? 'border-red-400' : 'border-slate-200'
                      } focus:border-[#2563EB] rounded px-4 py-3 text-sm focus:outline-none transition font-sans resize-none`}
                    />
                    {formErrors.message && (
                      <span className="text-xs text-red-500 font-mono flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {formErrors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full py-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold uppercase tracking-widest text-xs rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 premium-btn-glow"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        Establishing direct gateway tunnel...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              ) : (
                // Elegant, high-craftsmanship Success State
                <div className="text-center py-10 space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] animate-bounce">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-slate-900">Message Received</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Thank you, {formData.name}. Your secure pipeline query has bypassed public routing layers and logged directly into our engineering backlog.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-100 p-5 rounded-lg text-left max-w-sm mx-auto space-y-3 font-mono text-xs shadow-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <span className="text-slate-400 font-semibold">TICKET ID:</span>
                      <span className="text-[#2563EB] font-bold">{ticketId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ROUTING STATUS:</span>
                      <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100">
                        Priority Engineering
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ESTIMATED RESPONSE:</span>
                      <span className="text-slate-700 font-semibold">Under 60 Minutes (SLA)</span>
                    </div>
                  </div>

                  <button
                    id="reset-form-btn"
                    onClick={() => {
                      setFormData({ name: '', email: '', company: '', message: '' });
                      setFormStatus('idle');
                    }}
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
