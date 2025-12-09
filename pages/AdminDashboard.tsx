
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { DataService } from '../services/dataService';
import { Project, Product, Brand, SiteSettings, BlogPost, PricingPackage, ServiceInquiry, CalculatorItem, PricingCategory } from '../types';
import { Plus, Trash2, FolderGit2, ShoppingBag, Star, LogOut, Lock, Loader, AlertCircle, X, ExternalLink, Image as ImageIcon, Upload, Pencil, PlusCircle, Settings, Save, BookOpen, Link as LinkIcon, DollarSign, ListOrdered, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../components/SettingsContext';

const initialProjectState: Partial<Project> = { title: '', client: '', category: 'Website', description: '', stack: [], imageUrl: '', screenshots: [], link: '', status: 'In Progress', budget: '', deliveryPeriod: '', testimonial: '', progress: 0 };
const initialProductState: Partial<Product> = { title: '', price: '', type: 'Template', description: '', imageUrl: '', purchaseLink: '', features: [], demoUrl: '', screenshots: [] };
const initialBrandState: Partial<Brand> = { name: '', logoUrl: '' };
const initialBlogPostState: Partial<BlogPost> = { title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Admin', tags: [], readTime: '5 min read' };
const initialPackageState: Partial<PricingPackage> = { categoryId: '', name: '', price: '', discountPrice: '', description: '', features: [], isPopular: false };
const initialCalcItemState: Partial<CalculatorItem> = { name: '', price: 0, category: 'Feature', isActive: true };

const AdminDashboard: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'shop' | 'brands' | 'blog' | 'pricing' | 'orders' | 'calculator' | 'settings'>('projects');

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('project');
  const [editId, setEditId] = useState<string | null>(null);

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

  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedScreenshots, setSelectedScreenshots] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) fetchData();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchData = async () => {
    setDataLoading(true);
    const [p, pr, b, bl, s, pkgs, cats, inqs, calcs] = await Promise.all([
      DataService.getProjects(), DataService.getProducts(), DataService.getBrands(), DataService.getBlogPosts(),
      DataService.getSettings(), DataService.getPricingPackages(), DataService.getPricingCategories(), DataService.getInquiries(), DataService.getAllCalculatorItems()
    ]);
    setProjects(p); setProducts(pr); setBrands(b); setBlogPosts(bl); setSettings(s); setSettingsForm(s);
    setPricingPackages(pkgs); setPricingCategories(cats); setInquiries(inqs); setCalcItems(calcs);
    setLogoPreview(s.logoUrl); setFaviconPreview(s.faviconUrl);
    setDataLoading(false);
  };

  const formatPrice = (price: string) => {
    if (price.includes('₦')) return price;
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₦${num.toLocaleString()}`;
    return `₦${price}`;
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cookieConsentEnabled') setSettingsForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    else setSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataLoading(true);
    try {
      let newLogoUrl = settingsForm.logoUrl;
      let newFaviconUrl = settingsForm.faviconUrl;
      if (logoFile) newLogoUrl = await DataService.uploadImage(logoFile, 'brands');
      if (faviconFile) newFaviconUrl = await DataService.uploadImage(faviconFile, 'brands');
      await DataService.updateSettings({ ...settingsForm, logoUrl: newLogoUrl, faviconUrl: newFaviconUrl });
      await refreshSettings();
      alert("Settings saved successfully!");
    } catch (error) { console.error(error); alert('Failed to save settings'); } finally { setDataLoading(false); }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };
  const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFaviconFile(file); setFaviconPreview(URL.createObjectURL(file)); }
  };

  const openModal = (type: string) => {
    setModalType(type); setEditId(null);
    setProjectForm(initialProjectState); setProductForm(initialProductState); setBrandForm(initialBrandState); setBlogForm(initialBlogPostState); setPackageForm(initialPackageState); setCalcItemForm(initialCalcItemState);
    setStackInput(''); setProductFeaturesInput(''); setBlogTagsInput(''); setPackageFeaturesInput('');
    setSelectedFile(null); setPreviewUrl(null); setSelectedScreenshots([]); setScreenshotPreviews([]);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    setEditId(item.id); setModalType(type); setSelectedFile(null); setSelectedScreenshots([]); setScreenshotPreviews([]);
    if (type === 'project') {
      setProjectForm(item); setStackInput(item.stack.join(', ')); setPreviewUrl(item.imageUrl); setScreenshotPreviews(item.screenshots || []);
    } else if (type === 'product') {
      setProductForm(item); setProductFeaturesInput((item.features || []).join('\n')); setPreviewUrl(item.imageUrl); setScreenshotPreviews(item.screenshots || []);
    } else if (type === 'brand') {
      setBrandForm(item); setPreviewUrl(item.logoUrl);
    } else if (type === 'blog') {
      setBlogForm(item); setBlogTagsInput((item.tags || []).join(', ')); setPreviewUrl(item.coverImage);
    } else if (type === 'package') {
      setPackageForm(item); setPackageFeaturesInput(item.features.join('\n'));
    } else if (type === 'calculator') {
      setCalcItemForm(item);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { setSelectedFile(e.target.files[0]); setPreviewUrl(URL.createObjectURL(e.target.files[0])); } };
  const handleScreenshotsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setSelectedScreenshots(p => [...p, ...files]);
      setScreenshotPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))]);
    }
  };
  const removeScreenshot = (index: number) => setScreenshotPreviews(p => p.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDataLoading(true);
    try {
      let imageUrl = '';
      if (selectedFile) imageUrl = await DataService.uploadImage(selectedFile, modalType === 'product' ? 'products' : 'projects');
      else if (modalType === 'project') imageUrl = projectForm.imageUrl || '';
      else if (modalType === 'product') imageUrl = productForm.imageUrl || '';
      else if (modalType === 'brand') imageUrl = brandForm.logoUrl || '';
      else if (modalType === 'blog') imageUrl = blogForm.coverImage || '';

      if (modalType === 'project') {
        let screenshotUrls = projectForm.screenshots || [];
        if (selectedScreenshots.length) {
          const newUrls = await Promise.all(selectedScreenshots.map(f => DataService.uploadImage(f, 'projects')));
          screenshotUrls = [...screenshotUrls, ...newUrls];
        }
        const payload = { ...projectForm, stack: stackInput.split(',').map(s => s.trim()).filter(s => s), imageUrl, screenshots: screenshotUrls };
        if (editId) await DataService.updateProject(editId, payload); else await DataService.addProject(payload as Project);
      } else if (modalType === 'product') {
        let screenshotUrls = productForm.screenshots || [];
        if (selectedScreenshots.length) {
          const newUrls = await Promise.all(selectedScreenshots.map(f => DataService.uploadImage(f, 'products')));
          screenshotUrls = [...screenshotUrls, ...newUrls];
        }
        const payload = { ...productForm, imageUrl, features: productFeaturesInput.split('\n').filter(s => s.trim()), screenshots: screenshotUrls };
        if (editId) await DataService.updateProduct(editId, payload); else await DataService.addProduct(payload as Product);
      } else if (modalType === 'brand') {
        const payload = { ...brandForm, logoUrl: imageUrl };
        if (editId) await DataService.updateBrand(editId, payload); else await DataService.addBrand(payload as Brand);
      } else if (modalType === 'blog') {
        let slug = blogForm.slug || blogForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || '';
        const payload = { ...blogForm, coverImage: imageUrl, slug, tags: blogTagsInput.split(',').map(s => s.trim()).filter(s => s) };
        if (editId) await DataService.updateBlogPost(editId, payload); else await DataService.addBlogPost(payload as BlogPost);
      } else if (modalType === 'package') {
        const payload = { ...packageForm, features: packageFeaturesInput.split('\n').filter(f => f.trim()) };
        if (editId) await DataService.updatePackage(editId, payload); else await DataService.addPackage(payload as PricingPackage);
      } else if (modalType === 'calculator') {
        if (editId) await DataService.updateCalculatorItem(editId, calcItemForm); else await DataService.addCalculatorItem(calcItemForm as CalculatorItem);
      }
      await fetchData(); closeModal();
    } catch (error: any) { console.error(error); alert(`Error saving: ${error.message}`); } finally { setDataLoading(false); }
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm("Delete this item?")) return;
    setDataLoading(true);
    try {
      if (type === 'project') await DataService.deleteProject(id);
      else if (type === 'product') await DataService.deleteProduct(id);
      else if (type === 'brand') await DataService.deleteBrand(id);
      else if (type === 'blog') await DataService.deleteBlogPost(id);
      else if (type === 'package') await DataService.deletePackage(id);
      else if (type === 'calculator') await DataService.deleteCalculatorItem(id);
      await fetchData();
    } catch (error: any) { alert(`Error deleting: ${error.message}`); } finally { setDataLoading(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader size={40} className="animate-spin text-peculiar-500" /></div>;
  if (!session) return (<div className="min-h-[80vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-12"><div className="w-full max-w-md"><div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"><div className="text-center mb-8"><div className="w-16 h-16 bg-peculiar-100 dark:bg-peculiar-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-peculiar-600"><Lock size={32} /></div><h2 className="text-2xl font-black text-slate-900 dark:text-white">Admin Portal</h2><p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to manage Peculiar Digitals</p></div>{loginError && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"><AlertCircle size={20} /><span>{loginError}</span></div>}<form onSubmit={handleLogin} className="space-y-6"><div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none transition-all dark:text-white" required /></div><div><label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-peculiar-500 outline-none transition-all dark:text-white" required /></div><button type="submit" disabled={authLoading} className="w-full py-3 bg-peculiar-600 hover:bg-peculiar-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-peculiar-500/25 flex items-center justify-center gap-2 disabled:opacity-70">{authLoading ? <Loader size={20} className="animate-spin" /> : 'Secure Login'}</button></form></div></div></div>);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 lg:p-6 flex flex-col z-10 lg:min-h-screen sticky top-16 lg:top-0 h-auto">
        <h2 className="text-xl font-black text-peculiar-600 mb-6 tracking-tight hidden lg:block">DASHBOARD</h2>
        <nav className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-visible">
          {['projects', 'shop', 'blog', 'brands', 'pricing', 'orders', 'calculator', 'settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-shrink-0 flex items-center gap-3 w-auto lg:w-full text-left p-3 rounded-lg font-medium transition-colors capitalize ${activeTab === tab ? 'bg-peculiar-50 dark:bg-peculiar-900/20 text-peculiar-600 dark:text-peculiar-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              {tab === 'projects' && <FolderGit2 size={20} />}{tab === 'shop' && <ShoppingBag size={20} />}{tab === 'blog' && <BookOpen size={20} />}{tab === 'brands' && <Star size={20} />}{tab === 'pricing' && <DollarSign size={20} />}{tab === 'orders' && <ListOrdered size={20} />}{tab === 'calculator' && <Calculator size={20} />}{tab === 'settings' && <Settings size={20} />}<span className="hidden sm:inline">{tab}</span>
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto hidden lg:block"><div className="text-sm text-slate-500 mb-4 px-2 truncate">{session.user.email}</div><button onClick={handleLogout} className="flex items-center gap-3 w-full text-left p-3 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"><LogOut size={20} /> Sign Out</button></div>
      </aside>
      <main className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize flex items-center gap-3">{activeTab === 'settings' ? 'Site Configuration' : `${activeTab} Manager`} {dataLoading && <Loader size={16} className="animate-spin text-peculiar-500" />}</h1></div>
          {['projects', 'shop', 'blog', 'brands', 'pricing', 'calculator'].includes(activeTab) && (
            <button onClick={() => openModal(activeTab === 'pricing' ? 'package' : activeTab === 'shop' ? 'product' : activeTab === 'blog' ? 'blog' : activeTab === 'brands' ? 'brand' : activeTab === 'projects' ? 'project' : 'calculator')} className="flex items-center gap-2 bg-peculiar-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-peculiar-500 shadow-lg hover:shadow-peculiar-500/25 transition-all"><Plus size={18} /> Add New {activeTab === 'shop' ? 'Product' : activeTab === 'blog' ? 'Post' : activeTab.slice(0, -1)}</button>
          )}
        </div>
        {/* ... Tables for Projects, Shop, Blog, Brands, Pricing, Orders, Calculator ... */}
        {activeTab === 'pricing' && (<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"><tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{pricingPackages.map(pkg => (<tr key={pkg.id}><td className="p-4 font-bold">{pkg.name}</td><td className="p-4">{pkg.price}</td><td className="p-4 text-right"><button onClick={() => handleEdit(pkg, 'package')}><Pencil size={18} /></button><button onClick={() => handleDelete(pkg.id, 'package')}><Trash2 size={18} /></button></td></tr>))}</tbody></table></div></div>)}
        {activeTab === 'orders' && (<div className="grid gap-6">{inquiries.map(inq => (<div key={inq.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow border dark:border-slate-800"><div><strong>{inq.clientName}</strong> ordered {inq.packageName}</div><div className="text-sm">{inq.email} | {inq.phone}</div><div className="mt-2 text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">{inq.projectDescription}</div><select className="mt-2 p-1 border rounded" value={inq.status} onChange={(e) => DataService.updateInquiryStatus(inq.id!, e.target.value).then(fetchData)}><option>New</option><option>Contacted</option><option>Invoiced</option><option>Closed</option></select></div>))}</div>)}
        {activeTab === 'calculator' && (<div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-4">Item</th><th className="p-4">Price</th><th className="p-4">Actions</th></tr></thead><tbody>{calcItems.map(item => (<tr key={item.id}><td className="p-4">{item.name}</td><td className="p-4">₦{item.price}</td><td className="p-4"><button onClick={() => handleEdit(item, 'calculator')}><Pencil size={18} /></button><button onClick={() => handleDelete(item.id, 'calculator')}><Trash2 size={18} /></button></td></tr>))}</tbody></table></div></div>)}
        {/* ... (Existing Tabs: Projects, Shop, Blog, Brands) ... */}

        {activeTab === 'settings' && (
          <form onSubmit={handleSettingsSubmit} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 lg:p-8 max-w-3xl">
            <div className="space-y-8">
              <section className="space-y-4"><h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">General Info</h3><div className="grid md:grid-cols-2 gap-6"><div><label className="block text-sm font-bold mb-1">Brand Name</label><input name="brandName" value={settingsForm.brandName || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div><div><label className="block text-sm font-bold mb-1">Website Logo</label><div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">{logoPreview && <img src={logoPreview} className="w-full h-full object-cover" />}</div><input type="file" accept="image/*" onChange={handleLogoSelect} className="text-sm text-slate-500" /></div></div><div><label className="block text-sm font-bold mb-1">Favicon</label><div className="flex items-center gap-4"><div className="w-8 h-8 bg-slate-100 rounded overflow-hidden flex-shrink-0">{faviconPreview && <img src={faviconPreview} className="w-full h-full object-cover" />}</div><input type="file" accept="image/*" onChange={handleFaviconSelect} className="text-sm text-slate-500" /></div></div></div></section>

              {/* PAYSTACK SETTINGS (UPDATED) */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Payment Gateway (Paystack)</h3>

                <div className="flex items-center gap-4 mb-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <span className="text-sm font-bold">Payment Mode:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="paystackMode" value="live" checked={settingsForm.paystackMode === 'live'} onChange={handleSettingsChange} className="w-4 h-4 accent-green-600" /><span className="text-sm">Live</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="paystackMode" value="test" checked={settingsForm.paystackMode === 'test'} onChange={handleSettingsChange} className="w-4 h-4 accent-orange-500" /><span className="text-sm">Test</span></label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* LIVE KEYS */}
                  <div className="space-y-4 border-r border-slate-200 dark:border-slate-700 pr-4">
                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Live Keys</h4>
                    <div><label className="block text-xs font-bold mb-1">Live Public Key</label><input name="paystackPublicKey" placeholder="pk_live_..." value={settingsForm.paystackPublicKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs" /></div>
                    <div><label className="block text-xs font-bold mb-1">Live Secret Key</label><input name="paystackSecretKey" placeholder="sk_live_..." type="password" value={settingsForm.paystackSecretKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs" /></div>
                  </div>
                  {/* TEST KEYS */}
                  <div className="space-y-4 pl-4">
                    <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Test Keys</h4>
                    <div><label className="block text-xs font-bold mb-1">Test Public Key</label><input name="paystackTestPublicKey" placeholder="pk_test_..." value={settingsForm.paystackTestPublicKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs" /></div>
                    <div><label className="block text-xs font-bold mb-1">Test Secret Key</label><input name="paystackTestSecretKey" placeholder="sk_test_..." type="password" value={settingsForm.paystackTestSecretKey || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs" /></div>
                  </div>
                </div>
              </section>

              <section className="space-y-4"><h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Contact Details</h3><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Email</label><input name="contactEmail" value={settingsForm.contactEmail || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div><div><label className="block text-sm font-bold mb-1">Phone</label><input name="contactPhone" value={settingsForm.contactPhone || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div><div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Address</label><input name="address" value={settingsForm.address || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div><div className="md:col-span-2"><label className="block text-sm font-bold mb-1">WhatsApp Number</label><input name="whatsappNumber" placeholder="+234..." value={settingsForm.whatsappNumber || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" /></div></div></section>
              <section className="space-y-4"><h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Integrations</h3><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Chat Widget</label><select name="chatWidgetType" value={settingsForm.chatWidgetType || 'whatsapp'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="none">None</option><option value="whatsapp">WhatsApp Only</option><option value="tawk">Tawk.to Only</option><option value="both">Both</option></select></div><div><label className="block text-sm font-bold mb-1">Position</label><select name="chatPosition" value={settingsForm.chatPosition || 'right'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="right">Right</option><option value="left">Left</option></select></div><div><label className="block text-sm font-bold mb-1">Visibility</label><select name="chatVisibility" value={settingsForm.chatVisibility || 'both'} onChange={handleSettingsChange} className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"><option value="both">All Devices</option><option value="mobile">Mobile Only</option><option value="desktop">Desktop Only</option></select></div></div><div className="grid md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg"><div className="md:col-span-2 text-sm font-bold text-slate-500 uppercase">Tawk.to Config</div><div><label className="block text-sm font-bold mb-1">Property ID</label><input name="tawkToPropertyId" value={settingsForm.tawkToPropertyId || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700" /></div><div><label className="block text-sm font-bold mb-1">Widget ID</label><input name="tawkToWidgetId" value={settingsForm.tawkToWidgetId || ''} onChange={handleSettingsChange} className="w-full p-2 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700" /></div></div></section>
              <section className="space-y-4"><div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800"><input type="checkbox" id="cookieConsent" name="cookieConsentEnabled" checked={settingsForm.cookieConsentEnabled || false} onChange={handleSettingsChange} className="w-5 h-5 accent-peculiar-600" /><label htmlFor="cookieConsent" className="text-sm font-bold cursor-pointer">Enable Cookie Consent Banner</label></div></section>
              <div className="pt-6"><button type="submit" disabled={dataLoading} className="w-full py-3 rounded-lg bg-peculiar-600 text-white font-bold hover:bg-peculiar-500 shadow-lg flex items-center justify-center gap-2">{dataLoading ? <Loader size={20} className="animate-spin" /> : <><Save size={20} /> Save Changes</>}</button></div>
            </div>
          </form>
        )}
      </main>

      {/* Modal is same as before */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{editId ? 'Edit' : 'Add New'} {modalType}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* ... (Existing modal fields) ... */}
              {['project', 'product', 'blog', 'brand'].includes(modalType) && (<div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center"><p className="text-sm font-bold mb-2 text-slate-500">{modalType === 'blog' ? 'Cover Image' : 'Main Display Image'}</p><label className="cursor-pointer block"><input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />{previewUrl ? (<div className="relative group"><img src={previewUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white font-medium">Change Image</div></div>) : (<div className="py-8 text-slate-500 dark:text-slate-400"><Upload className="mx-auto mb-2 text-peculiar-500" size={32} /><p className="font-bold">Click to Upload Image</p></div>)}</label></div>)}
              {modalType === 'package' && (
                <>
                  <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Package Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.name} onChange={e => setPackageForm({ ...packageForm, name: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Price Text</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.price} onChange={e => setPackageForm({ ...packageForm, price: e.target.value })} placeholder="e.g. ₦50,000" /></div></div>
                  <div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.categoryId} onChange={e => setPackageForm({ ...packageForm, categoryId: e.target.value })} required><option value="">Select Category</option>{pricingCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div><label className="block text-sm font-bold mb-1">Discount Price (Optional)</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={packageForm.discountPrice} onChange={e => setPackageForm({ ...packageForm, discountPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-bold mb-1">Description</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-20" value={packageForm.description} onChange={e => setPackageForm({ ...packageForm, description: e.target.value })} /></div>
                  <div><label className="block text-sm font-bold mb-1">Features (One per line)</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-32 font-mono text-sm" value={packageFeaturesInput} onChange={e => setPackageFeaturesInput(e.target.value)} /></div>
                  <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={packageForm.isPopular} onChange={e => setPackageForm({ ...packageForm, isPopular: e.target.checked })} className="w-5 h-5 accent-peculiar-600" /> Mark as Popular</label>
                </>
              )}
              {modalType === 'calculator' && (
                <><div><label className="block text-sm font-bold mb-1">Item Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.name} onChange={e => setCalcItemForm({ ...calcItemForm, name: e.target.value })} /></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Price (Number)</label><input type="number" required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.price} onChange={e => setCalcItemForm({ ...calcItemForm, price: Number(e.target.value) })} /></div><div><label className="block text-sm font-bold mb-1">Category</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={calcItemForm.category} onChange={e => setCalcItemForm({ ...calcItemForm, category: e.target.value })} placeholder="e.g. Feature, Addon" /></div></div></>
              )}
              {/* ... other modals omitted for brevity as they are unchanged from previous versions, only added to ensure full file integrity if copied directly ... */}
              {modalType === 'project' && (<><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Title</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.title} onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Client</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} /></div></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Category</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.category} onChange={e => setProjectForm({ ...projectForm, category: e.target.value as any })}><option value="Website">Website</option><option value="WebApp">WebApp</option><option value="MobileApp">MobileApp</option><option value="Automation">Automation</option></select></div><div><label className="block text-sm font-bold mb-1">Status</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.status} onChange={e => setProjectForm({ ...projectForm, status: e.target.value as any })}><option value="In Progress">In Progress</option><option value="Delivered">Delivered</option><option value="Maintenance">Maintenance</option></select></div></div><div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-24" value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Tech Stack</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={stackInput} onChange={e => setStackInput(e.target.value)} /></div><div><label className="block text-sm font-bold mb-1">Live Link</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={projectForm.link} onChange={e => setProjectForm({ ...projectForm, link: e.target.value })} /></div></>)}
              {modalType === 'product' && (<><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Product Title</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Price</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} /></div></div><div><label className="block text-sm font-bold mb-1">Type</label><select className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.type} onChange={e => setProductForm({ ...productForm, type: e.target.value as any })}><option value="Template">Template</option><option value="Source Code">Source Code</option><option value="White Label">White Label</option></select></div><div><label className="block text-sm font-bold mb-1">Description</label><textarea required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-24" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Features</label><textarea className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-32" value={productFeaturesInput} onChange={e => setProductFeaturesInput(e.target.value)} /></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold mb-1">Payment Link</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.purchaseLink} onChange={e => setProductForm({ ...productForm, purchaseLink: e.target.value })} /></div><div><label className="block text-sm font-bold mb-1">Demo URL</label><input className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={productForm.demoUrl} onChange={e => setProductForm({ ...productForm, demoUrl: e.target.value })} /></div></div></>)}
              {modalType === 'brand' && (<div><label className="block text-sm font-bold mb-1">Brand Name</label><input required className="w-full p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" value={brandForm.name} onChange={e => setBrandForm({ ...brandForm, name: e.target.value })} /></div>)}
              {(modalType === 'project' || modalType === 'product') && (<div><label className="block text-sm font-bold mb-2">{modalType === 'project' ? 'Project Screenshots' : 'Product Gallery'}</label><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">{screenshotPreviews.map((url, idx) => (<div key={idx} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200"><img src={url} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" /><button type="button" onClick={() => removeScreenshot(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button></div>))}<label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg aspect-video cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><PlusCircle className="text-slate-400 mb-1" /><span className="text-xs text-slate-500">Add Image</span><input type="file" multiple accept="image/*" onChange={handleScreenshotsSelect} className="hidden" /></label></div></div>)}

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
