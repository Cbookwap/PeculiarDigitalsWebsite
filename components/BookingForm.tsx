import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { SERVICES_LIST } from '../constants';
import { ChevronRight, ChevronLeft, Check, Send } from 'lucide-react';

interface BookingFormProps {
  initialService?: string;
  className?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ initialService = '', className = '' }) => {
  const [state, handleSubmit] = useForm("myzqokgn");
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    subService: '',
    // Conditional Fields
    websitePages: '1-5',
    hasDomain: 'No',
    hasHosting: 'No',
    cmsPreference: 'No Preference',
    appPlatform: 'Both (iOS & Android)',
    existingTech: '',
    budget: 'Not sure',
    message: ''
  });

  if (state.succeeded) {
    return (
      <div className="p-8 bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-2xl text-center shadow-lg">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300">
          <Check size={32} />
        </div>
        <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Request Received!</h3>
        <p className="text-slate-700 dark:text-slate-300">
          We have received your details. A member of our team will contact you shortly via WhatsApp or Email.
        </p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Basic Validation before moving next
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) return alert("Please fill in all contact details.");
    }
    if (step === 2) {
      if (!formData.service) return alert("Please select a service.");
    }
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderConditionalFields = () => {
    switch (formData.service) {
      case 'website':
        return (
          <div className="space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-peculiar-600 uppercase tracking-wide">Website Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 opacity-80">Pages Estimate</label>
                <select name="websitePages" value={formData.websitePages} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm">
                  <option value="1-5">1-5 Pages</option>
                  <option value="5-10">5-10 Pages</option>
                  <option value="10-20">10-20 Pages</option>
                  <option value="20+">20+ Pages</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-80">CMS Preference</label>
                <select name="cmsPreference" value={formData.cmsPreference} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm">
                  <option value="No Preference">Advice Me</option>
                  <option value="WordPress">WordPress</option>
                  <option value="React/Custom">React (Custom Code)</option>
                  <option value="Wix/Squarespace">Wix/Squarespace</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 opacity-80">Have Domain?</label>
                <select name="hasDomain" value={formData.hasDomain} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 opacity-80">Have Hosting?</label>
                <select name="hasHosting" value={formData.hasHosting} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'mobile':
        return (
          <div className="space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-peculiar-600 uppercase tracking-wide">App Details</h4>
            <div>
               <label className="block text-xs font-medium mb-1 opacity-80">Target Platform</label>
               <select name="appPlatform" value={formData.appPlatform} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-sm">
                  <option value="Both">Both (iOS & Android)</option>
                  <option value="Android Only">Android Only</option>
                  <option value="iOS Only">iOS Only</option>
               </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col h-full ${className}`}>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 px-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= s 
              ? 'bg-peculiar-600 text-white shadow-lg scale-110' 
              : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              {step > s ? <Check size={16} /> : s}
            </div>
            {s !== 3 && (
              <div className={`w-12 h-1 mx-2 rounded transition-colors duration-300 ${step > s ? 'bg-peculiar-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-grow">
        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Let's start with your contact details</h3>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Full Name</label>
              <input
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Email Address</label>
              <input
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Phone / WhatsApp</label>
              <input
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
                placeholder="+234..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Project Info */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">What can we build for you?</h3>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Service Category</label>
              <select
                name="service"
                value={formData.service}
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData(prev => ({ ...prev, subService: '' }));
                }}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
              >
                <option value="">Select a Service</option>
                {Object.keys(SERVICES_LIST).map((key) => (
                  <option key={key} value={key}>{SERVICES_LIST[key].name}</option>
                ))}
              </select>
            </div>

            {formData.service && (
              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Specific Need (Optional)</label>
                <select
                  name="subService"
                  value={formData.subService}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
                >
                  <option value="">Select Specifics</option>
                  {SERVICES_LIST[formData.service]?.subItems.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Dynamic Fields */}
            {renderConditionalFields()}
          </div>
        )}

        {/* Step 3: Budget & Message */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Final Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Estimated Budget</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
              >
                <option value="Not sure">Not sure yet</option>
                <option value="₦50k - ₦100k">₦50k - ₦100k</option>
                <option value="₦100k - ₦300k">₦100k - ₦300k</option>
                <option value="₦300k - ₦1m">₦300k - ₦1m</option>
                <option value="₦1m+">₦1m+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Project Description</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none"
                placeholder="Tell us about the project goals..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8 pt-4 border-t border-white/10">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={18} /> Back
          </button>
        )}
        
        {step < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex-grow px-6 py-3 rounded-lg bg-peculiar-600 text-white font-bold hover:bg-peculiar-500 transition-colors flex items-center justify-center gap-2 ml-auto"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={state.submitting}
            className="flex-grow px-6 py-3 rounded-lg bg-gradient-to-r from-peculiar-600 to-accent-500 text-white font-bold hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ml-auto disabled:opacity-70"
          >
            {state.submitting ? 'Sending...' : 'Submit Request'} <Send size={18} />
          </button>
        )}
      </div>

      {/* Hidden Fields for Formspree to capture state data */}
      {step === totalSteps && (
        <>
           <input type="hidden" name="websitePages" value={formData.websitePages} />
           <input type="hidden" name="hasDomain" value={formData.hasDomain} />
           <input type="hidden" name="hasHosting" value={formData.hasHosting} />
           <input type="hidden" name="cmsPreference" value={formData.cmsPreference} />
           <input type="hidden" name="appPlatform" value={formData.appPlatform} />
        </>
      )}
    </form>
  );
};

export default BookingForm;