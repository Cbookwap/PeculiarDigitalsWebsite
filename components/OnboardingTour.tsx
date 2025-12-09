import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: "Welcome to Peculiar Digitals",
    content: "We are your one-stop agency for premium digital solutions. From websites to mobile apps, we bring your vision to life.",
  },
  {
    title: "Tailored for You",
    content: "Whether it's a School Management System, a Church Portal, or a Workflow Automation, we craft solutions unique to your brand.",
  },
  {
    title: "Start Shopping",
    content: "Need something quick? Check out our Shop for premium templates, source codes, and white-label solutions ready to deploy.",
  },
  {
    title: "Let's Build Together",
    content: "Ready to scale? Book a consultation today and let's automate your success.",
  }
];

const OnboardingTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('peculiar_tour_seen');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 1500); // Delay slightly
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('peculiar_tour_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-slide-up">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-800 w-full">
          <div 
            className="h-full bg-accent-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-peculiar-500">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            {TOUR_STEPS[currentStep].title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 h-24">
            {TOUR_STEPS[currentStep].content}
          </p>

          <div className="flex justify-between items-center">
            <button 
              onClick={handleClose}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Skip Tour
            </button>
            
            <button 
              onClick={handleNext}
              className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}
              {currentStep === TOUR_STEPS.length - 1 ? <Check size={18} /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
