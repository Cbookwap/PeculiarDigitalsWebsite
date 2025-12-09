
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { PricingPackage, ServiceInquiry } from '../types';
import { ArrowLeft, CheckCircle, Send, Loader } from 'lucide-react';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<PricingPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ServiceInquiry>>({
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsapp: '',
    projectDescription: '',
    additionalDetails: '',
    hasDomain: 'No',
    hasHosting: 'No',
    budgetRange: ''
  });

  useEffect(() => {
    if (id) {
      DataService.getPackageById(id).then((data) => {
        setPkg(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setSubmitting(true);

    const inquiryPayload: ServiceInquiry = {
        packageName: pkg.name,
        clientName: formData.clientName || '',
        companyName: formData.companyName,
        email: formData.email || '',
        phone: formData.phone || '',
        whatsapp: formData.whatsapp || '',
        projectDescription: formData.projectDescription || '',
        additionalDetails: formData.additionalDetails,
        hasDomain: formData.hasDomain,
        hasHosting: formData.hasHosting,
        status: 'New'
    };

    try {
        await DataService.submitInquiry(inquiryPayload);
        setSubmitted(true);
        window.scrollTo(0,0);
    } catch (error) {
        console.error(error);
        alert("Failed to submit. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950"><Loader className="animate-spin text-peculiar-500"/></div>;
  if (!pkg) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Package not found</div>;

  if (submitted) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 text-green-600">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Request Received!</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mb-8">
                  Thank you for choosing the <strong>{pkg.name}</strong> package. An invoice and further details have been sent to your email and WhatsApp.
              </p>
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-peculiar-600 text-white rounded-xl font-bold hover:bg-peculiar-500">
                  Return Home
              </button>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/pricing')} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-peculiar-500 transition-colors">
            <ArrowLeft size={20} /> Back to Pricing
        </button>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Left: Package Info */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg sticky top-24">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{pkg.name}</h1>
                    <div className="text-2xl font-bold text-peculiar-600 dark:text-peculiar-400 mb-6">{pkg.price}</div>
                    
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-wider">What's Included</h3>
                    <ul className="space-y-3 mb-8">
                        {pkg.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <CheckCircle size={16} className="text-peculiar-500 mt-0.5 flex-shrink-0" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 italic">
                        * Third-party services like Hosting & Domain are excluded unless specified.
                    </div>
                </div>
            </div>

            {/* Right: Inquiry Form */}
            <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Start Your Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Full Name</label>
                                <input required name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Company/Brand Name</label>
                                <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="My Brand Ltd" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Email Address</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">WhatsApp Number</label>
                                <input required name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="+234..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">How do you want this project to look?</label>
                            <textarea required name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} rows={4} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Describe your vision, color preferences, or reference sites..." />
                        </div>

                        {/* Website Specific Questions */}
                        <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Do you have a Domain?</label>
                                <select name="hasDomain" value={formData.hasDomain} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="Not Sure">Not Sure</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-2 uppercase text-slate-500">Do you have Hosting?</label>
                                <select name="hasHosting" value={formData.hasHosting} onChange={handleInputChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="Not Sure">Not Sure</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Additional Details</label>
                            <textarea name="additionalDetails" value={formData.additionalDetails} onChange={handleInputChange} rows={2} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Any specific features or deadlines?" />
                        </div>

                        <button type="submit" disabled={submitting} className="w-full py-4 bg-gradient-to-r from-peculiar-600 to-accent-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70">
                            {submitting ? <Loader className="animate-spin" /> : <><Send size={20} /> Submit & Get Invoice</>}
                        </button>
                        <p className="text-xs text-center text-slate-500">By submitting, you agree to receive a project invoice and consultation via WhatsApp/Email.</p>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
