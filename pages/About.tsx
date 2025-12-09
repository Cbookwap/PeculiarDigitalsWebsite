import React from 'react';
import { SERVICES_LIST, BRAND_NAME } from '../constants';
import { Check } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">About Us</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {BRAND_NAME} is led by <strong>AyoJesu Ayonitemi</strong>. We are a forward-thinking agency 
            dedicated to solving complex problems with simple, elegant digital solutions. We combine technical 
            expertise with creative flair to deliver products that stand out.
          </p>
        </div>

        {/* Detailed Services Grid */}
        <div className="grid gap-12">
          {Object.entries(SERVICES_LIST).map(([key, service], index) => (
            <div key={key} className={`flex flex-col md:flex-row gap-8 items-start p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-peculiar-600 dark:text-peculiar-400 mb-6 uppercase tracking-wider">
                  {service.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.subItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="p-1 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400">
                        <Check size={14} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-slate-500 dark:text-slate-400 italic">
                  We handle everything from the initial concept to the final deployment and maintenance.
                </p>
              </div>
              
              {/* Visual Decorative Box */}
              <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-center">
                 <span className="text-4xl font-black text-slate-400 dark:text-slate-600 opacity-20 uppercase">
                    {key}
                 </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;
