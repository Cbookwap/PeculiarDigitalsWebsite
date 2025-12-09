import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { BlogPost as BlogPostType } from '../types';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      DataService.getBlogPostById(id).then((data) => {
        setPost(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-16 h-16 border-4 border-peculiar-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!post) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Article Not Found</h2>
            <button onClick={() => navigate('/blog')} className="text-peculiar-500 hover:underline">Back to Blog</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      
      {/* Hero Image */}
      <div className="w-full h-[50vh] relative">
         <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
         
         <div className="absolute top-0 left-0 p-6">
            <button 
                onClick={() => navigate('/blog')} 
                className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors text-sm font-bold"
            >
                <ArrowLeft size={16} /> Back to Blog
            </button>
         </div>

         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <Reveal>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-peculiar-600 text-white text-xs font-bold rounded-full">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight shadow-sm">{post.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <User size={14} />
                            </div>
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-peculiar-400"/> {post.publishedAt}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-peculiar-400"/> {post.readTime}
                        </div>
                    </div>
                </Reveal>
            </div>
         </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
         <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 dark:border-slate-800">
            <article className="prose prose-lg dark:prose-invert max-w-none">
                <p className="lead text-xl text-slate-600 dark:text-slate-300 font-medium mb-8 border-l-4 border-peculiar-500 pl-4 italic">
                    {post.excerpt}
                </p>
                <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>
            </article>

            {/* Share / Tags Footer */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Tag size={18} />
                    <span className="text-sm">Tags: {post.tags.join(', ')}</span>
                </div>
                <button className="flex items-center gap-2 text-peculiar-600 dark:text-peculiar-400 font-bold hover:underline">
                    <Share2 size={18} /> Share Article
                </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default BlogPost;