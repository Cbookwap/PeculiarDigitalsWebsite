
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, MessageCircle, ArrowUp, Briefcase, ShoppingBag, BookOpen, User, Home as HomeIcon, LayoutDashboard, LogIn, DollarSign } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useSettings } from './SettingsContext';
import OnboardingTour from './OnboardingTour';
import CookieConsent from './CookieConsent';
import { supabase } from '../services/supabaseClient';

const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-peculiar-500 ${
      isActive ? 'text-peculiar-500' : 'text-slate-600 dark:text-slate-300'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all ${
      isActive 
      ? 'bg-peculiar-50 dark:bg-peculiar-900/20 text-peculiar-600 dark:text-peculiar-400' 
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Scroll to top logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Chat Widget Positioning
  const chatPositionClass = settings?.chatPosition === 'left' ? 'left-4 md:left-6' : 'right-4 md:right-6';
  const shouldShowChat = () => {
    if (!settings) return true;
    if (settings.chatWidgetType === 'none') return false;
    // Mobile check
    const isMobile = window.innerWidth < 768;
    if (settings.chatVisibility === 'mobile' && !isMobile) return false;
    if (settings.chatVisibility === 'desktop' && isMobile) return false;
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-peculiar-500 selection:text-white">
      <OnboardingTour />
      <CookieConsent />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center z-50">
              <NavLink to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto" />
                ) : null}
                <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-peculiar-600 to-accent-500">
                  {settings?.brandName || "Peculiar Digitals"}
                </span>
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" className={navLinkClass}>About & Services</NavLink>
              <NavLink to="/projects" className={navLinkClass}>Projects</NavLink>
              <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
              <NavLink to="/pricing" className={navLinkClass}>Pricing</NavLink>
              <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
              
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <NavLink 
                  to="/admin" 
                  className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all ${
                    session 
                      ? 'bg-peculiar-100 dark:bg-peculiar-900/30 text-peculiar-600 dark:text-peculiar-300'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  {session ? <LayoutDashboard size={14}/> : <LogIn size={14}/>}
                  {session ? 'Dashboard' : 'Login'}
                </NavLink>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4 z-50">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleMenu}
        />
        
        {/* Drawer */}
        <div 
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col pt-16 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
             <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-slate-900 dark:text-white">Menu</span>
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
             </div>

             <div className="space-y-2 flex-grow">
                <NavLink to="/" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <HomeIcon size={20} /> Home
                </NavLink>
                <NavLink to="/about" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <User size={20} /> About & Services
                </NavLink>
                <NavLink to="/projects" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <Briefcase size={20} /> Projects
                </NavLink>
                <NavLink to="/shop" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <ShoppingBag size={20} /> Shop
                </NavLink>
                <NavLink to="/pricing" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <DollarSign size={20} /> Pricing
                </NavLink>
                <NavLink to="/blog" className={mobileNavLinkClass} onClick={toggleMenu}>
                  <BookOpen size={20} /> Blog
                </NavLink>
             </div>

             <div className="pt-6 border-t border-slate-100 dark:border-slate-800 pb-20">
                <NavLink to="/admin" onClick={toggleMenu} className={`block text-center text-sm font-bold uppercase tracking-widest py-3 rounded-lg ${
                   session 
                   ? 'bg-peculiar-600 text-white shadow-lg' 
                   : 'text-slate-400 hover:text-slate-600 bg-slate-50 dark:bg-slate-800'
                }`}>
                  {session ? 'Go to Dashboard' : 'Admin Login'}
                </NavLink>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow relative">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-peculiar-600 to-accent-500">
                  {settings?.brandName || "Peculiar Digitals"}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                Empowering businesses with peculiar digital solutions. We build the future of web and mobile experiences.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><NavLink to="/about" className="hover:text-peculiar-500 transition-colors">Services</NavLink></li>
                <li><NavLink to="/projects" className="hover:text-peculiar-500 transition-colors">Our Work</NavLink></li>
                <li><NavLink to="/shop" className="hover:text-peculiar-500 transition-colors">Store</NavLink></li>
              </ul>
            </div>
            <div>
               <h4 className="font-bold text-slate-900 dark:text-white mb-4">Connect</h4>
               {settings?.contactEmail && <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Email: {settings.contactEmail}</p>}
               {settings?.contactPhone && <p className="text-slate-600 dark:text-slate-400 text-sm">Call: {settings.contactPhone}</p>}
               {settings?.address && <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{settings.address}</p>}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} {settings?.brandName || "Peculiar Digital Solutions"}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Interaction Buttons */}
      <div className={`fixed bottom-4 ${chatPositionClass} z-40 flex flex-col gap-3 md:gap-4`}>
        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className={`p-2 md:p-3 bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-lg transition-all duration-300 transform self-end ${
            showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* WhatsApp - Only show if enabled and visible */}
        {shouldShowChat() && (settings?.chatWidgetType === 'whatsapp' || settings?.chatWidgetType === 'both') && settings?.whatsappNumber && (
            <a 
            href={`https://wa.me/${settings.whatsappNumber.replace('+', '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 md:p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
            aria-label="Chat on WhatsApp"
            >
            <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            </a>
        )}
      </div>
    </div>
  );
};

export default Layout;
