
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { DataService } from '../services/dataService';
import { Project, Product, Brand, SiteSettings, BlogPost, PricingPackage, ServiceInquiry, CalculatorItem, PricingCategory } from '../types';
import { Plus, Trash2, FolderGit2, ShoppingBag, Star, LogOut, Lock, Loader, AlertCircle, X, ExternalLink, Image as ImageIcon, Upload, Pencil, PlusCircle, Settings, Save, BookOpen, Link as LinkIcon, DollarSign, ListOrdered, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../components/SettingsContext';

// Initial states for forms
const initialProjectState: Partial<Project> = {
  title: '', client: '', category: 'Website', description: '', 
  stack: [], imageUrl: '', screenshots: [], link: '', status: 'In Progress', 
  budget: '', deliveryPeriod: '', testimonial: '', progress: 0
};

const initialProductState: Partial<Product> = {
  title: '', price: '', type: 'Template', description: '', 
  imageUrl: '', purchaseLink: '', features: [], demoUrl: '', screenshots: []
};

const initialBrandState: Partial<Brand> = {
  name: '', logoUrl: ''
};

const initialBlogPostState: Partial<BlogPost> = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '', 
  author: 'Admin', tags: [], readTime: '5 min read'
};

const initialPackageState: Partial<PricingPackage> = {
    categoryId: '', name: '', price: '', discountPrice: '', description: '', features: [], isPopular: false
};

const initialCalcItemState: Partial<CalculatorItem> = {
    name: '', price: 0, category: 'Feature', isActive: true
};

