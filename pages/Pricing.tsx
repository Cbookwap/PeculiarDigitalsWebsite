
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { PricingCategory, PricingPackage, CalculatorItem } from '../types';
import { Check, ArrowRight, Calculator, X } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Calculator State
  const [calcItems, setCalcItems] = useState<CalculatorItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [cats, pkgs, cItems] = await Promise.all([
        DataService.getPricingCategories(),
        DataService.getPricingPackages(),
        DataService.getCalculatorItems()
      ]);
      setCategories(cats);
      setPackages(pkgs);
      setCalcItems(cItems);
      if (cats.length > 0) setActiveCategory(cats[0].id);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredPackages = packages.filter(p => p.categoryId === activeCategory);

  // Calculator Logic
  const toggleItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalEstimate = selectedItems.reduce((sum, id) => {
    const item = calcItems.find(i => i.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-16 h-16 border-4 border-peculiar-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-peculiar-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-20 left-[-10%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Transparent Pricing</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose a package that fits your needs or build a custom quote instantly.
            </p>
          </Reveal>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                        activeCategory === cat.id 
                        ? 'bg-peculiar-600 text-white shadow-lg scale-105' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
            {filteredPackages.map((pkg, idx) => (
                <Reveal key={pkg.id} delay={idx * 100}>
                    <div className={`h-full flex flex-col relative rounded-2xl p-8 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 ${
                        pkg.isPopular 
                        ? 'bg-gradient-to-b from-peculiar-900/10 to-transparent border-peculiar-500/50 shadow-xl shadow-peculiar-500/10' 
                        : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:shadow-xl'
                    }`}>
                        {pkg.isPopular && (
                            <div className="absolute top-0 right-0 bg-peculiar-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                POPULAR
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
                        <div className="mb-6">
                            <span className="text-3xl font-black text-slate-900 dark:text-white">{pkg.price}</span>
                            {pkg.discountPrice && <span className="block text-sm text-slate-500 line-through">{pkg.discountPrice}</span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">{pkg.description}</p>
                        
                        <div className="space-y-3 flex-grow mb-8">
                            {pkg.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                    <Check size={16} className="text-peculiar-500 mt-0.5 flex-shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => navigate(`/pricing/${pkg.id}`)}
                            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                pkg.isPopular 
                                ? 'bg-peculiar-600 text-white hover:bg-peculiar-500 shadow-lg' 
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                            }`}
                        >
                            Get Started <ArrowRight size={18} />
                        </button>
                    </div>
                </Reveal>
            ))}
        </div>

        {/* Floating Calculator Button (Mobile) */}
        <button 
            onClick={() => setShowCalculator(true)}
            className="md:hidden fixed bottom-20 right-4 z-40 bg-accent-600 text-white p-4 rounded-full shadow-2xl animate-bounce-slow"
        >
            <Calculator size={24} />
        </button>

        {/* Cost Calculator Section */}
        <div className={`fixed inset-0 z-50 md:static md:z-0 bg-white dark:bg-slate-950 md:bg-transparent transform transition-transform duration-300 overflow-y-auto ${showCalculator ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>
            <div className="md:hidden p-4 flex justify-end sticky top-0 bg-white dark:bg-slate-950 z-10">
                <button onClick={() => setShowCalculator(false)}><X size={24} className="text-slate-900 dark:text-white"/></button>
            </div>
            
            <Reveal>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl max-w-5xl mx-auto mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
                            <Calculator className="text-peculiar-500" /> Build Your Own Quote
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Select features to get an estimated cost instantly.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {calcItems.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => toggleItem(item.id)}
                                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                                    selectedItems.includes(item.id) 
                                    ? 'bg-peculiar-50 dark:bg-peculiar-900/20 border-peculiar-500 shadow-md' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-peculiar-300'
                                }`}
                            >
                                <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-500">₦{(item.price / 1000).toFixed(0)}k</span>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedItems.includes(item.id) ? 'bg-peculiar-500 border-peculiar-500' : 'border-slate-400'}`}>
                                        {selectedItems.includes(item.id) && <Check size={12} className="text-white" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 dark:bg-black text-white p-6 rounded-2xl">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <span className="block text-sm text-slate-400 uppercase tracking-widest">Estimated Total</span>
                            <span className="text-4xl font-black text-peculiar-400">₦{totalEstimate.toLocaleString()}</span>
                        </div>
                        <button 
                            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                            onClick={() => {
                                // Just a visual cue, could redirect to contact form with pre-filled state
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                alert("Please contact us via WhatsApp to finalize this custom build!");
                            }}
                        >
                            Request This Build
                        </button>
                    </div>
                </div>
            </Reveal>
        </div>

      </div>
    </div>
  );
};

export default Pricing;
