import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Project } from '../types';
import { ExternalLink, Clock, DollarSign, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await DataService.getProjects();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const categories = ['All', 'Website', 'WebApp', 'MobileApp'];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Our Portfolio</h1>
        
        {/* Filter */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                ? 'bg-peculiar-600 text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading amazing projects...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id} className="block group min-w-0">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md ${
                            project.status === 'In Progress' 
                            ? 'bg-blue-500/80 text-white' 
                            : 'bg-green-500/80 text-white'
                        }`}>
                            {project.status}
                        </div>
                    </div>
                    
                    {/* Progress Bar for Ongoing Projects */}
                    {project.status === 'In Progress' && (
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-1000" 
                                style={{ width: `${project.progress || 10}%` }}
                            ></div>
                        </div>
                    )}

                    <div className="p-6 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-peculiar-600 dark:text-peculiar-400 uppercase">{project.category}</div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-peculiar-500 transition-colors break-words">{project.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 break-words">{project.description}</p>
                        
                        <div className="mt-auto space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Layers size={14} /> <span>{project.stack.slice(0, 3).join(', ')}{project.stack.length > 3 ? '...' : ''}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                {project.budget && (
                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        Budget: {project.budget}
                                    </div>
                                )}
                                <span className="text-peculiar-500 flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                    Details <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;