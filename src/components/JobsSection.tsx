import React, { useEffect, useState } from 'react';
import { Briefcase, ArrowUpRight, RefreshCw } from 'lucide-react';

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

const LOCAL_KEY = 'ba_jobs_local_v1';

export default function JobsSection() {
  const SHEET_READ_URL = (import.meta.env.VITE_GOOGLE_SHEET_READ_URL as string) || (import.meta.env.VITE_GOOGLE_SCRIPT_URL as string) || '';
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const saveLocal = (next: JobPost[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    setJobs(next);
  };

  const loadJobs = async () => {
    setLoading(true);
    setError(null);

    if (SHEET_READ_URL) {
      try {
        const res = await fetch(SHEET_READ_URL);
        if (!res.ok) throw new Error(`Sheet read failed (${res.status})`);
        const data = await res.json();
        if (Array.isArray(data)) {
          saveLocal(data);
          setLoading(false);
          return;
        }
        throw new Error('Sheet returned unexpected data.');
      } catch (err: any) {
        console.warn('Google Sheet read failed, falling back to server/local:', err);
        setError(`Google Sheet read failed: ${err.message || err}`);
      }
    } else {
      setError('No spreadsheet URL configured for job listings.');
    }

    try {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('API jobs fetch failed');
      const data = await response.json();
      if (Array.isArray(data)) {
        saveLocal(data);
        setError(null);
        setLoading(false);
        return;
      }
      throw new Error('API returned unexpected data.');
    } catch (err: any) {
      console.warn('Fallback jobs fetch failed:', err);
      if (!jobs.length) {
        setError((prev: string | null) => prev ? `${prev} / API fallback failed: ${err.message || err}` : `API fallback failed: ${err.message || err}`);
      }
    }

    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as JobPost[];
        setJobs(parsed);
        setError((prev: string | null) => prev ? `${prev} / showing cached jobs.` : 'Showing cached job postings.');
      } catch {
        setJobs([]);
      }
    } else {
      setJobs([]);
      if (!error) setError('No job postings available yet.');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);
  return (
    <section id="jobs" className="py-12 md:py-16 bg-gradient-to-b from-transparent to-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 reveal-on-scroll">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB] mb-2">Career Opportunities</h2>
          <p className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3">Open Positions & Employer Postings</p>
          <p className="text-base text-slate-600 mb-8">This page loads current job listings directly from your spreadsheet.</p>
          <div className="mt-6">
            <button
              onClick={loadJobs}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Listings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center text-sm text-slate-500 py-8">Loading jobs…</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-sm text-slate-500 py-8">No jobs posted yet.</div>
          ) : (
            jobs.map((job: JobPost) => (
              <article key={job.id || `${job.title}-${job.timestamp}`} className="reveal-on-scroll premium-card p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{job.title || 'Untitled Role'}</h3>
                    <p className="text-xs text-slate-500">
                      {job.type || 'N/A'} · {job.location || 'Remote / Flexible'} · {job.compensation || 'Competitive'}
                    </p>
                    <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">{job.description || 'No description provided.'}</p>
                    {job.skills && <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">Skills:</span> {job.skills}</p>}
                  </div>
                  <div className="space-y-3 text-right">
                    <span className="text-xs text-slate-400 block">{job.timestamp ? new Date(job.timestamp).toLocaleString() : 'No timestamp'}</span>
                    {job.contact ? (
                      <a
                        href={`mailto:${job.contact}?subject=Application for ${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Apply
                      </a>
                    ) : (
                      <div className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500">No contact email</div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
          {error && !loading ? (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
