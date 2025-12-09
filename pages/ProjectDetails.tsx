import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Project } from '../types';
import { ArrowLeft, ExternalLink, Calendar, DollarSign, Layers, Quote, CheckCircle } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (id) {
      DataService.getProjectById(id).then((data) => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [id]);

  // Infinite Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !project?.screenshots || project.screenshots.length === 0) return;

    let animationId: number;
    
    const scroll = () => {
      if (!isPaused && container) {
        // Scroll 1px per frame
        container.scrollLeft += 1;
        
        // Reset logic: When we reach the halfway point (end of the first set of duplicates), jump back to start
        // This creates the seamless infinite effect
        if (container.scrollLeft >= (container.scrollWidth / 2)) {
             container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [project, isPaused]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-16 h-16 border-4 border-peculiar-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Project Not Found</h2>
            <button onClick={() => navigate('/projects')} className="text-peculiar-500 hover:underline">Back to Portfolio</button>
        </div>
    );
  }

  // Duplicate screenshots 4 times to ensure we have enough width for the infinite scroll to work on large screens
  const displayScreenshots = project.screenshots && project.screenshots.length > 0 
    ? [...project.screenshots, ...project.screenshots, ...project.screenshots, ...project.screenshots] 
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 overflow-hidden">
      
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px]">
         <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full p-4 md:p-16">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate('/projects')} className="mb-4 md:mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm md:text-base">
                    <ArrowLeft size={18} /> Back to Projects
                </button>
                <Reveal>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-4">
                        <span className="px-3 py-1 bg-peculiar-600 text-white text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">{project.category}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${project.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                            {project.status} {project.status === 'In Progress' && `(${project.progress}%)`}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-6xl font-black text-white mb-2 md:mb-4 shadow-sm break-words">{project.title}</h1>
                </Reveal>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-10">
         <div className="grid md:grid-cols-3 gap-8">
            
            {/* Main Content - min-w-0 prevents grid blowout on mobile */}
            <div className="md:col-span-2 space-y-8 md:space-y-12 min-w-0">
                
                {/* Description */}
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-white">About the Project</h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                        {project.description}
                    </p>
                    
                    {project.link && (
                        <div className="mt-8">
                            <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-peculiar-600 text-white font-bold rounded-lg hover:bg-peculiar-500 transition-colors shadow-lg text-sm md:text-base">
                                Visit Live Site <ExternalLink size={18} />
                            </a>
                        </div>
                    )}
                </div>

                {/* Screenshots Gallery */}
                {displayScreenshots.length > 0 && (
                    <div className="space-y-4 md:space-y-6">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Project Gallery</h3>
                        
                        {/* Scroll Container */}
                        <div 
                           className="relative w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg group"
                           onMouseEnter={() => setIsPaused(true)}
                           onMouseLeave={() => setIsPaused(false)}
                           onTouchStart={() => setIsPaused(true)}
                           onTouchEnd={() => setIsPaused(false)}
                        >
                           <div 
                             ref={scrollRef}
                             className="flex overflow-x-auto gap-4 md:gap-6 pb-4 hide-scrollbar"
                             style={{ scrollBehavior: 'auto' }}
                           >
                              {displayScreenshots.map((shot, idx) => (
                                  <div key={idx} className="flex-shrink-0 w-[85vw] md:w-[600px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                      <img src={shot} alt={`Screenshot ${idx}`} className="w-full h-auto object-cover" />
                                  </div>
                              ))}
                           </div>
                           <div className={`absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none transition-opacity duration-300 ${isPaused ? 'opacity-100' : 'opacity-0'}`}>
                              Paused
                           </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar Info - min-w-0 prevents grid blowout */}
            <div className="space-y-6 min-w-0">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-white">Project Info</h3>
                    
                    <div className="space-y-4">
                        <div className="break-words">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Client</span>
                            <span className="text-slate-900 dark:text-white font-medium">{project.client}</span>
                        </div>
                        {project.deliveryPeriod && (
                            <div className="break-words">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</span>
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                                    <Calendar size={16} className="text-peculiar-500 flex-shrink-0" /> 
                                    <span>{project.deliveryPeriod}</span>
                                </div>
                            </div>
                        )}
                        {project.budget && (
                            <div className="break-words">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</span>
                                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                                    <DollarSign size={16} className="text-green-500 flex-shrink-0" /> 
                                    <span>{project.budget}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold mb-6 border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-white">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-600 dark:text-slate-300">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {project.testimonial && (
                    <div className="bg-gradient-to-br from-peculiar-600 to-accent-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                        <Quote size={48} className="absolute top-4 right-4 text-white/20" />
                        <h3 className="text-lg font-bold mb-4 relative z-10">Client Feedback</h3>
                        <p className="italic text-white/90 relative z-10 leading-relaxed break-words">"{project.testimonial}"</p>
                        <div className="mt-4 font-bold text-sm relative z-10 opacity-80 break-words">— {project.client}</div>
                    </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProjectDetails;