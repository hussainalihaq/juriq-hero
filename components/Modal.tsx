import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, initialEmail }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (initialEmail) {
        setFormData(prev => ({ ...prev, email: initialEmail }));
      }
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialEmail]);

  // Reset form when modal closes fully
  useEffect(() => {
    if (!isVisible && !isOpen) {
      setStatus('idle');
      setFormData({ name: '', email: '', role: '' });
    }
  }, [isVisible, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            full_name: formData.name,
            email: formData.email,
            role: formData.role,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Ideally show an error message to the user here, but for now we'll just reset or keep 'submitting' if you want to handle error states UI
      // pushing back to idle or keeping at submitting/error? 
      // Let's just log for now as requested, maybe set status back to idle or a new 'error' state if we had one.
      // For this implementation, let's keep it simple and maybe alert or just log.
      alert('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] dark:shadow-none dark:border dark:border-white/10 p-8 overflow-hidden transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-10 animate-fade-in">
            <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500 dark:text-green-400">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">You're on the list!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[280px]">
              We've reserved your spot. Keep an eye on your inbox for your exclusive access invite.
            </p>
            <button
              onClick={onClose}
              className="mt-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm px-8 py-3 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6 opacity-90">
              <div className="w-16 h-16 text-primary dark:text-white transition-colors duration-300">
                <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <mask id="logo-mask-modal">
                      <rect width="24" height="24" fill="white" />
                      <circle cx="18.5" cy="18.5" r="5.25" fill="black" />
                    </mask>
                  </defs>
                  <g transform="translate(18, 18) scale(2.5)">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" mask="url(#logo-mask-modal)" />
                    <path d="M18.5 15.75 A2.75 2.75 0 1 1 18.5 21.25 A2.75 2.75 0 1 1 18.5 15.75 M18.5 17 A1.5 1.5 0 1 0 18.5 20 A1.5 1.5 0 1 0 18.5 17" fill="currentColor" fillRule="evenodd" />
                  </g>
                </svg>
              </div>
              <h2 className="logo-text text-xl">juriq</h2>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight transition-colors duration-300">
              Secure your spot<br />on the waitlist
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-[280px] transition-colors duration-300">
              Join 2,000+ legal professionals gaining early access to the future of law.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div className="group relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl focus:ring-primary dark:focus:ring-white focus:border-primary dark:focus:border-white block p-3.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium transition-colors hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 outline-none"
                  placeholder="Full Name"
                  required
                  type="text"
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="group relative">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl focus:ring-primary dark:focus:ring-white focus:border-primary dark:focus:border-white block p-3.5 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium transition-colors hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 outline-none"
                  placeholder="Work Email"
                  required
                  type="email"
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold rounded-xl focus:ring-primary dark:focus:ring-white focus:border-primary dark:focus:border-white block p-3.5 pr-10 appearance-none cursor-pointer transition-colors hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-700 outline-none invalid:text-slate-400 dark:invalid:text-slate-500"
                  disabled={status === 'submitting'}
                >
                  <option value="" disabled>Professional Role</option>
                  <option value="lawyer" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800">Lawyer</option>
                  <option value="student" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800">Law Student</option>
                  <option value="corporate" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800">Corporate Counsel</option>
                  <option value="paralegal" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800">Paralegal</option>
                  <option value="other" className="text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full mt-4 bg-primary dark:bg-white hover:bg-navy-deep dark:hover:bg-slate-200 text-white dark:text-primary font-bold rounded-xl text-sm px-5 py-4 text-center shadow-lg shadow-primary/25 hover:shadow-primary/40 dark:shadow-white/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm My Access'
                )}
              </button>
            </form>

            <p className="mt-5 text-[10px] text-slate-400 font-medium tracking-wide">
              No credit card required. You will be notified when your spot is ready.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;