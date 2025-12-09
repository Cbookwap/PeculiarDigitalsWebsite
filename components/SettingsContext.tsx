import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { SiteSettings } from '../types';

interface SettingsContextType {
  settings: SiteSettings | null;
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await DataService.getSettings();
      setSettings(data);
      
      // Update Document Title
      if (data.brandName) {
        document.title = data.brandName;
      }
      
      // Update Favicon
      if (data.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = data.faviconUrl;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = data.faviconUrl;
          document.head.appendChild(newLink);
        }
      }

      // Inject Tawk.to Script if enabled
      if (data.chatWidgetType !== 'none' && (data.chatWidgetType === 'tawk' || data.chatWidgetType === 'both')) {
         if (data.tawkToPropertyId && data.tawkToWidgetId) {
             const scriptId = 'tawk-script';
             if (!document.getElementById(scriptId)) {
                 const s1 = document.createElement("script");
                 s1.id = scriptId;
                 s1.async = true;
                 s1.src = `https://embed.tawk.to/${data.tawkToPropertyId}/${data.tawkToWidgetId}`;
                 s1.charset = 'UTF-8';
                 s1.setAttribute('crossorigin', '*');
                 document.head.appendChild(s1);
             }
         }
      }

    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings: fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};