import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ArrowRight, Code, Zap, CheckCircle, 
  Layout, Server, TrendingUp, Monitor, Cpu, ChevronDown, User, Layers, Smartphone, Globe 
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { TECH_STACK } from '../constants';
import { DataService } from '../services/dataService';
import { Brand } from '../types';
import { Reveal } from '../components/Reveal';
import TextRotator from '../components/TextRotator';
import CodeTypewriter from '../components/CodeTypewriter';
import CountUp from '../components/CountUp';

const Home: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Parallax Mouse Effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    DataService.getBrands().then(setBrands);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const PROCESS_STEPS = [
    { title: "Discovery", desc: "We meet to understand your goals, audience, and unique requirements.", icon: <User size={24} /> },
    { title: "Strategy & Design", desc: "We create a roadmap and design high-fidelity prototypes for your approval.", icon: <Layout size={24} /> },
    { title: "Development", desc: "Our engineers build your solution using modern, scalable technologies.", icon: <Code size={24} /> },
    { title: "Launch & Support", desc: "We deploy your project and provide ongoing maintenance and growth support.", icon: <Zap size={24} /> },
  ];

  const FAQS = [
    { q: "How long does it take to build a website?", a: "A standard website typically takes 2-4 weeks, while complex web applications can take 8-12 weeks depending on features." },
    { q: "Do you provide hosting and domain services?", a: "Yes, we can manage the entire infrastructure for you, or work with your existing providers." },
    { q: "Can you redesign my existing app?", a: "Absolutely. We specialize in modernizing legacy applications with better UI/UX and performance." },
    { q: "What is your payment structure?", a: "We typically require a 60% deposit to start, with the remaining 40% upon successful delivery." },
  ];

  return (
    <div className="overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden pt-20 lg:pt-0">
        
        {/* Animated Background Blobs with Parallax */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-peculiar-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 transition-transform duration-100 ease-out"
            style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }} 
          />
          <div 
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 transition-transform duration-100 ease-out"
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
          />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Hero Content - Order 1 ensures it stays on top on mobile */}
          <div className="text-left order-1 relative z-20">
            <Reveal delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-peculiar-200 dark:border-peculiar-900 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-peculiar-500 animate-pulse"></span>
                <span className="text-peculiar-700 dark:text-peculiar-300 text-xs font-bold tracking-wide uppercase">
                  Available for new projects
                </span>
              </div>
            </Reveal>
            
            <Reveal delay={200}>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                We Craft <br/>
                <span className="text-peculiar-600 dark:text-peculiar-400 text-2xl md:text-3xl">
                  <TextRotator 
                    words={["Digital Experiences", "Web Applications", "Mobile Solutions", "Automated Workflows"]} 
                    className="inline-block"
                  />
                </span>
                <br/> That Scale.
              </h1>
            </Reveal>
            
            <Reveal delay={300}>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg">
                Your partner in navigating the digital landscape. From high-performance websites to complex automation systems, Peculiar Digitals builds the future of your brand.
              </p>
            </Reveal>
            
            <Reveal delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#booking" className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden text-center animate-heartbeat">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start a Project <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
                  </span>
                </a>
                <NavLink to="/projects" className="group px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-center hover:scale-105 animate-float">
                   <span className="flex items-center justify-center gap-2">
                     Explore our Portfolio <Layers className="group-hover:rotate-12 transition-transform" size={20} />
                   </span>
                </NavLink>
              </div>
            </Reveal>
          </div>
          
          {/* Hero Visual - Order 2 */}
          <div className="relative order-2 lg:h-[700px] flex items-center justify-center perspective-1000 mt-12 lg:mt-0">
             <Reveal delay={200} className="w-full flex justify-center relative">
                {/* Main Card - PERFECT SQUARE & BIG & FIXED */}
                <div 
                   className="relative z-20 w-[350px] md:w-[650px] aspect-square bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-10 flex flex-col transform transition-transform duration-100 ease-out overflow-hidden"
                   style={{ transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 flex-shrink-0">
                      <div className="flex gap-3">
                        {/* Shimmering Dots */}
                        <div className="w-4 h-4 rounded-full bg-red-500 animate-shimmer" style={{ animationDelay: '0s' }}></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-500 animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-shimmer" style={{ animationDelay: '1s' }}></div>
                      </div>
                      <div className="text-sm font-mono text-slate-400">peculiar_app.tsx</div>
                  </div>
                  
                  {/* Typewriter Code Block - Fixed Container to prevent resizing */}
                  <div className="flex-grow relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute inset-0 flex flex-col justify-center">
                       <CodeTypewriter />
                    </div>
                  </div>

                  {/* Footer Status */}
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl mt-6 flex items-center gap-4 flex-shrink-0">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Deployment Status</div>
                        <div className="font-bold text-slate-900 dark:text-white text-lg">Live & Optimized</div>
                    </div>
                  </div>
                </div>
             </Reveal>
             
             {/* Background glow behind elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-peculiar-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BY BRANDS --- */}
      {brands.length > 0 && (
        <section className="py-8 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Trusted By Innovative Brands</span>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll hover:pause gap-16 items-center w-max">
               {/* Loop twice for seamless infinite scroll */}
               {[...brands, ...brands].map((brand, idx) => (
                 <div key={`${brand.id}-${idx}`} className="flex-shrink-0 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300">
                    <img src={brand.logoUrl} alt={brand.name} className="h-8 md:h-12 w-auto object-contain" />
                 </div>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* --- TECH STACK MARQUEE --- */}
      <section className="py-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Powering Brands With Modern Tech</p>
         </div>
         <div className="relative flex overflow-x-hidden group">
            <div className="animate-scroll whitespace-nowrap flex gap-12 items-center">
               {TECH_STACK.map((tech, index) => (
                  <span key={index} className="text-2xl font-bold text-slate-300 dark:text-slate-700 hover:text-peculiar-500 dark:hover:text-peculiar-400 transition-colors cursor-default">
                     {tech}
                  </span>
               ))}
            </div>
            <div className="absolute top-0 animate-scroll whitespace-nowrap flex gap-12 items-center" aria-hidden="true">
               {TECH_STACK.map((tech, index) => (
                  <span key={index + 'dup'} className="text-2xl font-bold text-slate-300 dark:text-slate-700 hover:text-peculiar-500 dark:hover:text-peculiar-400 transition-colors cursor-default">
                     {tech}
                  </span>
               ))}
            </div>
         </div>
      </section>

      {/* --- BENTO GRID SERVICES --- */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <Reveal>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    What We Build
                </h2>
               </Reveal>
               <Reveal delay={100}>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                    Comprehensive digital solutions tailored to elevate your organization, school, or business.
                </p>
               </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-none md:grid-rows-2 gap-6">
               
               {/* Large Item 1: Website Design */}
               <div className="md:col-span-2 row-span-1 group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col justify-between">
                  <Reveal width="100%">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-peculiar-100 dark:bg-peculiar-900/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-peculiar-100 dark:bg-peculiar-900 rounded-2xl flex items-center justify-center text-peculiar-600 dark:text-peculiar-400 mb-6 group-hover:rotate-6 transition-transform">
                            <Monitor size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Website Design</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                            From WordPress to Custom Code. We build responsive sites for Churches, NGOs, Personal Brands, and Corporations.
                        </p>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-peculiar-500 rounded-full"></div>SEO Optimized</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-peculiar-500 rounded-full"></div>Fast Loading</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-peculiar-500 rounded-full"></div>Mobile First</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-peculiar-500 rounded-full"></div>Secure</li>
                        </ul>
                    </div>
                  </Reveal>
               </div>

               {/* Tall Item: Mobile Apps */}
               <div className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-8 text-white flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-peculiar-900/50 opacity-50"></div>
                  <div className="relative z-10 flex-grow">
                     <Reveal delay={200}>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Mobile Apps</h3>
                        <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                            Native and Cross-platform applications. CBT apps, Task Managers, and utilities built with React Native and Flutter.
                        </p>
                        
                        <div className="mt-8 flex justify-center">
                            <div className="relative w-40 h-72 bg-slate-800 rounded-[2rem] border-4 border-slate-700 shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                            {/* Mock Screen */}
                            <div className="absolute inset-0 bg-slate-900 p-3">
                                <div className="w-full h-full bg-slate-800 rounded-xl flex flex-col gap-2 p-2">
                                    <div className="w-full h-24 bg-peculiar-600 rounded-lg opacity-80"></div>
                                    <div className="w-full h-8 bg-slate-700 rounded-lg"></div>
                                    <div className="w-2/3 h-8 bg-slate-700 rounded-lg"></div>
                                </div>
                            </div>
                            </div>
                        </div>
                     </Reveal>
                  </div>
               </div>

               {/* Regular Item: Web Apps */}
               <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-8">
                  <Reveal delay={100}>
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-2xl flex items-center justify-center text-accent-600 dark:text-accent-400 mb-6">
                        <Server size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Web Applications</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Robust portals for Schools (Admission, Result, Finance) and complex business logic systems.
                    </p>
                  </Reveal>
               </div>

               {/* Regular Item: Automations */}
               <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 p-8">
                  <Reveal delay={200}>
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Workflow Automation</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Save time with Zapier integrations, custom scripts, and business logic automation.
                    </p>
                  </Reveal>
               </div>
            </div>
         </div>
      </section>

      {/* --- HOW WE WORK (PROCESS) --- */}
      <section className="py-24 bg-white dark:bg-slate-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <Reveal>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Our Process</h2>
                 <p className="text-slate-600 dark:text-slate-400">How we turn your idea into reality.</p>
               </Reveal>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
               {PROCESS_STEPS.map((step, idx) => (
                 <Reveal key={idx} delay={idx * 150} direction="up">
                   <div className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 h-full hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute -top-4 -left-4 w-10 h-10 bg-peculiar-600 text-white font-bold rounded-full flex items-center justify-center shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="mb-4 text-peculiar-500">{step.icon}</div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                   </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* --- WHY CHOOSE US (STATS) --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                 <Reveal>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">Why Peculiar Digitals?</h2>
                 </Reveal>
                 <Reveal delay={100}>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    We don't just write code; we build digital ecosystems. Our school management systems are used by top institutions, and our websites drive real traffic.
                    </p>
                 </Reveal>
                 <div className="space-y-4">
                    <Reveal delay={200}>
                        <div className="flex items-start gap-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 mt-1"><CheckCircle size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Admin Dashboard Included</h4>
                            <p className="text-sm text-slate-500">Every project comes with full control for you.</p>
                        </div>
                        </div>
                    </Reveal>
                    <Reveal delay={300}>
                        <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 mt-1"><Layout size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Modern Aesthetic</h4>
                            <p className="text-sm text-slate-500">Designs that stand out in 2025.</p>
                        </div>
                        </div>
                    </Reveal>
                    <Reveal delay={400}>
                        <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 mt-1"><Cpu size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Scalable Backend</h4>
                            <p className="text-sm text-slate-500">Powered by Supabase and robust APIs.</p>
                        </div>
                        </div>
                    </Reveal>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Projects Done", value: 50, suffix: "+" },
                   { label: "Client Satisfaction", value: 100, suffix: "%" },
                   { label: "Support", text: "24/7" },
                   { label: "Years Experience", value: 5, suffix: "+" }
                 ].map((stat: any, i) => (
                   <Reveal key={i} delay={i * 100} width="100%">
                    <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl text-center hover:scale-105 transition-transform duration-300 border border-slate-100 dark:border-slate-700 h-full flex flex-col justify-center">
                        <div className={`text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400`}>
                           {stat.value !== undefined ? (
                              <CountUp end={stat.value} suffix={stat.suffix} />
                           ) : (
                              stat.text
                           )}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</div>
                    </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-white dark:bg-slate-900">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                 <Reveal>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                 </Reveal>
             </div>
             <div className="space-y-4">
                 {FAQS.map((faq, idx) => (
                     <Reveal key={idx} delay={idx * 50}>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            <button 
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                            >
                                <span className="font-bold text-slate-900 dark:text-white">{faq.q}</span>
                                <ChevronDown className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} size={20} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 p-5' : 'max-h-0 p-0'}`}>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        </div>
                     </Reveal>
                 ))}
             </div>
         </div>
      </section>

      {/* --- BOOKING SECTION --- */}
      <section id="booking" className="py-24 relative overflow-hidden bg-slate-900 text-white">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-peculiar-600/20 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal width="100%">
            <div className="grid lg:grid-cols-5 gap-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-0 overflow-hidden shadow-2xl">
                
                {/* Left side text */}
                <div className="lg:col-span-2 p-8 lg:p-12 bg-gradient-to-br from-peculiar-900 to-slate-900 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">Let's Build Something Great.</h2>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                    Ready to automate your workflow, build a school portal, or launch a mobile app? Fill out the form, and we'll get back to you instantly.
                    </p>
                    <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Globe size={16}/></div>
                        <span>Global Standard Delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><TrendingUp size={16}/></div>
                        <span>Growth Oriented Solutions</span>
                    </div>
                    </div>
                </div>

                {/* Right side Form */}
                <div className="lg:col-span-3 p-8 lg:p-12">
                    <BookingForm className="text-slate-900 dark:text-white" />
                </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Home;