const AdminDashboard: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'projects' | 'shop' | 'brands' | 'blog' | 'pricing' | 'orders' | 'calculator' | 'settings'>('projects');
  
  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [pricingCategories, setPricingCategories] = useState<PricingCategory[]>([]);
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [calcItems, setCalcItems] = useState<CalculatorItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  const [dataLoading, setDataLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('project');
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form Data States
  const [projectForm, setProjectForm] = useState(initialProjectState);
  const [productForm, setProductForm] = useState(initialProductState);
  const [brandForm, setBrandForm] = useState(initialBrandState);
  const [blogForm, setBlogForm] = useState(initialBlogPostState);
  const [packageForm, setPackageForm] = useState(initialPackageState);
  const [calcItemForm, setCalcItemForm] = useState(initialCalcItemState);
  
  const [stackInput, setStackInput] = useState(''); 
  const [productFeaturesInput, setProductFeaturesInput] = useState('');
  const [blogTagsInput, setBlogTagsInput] = useState('');
  const [packageFeaturesInput, setPackageFeaturesInput] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Screenshot Upload State
  const [selectedScreenshots, setSelectedScreenshots] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchData();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchData = async () => {
    setDataLoading(true);
    const [p, pr, b, bl, s, pkgs, cats, inqs, calcs] = await Promise.all([
        DataService.getProjects(),
        DataService.getProducts(),
        DataService.getBrands(),
        DataService.getBlogPosts(),
        DataService.getSettings(),
        DataService.getPricingPackages(),
        DataService.getPricingCategories(),
        DataService.getInquiries(),
        DataService.getAllCalculatorItems()
    ]);
    
    setProjects(p);
    setProducts(pr);
    setBrands(b);
    setBlogPosts(bl);
    setSettings(s);
    setSettingsForm(s);
    setPricingPackages(pkgs);
    setPricingCategories(cats);
    setInquiries(inqs);
    setCalcItems(calcs);

    setLogoPreview(s.logoUrl);
    setFaviconPreview(s.faviconUrl);
    setDataLoading(false);
  };

  const formatPrice = (price: string) => {
    if (price.includes('₦')) return price;
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₦${num.toLocaleString()}`;
    return `₦${price}`;
  };

  // --- SETTINGS HANDLERS ---
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cookieConsentEnabled') {
         setSettingsForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
         setSettingsForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataLoading(true);
    try {
        let newLogoUrl = settingsForm.logoUrl;
        let newFaviconUrl = settingsForm.faviconUrl;

        if (logoFile) newLogoUrl = await DataService.uploadImage(logoFile, 'brands');
        if (faviconFile) newFaviconUrl = await DataService.uploadImage(faviconFile, 'brands');

        await DataService.updateSettings({
            ...settingsForm,
            logoUrl: newLogoUrl,
            faviconUrl: newFaviconUrl
        });
        
        await refreshSettings();
        alert("Settings saved successfully!");
    } catch (error) {
        console.error(error);
        alert('Failed to save settings');
    } finally {
        setDataLoading(false);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setFaviconFile(file);
        setFaviconPreview(URL.createObjectURL(file));
    }
  };

  // --- CRUD ACTIONS ---
  const openModal = (type: string) => {
    setModalType(type);
    setEditId(null);
    // Reset all forms
    setProjectForm(initialProjectState);
    setProductForm(initialProductState);
    setBrandForm(initialBrandState);
    setBlogForm(initialBlogPostState);
    setPackageForm(initialPackageState);
    setCalcItemForm(initialCalcItemState);
    
    setStackInput('');
    setProductFeaturesInput('');
    setBlogTagsInput('');
    setPackageFeaturesInput('');
    
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedScreenshots([]);
    setScreenshotPreviews([]);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    setEditId(item.id);
    setModalType(type);
    setSelectedFile(null);
    setSelectedScreenshots([]);
    setScreenshotPreviews([]);
    
    if (type === 'project') {
        const p = item as Project;
        setProjectForm({
            title: p.title, client: p.client, category: p.category, 
            description: p.description, stack: p.stack, imageUrl: p.imageUrl, 
            screenshots: p.screenshots || [],
            link: p.link || '', status: p.status, budget: p.budget || '', 
            deliveryPeriod: p.deliveryPeriod || '', testimonial: p.testimonial || '',
            progress: p.progress || 0
        });
        setStackInput(p.stack.join(', '));
        setPreviewUrl(p.imageUrl);
        setScreenshotPreviews(p.screenshots || []);
    } else if (type === 'product') {
        const p = item as Product;
        setProductForm({
            title: p.title, price: p.price, type: p.type, 
            description: p.description, imageUrl: p.imageUrl, 
            purchaseLink: p.purchaseLink, features: p.features || [],
            demoUrl: p.demoUrl || '',
            screenshots: p.screenshots || []
        });
        setProductFeaturesInput((p.features || []).join('\n'));
        setPreviewUrl(p.imageUrl);
        setScreenshotPreviews(p.screenshots || []);
    } else if (type === 'brand') {
        const b = item as Brand;
        setBrandForm({ name: b.name, logoUrl: b.logoUrl });
        setPreviewUrl(b.logoUrl);
    } else if (type === 'blog') {
        const b = item as BlogPost;
        setBlogForm({
            title: b.title, slug: b.slug, excerpt: b.excerpt, 
            content: b.content, coverImage: b.coverImage, 
            author: b.author, tags: b.tags || [], readTime: b.readTime
        });
        setBlogTagsInput((b.tags || []).join(', '));
        setPreviewUrl(b.coverImage);
    } else if (type === 'package') {
        const p = item as PricingPackage;
        setPackageForm(p);
        setPackageFeaturesInput(p.features.join('\n'));
    } else if (type === 'calculator') {
        setCalcItemForm(item);
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleScreenshotsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setSelectedScreenshots(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setScreenshotPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
    if (modalType === 'project') {
        const currentUrls = projectForm.screenshots || [];
        if (index < currentUrls.length) {
            const newUrls = [...currentUrls];
            newUrls.splice(index, 1);
            setProjectForm(prev => ({ ...prev, screenshots: newUrls }));
        } else {
            const fileIndex = index - currentUrls.length;
            setSelectedScreenshots(prev => prev.filter((_, i) => i !== fileIndex));
        }
    } else if (modalType === 'product') {
        const currentUrls = productForm.screenshots || [];
        if (index < currentUrls.length) {
            const newUrls = [...currentUrls];
            newUrls.splice(index, 1);
            setProductForm(prev => ({ ...prev, screenshots: newUrls }));
        } else {
            const fileIndex = index - currentUrls.length;
            setSelectedScreenshots(prev => prev.filter((_, i) => i !== fileIndex));
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataLoading(true);

    try {
      let imageUrl = '';
      if (selectedFile) {
        const bucket = modalType === 'product' ? 'products' : 'projects';
        imageUrl = await DataService.uploadImage(selectedFile, bucket as any);
      } else {
        if (modalType === 'project') imageUrl = projectForm.imageUrl || '';
        if (modalType === 'product') imageUrl = productForm.imageUrl || '';
        if (modalType === 'brand') imageUrl = brandForm.logoUrl || '';
        if (modalType === 'blog') imageUrl = blogForm.coverImage || '';
      }

      if (modalType === 'project') {
        let screenshotUrls: string[] = projectForm.screenshots || [];
        if (selectedScreenshots.length > 0) {
            const uploadPromises = selectedScreenshots.map(file => DataService.uploadImage(file, 'projects'));
            const newUrls = await Promise.all(uploadPromises);
            screenshotUrls = [...screenshotUrls, ...newUrls];
        }
        const payload = {
          ...projectForm,
          stack: stackInput.split(',').map(s => s.trim()).filter(s => s.length > 0),
          imageUrl: imageUrl,
          screenshots: screenshotUrls
        } as Project;
        if (editId) await DataService.updateProject(editId, payload);
        else await DataService.addProject(payload);

      } else if (modalType === 'product') {
        let screenshotUrls: string[] = productForm.screenshots || [];
        if (selectedScreenshots.length > 0) {
            const uploadPromises = selectedScreenshots.map(file => DataService.uploadImage(file, 'products'));
            const newUrls = await Promise.all(uploadPromises);
            screenshotUrls = [...screenshotUrls, ...newUrls];
        }
        const featuresArray = productFeaturesInput.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        const payload = { ...productForm, imageUrl: imageUrl, features: featuresArray, screenshots: screenshotUrls } as Product;
        if (editId) await DataService.updateProduct(editId, payload);
        else await DataService.addProduct(payload);

      } else if (modalType === 'brand') {
        const payload = { ...brandForm, logoUrl: imageUrl } as Brand;
        if (editId) await DataService.updateBrand(editId, payload);
        else await DataService.addBrand(payload);

      } else if (modalType === 'blog') {
        let slug = blogForm.slug;
        if (!slug && blogForm.title) slug = blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        let readTime = blogForm.readTime;
        if (!readTime && blogForm.content) {
            const words = blogForm.content.split(/\s+/).length;
            const minutes = Math.ceil(words / 200);
            readTime = `${minutes} min read`;
        } else if (!readTime) readTime = '5 min read';

        const payload = { 
            ...blogForm, 
            coverImage: imageUrl, 
            slug,
            readTime,
            tags: blogTagsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)
        } as BlogPost;
        if (editId) await DataService.updateBlogPost(editId, payload);
        else await DataService.addBlogPost(payload);

      } else if (modalType === 'package') {
          const features = packageFeaturesInput.split('\n').filter(f => f.trim() !== '');
          const payload = { ...packageForm, features };
          if (editId) await DataService.updatePackage(editId, payload);
          else await DataService.addPackage(payload as PricingPackage);

      } else if (modalType === 'calculator') {
          if (editId) await DataService.updateCalculatorItem(editId, calcItemForm);
          else await DataService.addCalculatorItem(calcItemForm as CalculatorItem);
      }
      
      await fetchData();
      closeModal();
    } catch (error: any) {
      console.error(error);
      alert(`Error saving item: ${error.message || error}`);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDataLoading(true);
    try {
      if (type === 'project') await DataService.deleteProject(id);
      if (type === 'product') await DataService.deleteProduct(id);
      if (type === 'brand') await DataService.deleteBrand(id);
      if (type === 'blog') await DataService.deleteBlogPost(id);
      if (type === 'package') await DataService.deletePackage(id);
      if (type === 'calculator') await DataService.deleteCalculatorItem(id);
      await fetchData();
    } catch (error: any) {
      alert(`Error deleting item: ${error.message}`);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader size={40} className="animate-spin text-peculiar-500" /></div>;
  
  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-peculiar-100 dark:bg-peculiar-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-peculiar-600"><Lock size={32} /></div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Portal</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to manage Peculiar Digitals</p>
            </div>
            {loginError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"><AlertCircle size={20} /><span>{loginError}</span></div>}
            <form onSubmit={handleLogin} className="space-y-6">
              <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none transition-all dark:text-white" required /></div>
              <div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none transition-all dark:text-white" required /></div>
              <button type="submit" disabled={authLoading} className="w-full py-3 bg-peculiar-600 hover:bg-peculiar-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-peculiar-500/25 flex items-center justify-center gap-2 disabled:opacity-70">{authLoading ? <Loader size={20} className="animate-spin" /> : 'Secure Login'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-col z-10 lg:min-h-screen sticky top-16 lg:top-0 h-auto">
        <h2 className="text-xl font-black text-peculiar-600 mb-6 tracking-tight hidden lg:block">DASHBOARD</h2>
        <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-visible">
          {['projects', 'shop', 'blog', 'brands', 'pricing', 'orders', 'calculator', 'settings'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)}
                className={`flex-shrink-0 flex items-center gap-3 w-auto lg:w-full text-left p-3 rounded-lg font-medium transition-colors capitalize ${activeTab === tab ? 'bg-peculiar-50 dark:bg-peculiar-900/20 text-peculiar-600 dark:text-peculiar-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {tab === 'projects' && <FolderGit2 size={20} />}
                {tab === 'shop' && <ShoppingBag size={20} />}
                {tab === 'blog' && <BookOpen size={20} />}
                {tab === 'brands' && <Star size={20} />}
                {tab === 'pricing' && <DollarSign size={20} />}
                {tab === 'orders' && <ListOrdered size={20} />}
                {tab === 'calculator' && <Calculator size={20} />}
                {tab === 'settings' && <Settings size={20} />}
                <span className="hidden sm:inline">{tab}</span>
              </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto hidden lg:block">
           <div className="text-sm text-slate-500 mb-4 px-2 truncate">{session.user.email}</div>
           <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left p-3 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
             <LogOut size={20} /> Sign Out
           </button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
           <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-3">{activeTab === 'settings' ? 'Site Configuration' : `${activeTab} Manager`} {dataLoading && <Loader size={16} className="animate-spin text-peculiar-500" />}</h1></div>
           {['projects', 'shop', 'blog', 'brands', 'pricing', 'calculator'].includes(activeTab) && (
               <button onClick={() => openModal(activeTab === 'pricing' ? 'package' : activeTab === 'shop' ? 'product' : activeTab === 'blog' ? 'blog' : activeTab === 'brands' ? 'brand' : activeTab === 'projects' ? 'project' : 'calculator')}
                 className="flex items-center gap-2 bg-peculiar-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-peculiar-500 shadow-lg hover:shadow-peculiar-500/25 transition-all">
                 <Plus size={18} /> Add New {activeTab === 'shop' ? 'Product' : activeTab === 'blog' ? 'Post' : activeTab.slice(0, -1)}
               </button>
           )}
        </div>

        {/* --- PRICING TAB --- */}
        {activeTab === 'pricing' && (
             <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800">
                 <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                         <tr><th className="p-4 font-semibold">Name</th><th className="p-4 font-semibold">Category</th><th className="p-4 font-semibold">Price</th><th className="p-4 font-semibold text-right">Actions</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {pricingPackages.map(pkg => (
                             <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                 <td className="p-4 font-bold dark:text-white">{pkg.name} {pkg.isPopular && <span className="ml-2 text-xs bg-peculiar-100 text-peculiar-600 px-2 py-0.5 rounded">Popular</span>}</td>
                                 <td className="p-4 text-slate-600 dark:text-slate-400">{pricingCategories.find(c => c.id === pkg.categoryId)?.name || 'Unknown'}</td>
                                 <td className="p-4 font-mono">{pkg.price}</td>
                                 <td className="p-4 text-right flex justify-end gap-2">
                                     <button onClick={() => handleEdit(pkg, 'package')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18}/></button>
                                     <button onClick={() => handleDelete(pkg.id, 'package')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18}/></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 </div>
             </div>
        )}

        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
             <div className="grid gap-6">
                 {inquiries.length === 0 ? <div className="text-center py-10 text-slate-500">No orders yet.</div> : inquiries.map(inq => (
                     <div key={inq.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                             <div>
                                 <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{inq.clientName}</h3>
                                    {inq.companyName && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-xs rounded text-slate-500">{inq.companyName}</span>}
                                 </div>
                                 <p className="text-sm text-peculiar-600 font-bold">Ordered: {inq.packageName}</p>
                                 <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                     <span>{inq.email}</span>
                                     <span>•</span>
                                     <span>{inq.phone}</span>
                                     <span>•</span>
                                     <span>WhatsApp: {inq.whatsapp}</span>
                                 </div>
                             </div>
                             <select 
                                value={inq.status} 
                                onChange={(e) => DataService.updateInquiryStatus(inq.id!, e.target.value).then(fetchData)}
                                className={`px-3 py-1.5 rounded text-sm font-bold border-none outline-none ${
                                    inq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                    inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                                    inq.status === 'Invoiced' ? 'bg-purple-100 text-purple-700' :
                                    'bg-green-100 text-green-700'
                                }`}
                             >
                                 <option value="New">New</option>
                                 <option value="Contacted">Contacted</option>
                                 <option value="Invoiced">Invoiced</option>
                                 <option value="Closed">Closed</option>
                             </select>
                         </div>
                         <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg text-sm text-slate-700 dark:text-slate-300 space-y-2">
                             <p><strong>Vision:</strong> {inq.projectDescription}</p>
                             {inq.additionalDetails && <p><strong>Extra:</strong> {inq.additionalDetails}</p>}
                             <div className="flex gap-4 mt-2 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-2">
                                 <span>Domain: {inq.hasDomain}</span>
                                 <span>Hosting: {inq.hasHosting}</span>
                                 <span>Sent: {new Date(inq.createdAt!).toLocaleDateString()}</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        )}

        {/* --- CALCULATOR TAB --- */}
        {activeTab === 'calculator' && (
             <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800">
                 <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                         <tr><th className="p-4 font-semibold">Item Name</th><th className="p-4 font-semibold">Price</th><th className="p-4 font-semibold">Category</th><th className="p-4 font-semibold text-right">Actions</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {calcItems.map(item => (
                             <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                 <td className="p-4 font-bold dark:text-white">{item.name}</td>
                                 <td className="p-4 font-mono">₦{item.price.toLocaleString()}</td>
                                 <td className="p-4"><span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs">{item.category}</span></td>
                                 <td className="p-4 text-right flex justify-end gap-2">
                                     <button onClick={() => handleEdit(item, 'calculator')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18}/></button>
                                     <button onClick={() => handleDelete(item.id, 'calculator')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18}/></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 </div>
             </div>
        )}

        {/* --- OTHER TABS (Existing) --- */}
        {activeTab === 'projects' && (
            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Image</th>
                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Project</th>
                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Client</th>
                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                        <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden">
                            {p.imageUrl ? (<img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />) : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={16}/></div>}
                        </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{p.title}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{p.client}</td>
                    <td className="p-4">
                        <div className="flex flex-col gap-1">
                            <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                p.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                p.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-slate-100 text-slate-800'
                            }`}>{p.status}</span>
                        </div>
                    </td>
                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(p, 'project')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18} /></button><button onClick={() => handleDelete(p.id, 'project')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18} /></button></div></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        
        {activeTab === 'shop' && (
            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr><th className="p-4">Image</th><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-lg overflow-hidden"><img src={p.imageUrl} className="w-full h-full object-cover"/></div></td>
                    <td className="p-4 font-bold dark:text-white">{p.title}</td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(p, 'product')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18} /></button><button onClick={() => handleDelete(p.id, 'product')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18} /></button></div></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {activeTab === 'blog' && (
            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr><th className="p-4">Cover</th><th className="p-4">Title</th><th className="p-4">Author</th><th className="p-4">Date</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {blogPosts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4"><div className="w-10 h-10 bg-slate-200 rounded-lg overflow-hidden"><img src={p.coverImage} className="w-full h-full object-cover"/></div></td>
                    <td className="p-4"><div className="font-bold dark:text-white line-clamp-1">{p.title}</div></td>
                    <td className="p-4">{p.author}</td>
                    <td className="p-4 text-slate-500 text-xs">{p.publishedAt}</td>
                    <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => window.open(`#/blog/${p.slug || p.id}`, '_blank')} className="text-slate-400 hover:text-blue-500 p-2 rounded-lg"><ExternalLink size={18} /></button><button onClick={() => handleEdit(p, 'blog')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18} /></button><button onClick={() => handleDelete(p.id, 'blog')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18} /></button></div></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {activeTab === 'brands' && (
            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <tr><th className="p-4">Logo</th><th className="p-4">Name</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {brands.map(b => (
                            <tr key={b.id}><td className="p-4"><div className="w-10 h-10 bg-white border p-1 rounded"><img src={b.logoUrl} className="w-full h-full object-contain"/></div></td><td className="p-4 font-bold dark:text-white">{b.name}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(b, 'brand')} className="text-slate-400 hover:text-peculiar-500 p-2 rounded-lg"><Pencil size={18} /></button><button onClick={() => handleDelete(b.id, 'brand')} className="text-slate-400 hover:text-red-500 p-2 rounded-lg"><Trash2 size={18} /></button></div></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === 'settings' && (
             <form onSubmit={handleSettingsSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 max-w-3xl">
                 <div className="space-y-8">
                     
                     {/* General Info */}
                     <section className="space-y-4">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">General Info</h3>
                         <div className="grid md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-bold mb-1">Brand Name</label><input name="brandName" value={settingsForm.brandName || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"/></div>
                            <div><label className="block text-sm font-bold mb-1">Website Logo</label><div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">{logoPreview && <img src={logoPreview} className="w-full h-full object-cover" />}</div><input type="file" accept="image/*" onChange={handleLogoSelect} className="text-sm text-slate-500"/></div></div>
                            <div><label className="block text-sm font-bold mb-1">Favicon</label><div className="flex items-center gap-4"><div className="w-8 h-8 bg-slate-100 rounded overflow-hidden flex-shrink-0">{faviconPreview && <img src={faviconPreview} className="w-full h-full object-cover" />}</div><input type="file" accept="image/*" onChange={handleFaviconSelect} className="text-sm text-slate-500"/></div></div>
                         </div>
                     </section>

                     {/* Paystack Settings - NEW */}
                     <section className="space-y-4">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Payment Gateway (Paystack)</h3>
                         <div className="grid md:grid-cols-1 gap-4">
                             <div>
                                 <label className="block text-sm font-bold mb-1">Public Key (Required for Checkout)</label>
                                 <input name="paystackPublicKey" placeholder="pk_live_..." value={settingsForm.paystackPublicKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-sm"/>
                             </div>
                             <div>
                                 <label className="block text-sm font-bold mb-1">Secret Key (Optional - Stored for Reference)</label>
                                 <input name="paystackSecretKey" placeholder="sk_live_..." type="password" value={settingsForm.paystackSecretKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-sm"/>
                                 <p className="text-xs text-red-500 mt-1">Warning: Ensure your database security policies are set correctly if storing secret keys.</p>
                             </div>
                         </div>
                     </section>

                     {/* Contact Details */}
                     <section className="space-y-4">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Contact Details</h3>
                         <div className="grid md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-bold mb-1">Email</label><input name="contactEmail" value={settingsForm.contactEmail || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"/></div>
                             <div><label className="block text-sm font-bold mb-1">Phone</label><input name="contactPhone" value={settingsForm.contactPhone || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"/></div>
                             <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Address</label><input name="address" value={settingsForm.address || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"/></div>
                             <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">WhatsApp Number</label><input name="whatsappNumber" placeholder="+234..." value={settingsForm.whatsappNumber || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"/></div>
                         </div>
                     </section>

                     {/* Integrations */}
                     <section className="space-y-4">
                         <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Integrations</h3>
                         <div className="grid md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-bold mb-1">Chat Widget</label><select name="chatWidgetType" value={settingsForm.chatWidgetType || 'whatsapp'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="none">None</option><option value="whatsapp">WhatsApp Only</option><option value="tawk">Tawk.to Only</option><option value="both">Both</option></select></div>
                             <div><label className="block text-sm font-bold mb-1">Position</label><select name="chatPosition" value={settingsForm.chatPosition || 'right'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="right">Right</option><option value="left">Left</option></select></div>
                             <div><label className="block text-sm font-bold mb-1">Visibility</label><select name="chatVisibility" value={settingsForm.chatVisibility || 'both'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="both">All Devices</option><option value="mobile">Mobile Only</option><option value="desktop">Desktop Only</option></select></div>
                         </div>
                         <div className="grid md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg"><div className="md:col-span-2 text-sm font-bold text-slate-500 uppercase">Tawk.to Config</div><div><label className="block text-sm font-bold mb-1">Property ID</label><input name="tawkToPropertyId" value={settingsForm.tawkToPropertyId || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"/></div><div><label className="block text-sm font-bold mb-1">Widget ID</label><input name="tawkToWidgetId" value={settingsForm.tawkToWidgetId || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"/></div></div>
                     </section>
                     
                     <section className="space-y-4"><div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800"><input type="checkbox" id="cookieConsent" name="cookieConsentEnabled" checked={settingsForm.cookieConsentEnabled || false} onChange={handleSettingsChange} className="w-5 h-5 accent-peculiar-600"/><label htmlFor="cookieConsent" className="text-sm font-bold cursor-pointer">Enable Cookie Consent Banner</label></div></section>
                     <div className="pt-6"><button type="submit" disabled={dataLoading} className="w-full py-3 rounded-lg bg-peculiar-600 text-white font-bold hover:bg-peculiar-500 shadow-lg flex items-center justify-center gap-2">{dataLoading ? <Loader size={20} className="animate-spin" /> : <><Save size={20}/> Save Changes</>}</button></div>
                 </div>
             </form>
        )}
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                {editId ? 'Edit' : 'Add New'} {modalType}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* --- IMAGE UPLOAD (Shared) --- */}
              {['project', 'product', 'blog', 'brand'].includes(modalType) && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <p className="text-sm font-bold mb-2 text-slate-500">{modalType === 'blog' ? 'Cover Image' : 'Main Display Image'}</p>
                    <label className="cursor-pointer block"><input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />{previewUrl ? (<div className="relative group"><img src={previewUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium">Change Image</div></div>) : (<div className="py-8 text-slate-500 dark:text-slate-400"><Upload className="mx-auto mb-2 text-peculiar-500" size={32} /><p className="font-bold">Click to Upload Image</p></div>)}</label>
                  </div>
              )}

              {/* --- PACKAGE FIELDS (NEW) --- */}
              {modalType === 'package' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold mb-1">Package Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.name} onChange={e => setPackageForm({...packageForm, name: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold mb-1">Price Text</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.price} onChange={e => setPackageForm({...packageForm, price: e.target.value})} placeholder="e.g. ₦50,000" /></div>
                    </div>
                    <div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.categoryId} onChange={e => setPackageForm({...packageForm, categoryId: e.target.value})} required><option value="">Select Category</option>{pricingCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="block text-sm font-bold mb-1">Discount Price (Optional)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.discountPrice} onChange={e => setPackageForm({...packageForm, discountPrice: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold mb-1">Description</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-20" value={packageForm.description} onChange={e => setPackageForm({...packageForm, description: e.target.value})} /></div>
                    <div><label className="block text-sm font-bold mb-1">Features (One per line)</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-32 font-mono text-sm" value={packageFeaturesInput} onChange={e => setPackageFeaturesInput(e.target.value)} /></div>
                    <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={packageForm.isPopular} onChange={e => setPackageForm({...packageForm, isPopular: e.target.checked})} className="w-5 h-5 accent-peculiar-600"/> Mark as Popular</label>
                  </>
              )}

              {/* --- CALCULATOR FIELDS (NEW) --- */}
              {modalType === 'calculator' && (
                  <>
                    <div><label className="block text-sm font-bold mb-1">Item Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.name} onChange={e => setCalcItemForm({...calcItemForm, name: e.target.value})} /></div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold mb-1">Price (Number)</label><input type="number" required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.price} onChange={e => setCalcItemForm({...calcItemForm, price: Number(e.target.value)})} /></div>
                        <div><label className="block text-sm font-bold mb-1">Category</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.category} onChange={e => setCalcItemForm({...calcItemForm, category: e.target.value})} placeholder="e.g. Feature, Addon" /></div>
                    </div>
                  </>
              )}

              {/* --- EXISTING FIELDS (Project/Product/Blog/Brand) --- */}
              {modalType === 'project' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Title</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Client</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.client} onChange={e => setProjectForm({...projectForm, client: e.target.value})} /></div></div>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value as any})}><option value="Website">Website</option><option value="WebApp">WebApp</option><option value="MobileApp">MobileApp</option><option value="Automation">Automation</option></select></div><div><label className="block text-sm font-bold mb-1">Status</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value as any})}><option value="In Progress">In Progress</option><option value="Delivered">Delivered</option><option value="Maintenance">Maintenance</option></select></div></div>
                  {projectForm.status === 'In Progress' && (<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800"><label className="block text-sm font-bold mb-2 flex justify-between"><span>Project Progress</span><span className="text-blue-600 dark:text-blue-400">{projectForm.progress}%</span></label><input type="range" min="0" max="100" value={projectForm.progress} onChange={e => setProjectForm({...projectForm, progress: parseInt(e.target.value)})} className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-900"/></div>)}
                  <div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-24" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Tech Stack (comma separated)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="React, Node.js, Supabase" value={stackInput} onChange={e => setStackInput(e.target.value)} /></div>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Project Budget</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="₦500,000" value={projectForm.budget} onChange={e => setProjectForm({...projectForm, budget: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Delivery Period</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="4 Weeks" value={projectForm.deliveryPeriod} onChange={e => setProjectForm({...projectForm, deliveryPeriod: e.target.value})} /></div></div>
                  <div><label className="block text-sm font-bold mb-1 flex items-center gap-2"><ExternalLink size={14}/> Live Link</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.link} onChange={e => setProjectForm({...projectForm, link: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Client Testimonial</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-20" placeholder="Enter client feedback if available..." value={projectForm.testimonial} onChange={e => setProjectForm({...projectForm, testimonial: e.target.value})} /></div>
                </>
              )}
              {modalType === 'product' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Product Title</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Price</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="50000" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} /></div></div>
                  <div><label className="block text-sm font-bold mb-1">Type</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value as any})}><option value="Template">Template</option><option value="Source Code">Source Code</option><option value="White Label">White Label</option></select></div>
                  <div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-24" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Key Features (One per line)</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-32 font-mono text-sm" placeholder="Feature 1&#10;Feature 2&#10;Feature 3" value={productFeaturesInput} onChange={e => setProductFeaturesInput(e.target.value)} /></div>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Payment Link</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="https://paystack.com/..." value={productForm.purchaseLink} onChange={e => setProductForm({...productForm, purchaseLink: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Demo URL (Optional)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="https://demo.example.com" value={productForm.demoUrl} onChange={e => setProductForm({...productForm, demoUrl: e.target.value})} /></div></div>
                </>
              )}
              {modalType === 'blog' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Title</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Slug (Optional - Auto Generated)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="my-blog-post" value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})} /></div></div>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Author</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} /></div><div><label className="block text-sm font-bold mb-1">Read Time (Optional)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="Auto-calculated if empty" value={blogForm.readTime} onChange={e => setBlogForm({...blogForm, readTime: e.target.value})} /></div></div>
                  <div><label className="block text-sm font-bold mb-1">Excerpt (Short Summary)</label><textarea required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-20" value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-1">Tags (comma separated)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="Tech, Automation, News" value={blogTagsInput} onChange={e => setBlogTagsInput(e.target.value)} /></div>
                  <div><label className="block text-sm font-bold mb-1">Content</label><textarea required className="w-full p-4 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-96 font-sans text-base leading-relaxed" placeholder="Write your article content here. Use paragraphs..." value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} /><p className="text-xs text-slate-500 mt-2">Basic spacing and paragraphs are preserved.</p></div>
                </>
              )}
              {modalType === 'brand' && (
                <><div><label className="block text-sm font-bold mb-1">Brand Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} /></div></>
              )}
              
              {/* --- SCREENSHOTS (Project/Product) --- */}
              {(modalType === 'project' || modalType === 'product') && (
                  <div><label className="block text-sm font-bold mb-2">{modalType === 'project' ? 'Project Screenshots' : 'Product Gallery'}</label><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">{screenshotPreviews.map((url, idx) => (<div key={idx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200"><img src={url} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" /><button type="button" onClick={() => removeScreenshot(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button></div>))}<label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg aspect-video cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><PlusCircle className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Add Image</span><input type="file" multiple accept="image/*" onChange={handleScreenshotsSelect} className="hidden" /></label></div></div>
              )}

              <div className="pt-4 flex justify-end gap-4">
                 <button type="button" onClick={closeModal} className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700">Cancel</button>
                 <button type="submit" disabled={dataLoading} className="px-6 py-2 rounded-lg bg-peculiar-600 text-white font-bold hover:bg-peculiar-500 shadow-lg flex items-center gap-2">{dataLoading ? <Loader size={18} className="animate-spin" /> : (editId ? 'Update Item' : 'Save Item')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;