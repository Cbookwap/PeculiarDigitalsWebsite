import React, { useState, useEffect } from 'react';
import { useSettings } from './SettingsContext';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('peculiar_cookie_consent');
    if (!consent && settings?.cookieConsentEnabled) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, [settings]);

  const handleAccept = () => {
    localStorage.setItem('peculiar_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white p-6 rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-2">We value your privacy</h4>
          <p className="text-sm text-slate-300">
            We use cookies to enhance your experience, analyze site traffic, and serve tailored content. 
            By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsVisible(false)}
            className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 rounded-lg bg-peculiar-600 hover:bg-peculiar-500 transition-colors text-sm font-bold shadow-lg shadow-peculiar-900/50"
          >
            Accept All
          </button>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white md:hidden">
            <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;