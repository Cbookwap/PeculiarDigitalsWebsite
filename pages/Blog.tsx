import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await DataService.getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Insights & Resources
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Expert articles on web development, automation, and digital growth strategies for your business.
            </p>
          </Reveal>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
              <div className="w-16 h-16 border-4 border-peculiar-500 border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : posts.length === 0 ? (
           <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
              <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No articles yet</h3>
              <p className="text-slate-500">Check back soon for amazing content!</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <Reveal key={post.id} delay={idx * 100}>
                <Link to={`/blog/${post.slug || post.id}`} className="group block h-full">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                    
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                       <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                         {post.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                             {tag}
                           </span>
                         ))}
                       </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                       <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {post.publishedAt}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{post.readTime}</span>
                       </div>

                       <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-peculiar-500 transition-colors">
                         {post.title}
                       </h3>
                       
                       <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                         {post.excerpt}
                       </p>

                       <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center mt-auto">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                             <User size={14} className="text-peculiar-500"/> {post.author}
                          </div>
                          <span className="text-peculiar-600 dark:text-peculiar-400 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300">
                             Read Article <ArrowRight size={16} />
                          </span>
                       </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;