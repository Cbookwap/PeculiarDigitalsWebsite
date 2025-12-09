
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Project, Product, Brand, SiteSettings, BlogPost, PricingCategory, PricingPackage, ServiceInquiry, CalculatorItem } from '../types';
import { INITIAL_PROJECTS, INITIAL_PRODUCTS, INITIAL_BRANDS, INITIAL_BLOG_POSTS, BRAND_NAME, CONTACT_PHONE, EMAIL, WHATSAPP_PHONE } from '../constants';

// Helper to check if Supabase is configured
const isConfigured = () => {
  return isSupabaseConfigured();
};

// --- DATA MAPPING HELPERS ---
// Supabase returns snake_case, Frontend uses camelCase

const mapProjectFromDB = (data: any): Project => ({
  id: data.id,
  title: data.title,
  client: data.client,
  category: data.category,
  description: data.description,
  stack: data.stack || [],
  imageUrl: data.image_url,
  screenshots: data.screenshots || [],
  link: data.link,
  status: data.status,
  budget: data.worth, // DB column is 'worth', Frontend uses 'budget'
  progress: data.progress || 0,
  deliveryPeriod: data.delivery_period,
  testimonial: data.testimonial
});

const mapProjectToDB = (project: Partial<Project>) => ({
  title: project.title,
  client: project.client,
  category: project.category,
  description: project.description,
  stack: project.stack,
  image_url: project.imageUrl,
  screenshots: project.screenshots,
  link: project.link,
  status: project.status,
  worth: project.budget, // DB column is 'worth'
  progress: project.progress,
  delivery_period: project.deliveryPeriod,
  testimonial: project.testimonial
});

const mapProductFromDB = (data: any): Product => ({
  id: data.id,
  title: data.title,
  price: data.price,
  type: data.type,
  description: data.description,
  imageUrl: data.image_url,
  purchaseLink: data.purchase_link,
  features: data.features || [],
  demoUrl: data.demo_url,
  screenshots: data.screenshots || []
});

const mapProductToDB = (product: Partial<Product>) => ({
  title: product.title,
  price: product.price,
  type: product.type,
  description: product.description,
  image_url: product.imageUrl,
  purchase_link: product.purchaseLink,
  features: product.features,
  demo_url: product.demoUrl,
  screenshots: product.screenshots
});

const mapBlogPostFromDB = (data: any): BlogPost => ({
  id: data.id,
  title: data.title,
  slug: data.slug,
  excerpt: data.excerpt,
  content: data.content,
  coverImage: data.cover_image,
  author: data.author,
  publishedAt: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : '',
  readTime: data.read_time || '5 min read',
  tags: data.tags || []
});

const mapBlogPostToDB = (post: Partial<BlogPost>) => ({
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  cover_image: post.coverImage,
  author: post.author,
  read_time: post.readTime,
  tags: post.tags
});

const mapBrandFromDB = (data: any): Brand => ({
  id: data.id,
  name: data.name,
  logoUrl: data.logo_url
});

const mapBrandToDB = (brand: Partial<Brand>) => ({
  name: brand.name,
  logo_url: brand.logoUrl
});

// Settings Mapping
const mapSettingsFromDB = (data: any): SiteSettings => ({
  id: data.id,
  brandName: data.brand_name || BRAND_NAME,
  logoUrl: data.logo_url || '',
  faviconUrl: data.favicon_url || '',
  contactEmail: data.contact_email || EMAIL,
  contactPhone: data.contact_phone || CONTACT_PHONE,
  whatsappNumber: data.whatsapp_number || WHATSAPP_PHONE,
  address: data.address || '',
  socialFacebook: data.social_facebook || '',
  socialTwitter: data.social_twitter || '',
  socialInstagram: data.social_instagram || '',
  socialLinkedin: data.social_linkedin || '',
  
  // Paystack
  paystackMode: data.paystack_mode || 'live',
  paystackPublicKey: data.paystack_public_key || '',
  paystackSecretKey: data.paystack_secret_key || '',
  paystackTestPublicKey: data.paystack_test_public_key || '',
  paystackTestSecretKey: data.paystack_test_secret_key || '',

  tawkToPropertyId: data.tawk_to_property_id || '',
  tawkToWidgetId: data.tawk_to_widget_id || '',
  chatWidgetType: data.chat_widget_type || 'whatsapp',
  chatPosition: data.chat_position || 'right',
  chatVisibility: data.chat_visibility || 'both',
  cookieConsentEnabled: data.cookie_consent_enabled ?? true
});

const mapSettingsToDB = (settings: Partial<SiteSettings>) => ({
  brand_name: settings.brandName,
  logo_url: settings.logoUrl,
  favicon_url: settings.faviconUrl,
  contact_email: settings.contactEmail,
  contact_phone: settings.contactPhone,
  whatsapp_number: settings.whatsappNumber,
  address: settings.address,
  social_facebook: settings.socialFacebook,
  social_twitter: settings.socialTwitter,
  social_instagram: settings.socialInstagram,
  social_linkedin: settings.socialLinkedin,
  
  // Paystack
  paystack_mode: settings.paystackMode,
  paystack_public_key: settings.paystackPublicKey,
  paystack_secret_key: settings.paystackSecretKey,
  paystack_test_public_key: settings.paystackTestPublicKey,
  paystack_test_secret_key: settings.paystackTestSecretKey,

  tawk_to_property_id: settings.tawkToPropertyId,
  tawk_to_widget_id: settings.tawkToWidgetId,
  chat_widget_type: settings.chatWidgetType,
  chat_position: settings.chatPosition,
  chat_visibility: settings.chatVisibility,
  cookie_consent_enabled: settings.cookieConsentEnabled
});

// --- NEW PRICING MAPPERS ---
const mapPricingCategoryFromDB = (data: any): PricingCategory => ({
  id: data.id,
  name: data.name,
  sortOrder: data.sort_order
});

const mapPricingPackageFromDB = (data: any): PricingPackage => ({
  id: data.id,
  categoryId: data.category_id,
  name: data.name,
  price: data.price,
  discountPrice: data.discount_price,
  description: data.description,
  features: data.features || [],
  isPopular: data.is_popular
});

const mapPricingPackageToDB = (pkg: Partial<PricingPackage>) => ({
  category_id: pkg.categoryId,
  name: pkg.name,
  price: pkg.price,
  discount_price: pkg.discountPrice,
  description: pkg.description,
  features: pkg.features,
  is_popular: pkg.isPopular
});

const mapInquiryFromDB = (data: any): ServiceInquiry => ({
  id: data.id,
  packageName: data.package_name,
  clientName: data.client_name,
  companyName: data.company_name,
  email: data.email,
  phone: data.phone,
  whatsapp: data.whatsapp,
  projectDescription: data.project_description,
  additionalDetails: data.additional_details,
  hasDomain: data.has_domain,
  hasHosting: data.has_hosting,
  budgetRange: data.budget_range,
  status: data.status,
  createdAt: data.created_at
});

const mapInquiryToDB = (inq: Partial<ServiceInquiry>) => ({
  package_name: inq.packageName,
  client_name: inq.clientName,
  company_name: inq.companyName,
  email: inq.email,
  phone: inq.phone,
  whatsapp: inq.whatsapp,
  project_description: inq.projectDescription,
  additional_details: inq.additionalDetails,
  has_domain: inq.hasDomain,
  has_hosting: inq.hasHosting,
  budget_range: inq.budgetRange,
  status: inq.status
});

const mapCalculatorItemFromDB = (data: any): CalculatorItem => ({
  id: data.id,
  name: data.name,
  price: Number(data.price),
  category: data.category,
  isActive: data.is_active
});

const mapCalculatorItemToDB = (item: Partial<CalculatorItem>) => ({
  name: item.name,
  price: item.price,
  category: item.category,
  is_active: item.isActive
});

// --- SERVICE METHODS ---

export const DataService = {
  // Storage Upload
  uploadImage: async (file: File, bucket: 'projects' | 'products' | 'brands'): Promise<string> => {
    if (!isConfigured()) throw new Error("Supabase not configured");
    
    const bucketName = bucket; 

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Settings
  getSettings: async (): Promise<SiteSettings> => {
    if (!isConfigured()) return mapSettingsFromDB({});

    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
    
    if (error) {
      console.warn("Could not fetch settings:", error.message);
      return mapSettingsFromDB({});
    }
    return mapSettingsFromDB(data);
  },

  updateSettings: async (settings: Partial<SiteSettings>): Promise<void> => {
    if (!isConfigured()) return;
    
    const dbPayload = mapSettingsToDB(settings);
    
    const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
    
    if (existing) {
      const { error } = await supabase.from('site_settings').update(dbPayload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('site_settings').insert([dbPayload]);
      if (error) throw error;
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    if (!isConfigured()) return INITIAL_PROJECTS as unknown as Project[];
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data ? data.map(mapProjectFromDB) : [];
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    if (!isConfigured()) {
       const found = (INITIAL_PROJECTS as unknown as Project[]).find(p => p.id === id);
       return found || null;
    }
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching project:', error);
      return null;
    }
    return data ? mapProjectFromDB(data) : null;
  },
  
  addProject: async (project: Project): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapProjectToDB(project);
    const { error } = await supabase.from('projects').insert([dbPayload]);
    if (error) throw error;
  },

  updateProject: async (id: string, project: Partial<Project>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapProjectToDB(project);
    const { error } = await supabase.from('projects').update(dbPayload).eq('id', id);
    if (error) throw error;
  },
  
  deleteProject: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    if (!isConfigured()) return INITIAL_PRODUCTS;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data ? data.map(mapProductFromDB) : [];
  },

  getProductById: async (id: string): Promise<Product | null> => {
    if (!isConfigured()) {
       const found = (INITIAL_PRODUCTS as unknown as Product[]).find(p => p.id === id);
       return found || null;
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    return data ? mapProductFromDB(data) : null;
  },
  
  addProduct: async (product: Product): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapProductToDB(product);
    const { error } = await supabase.from('products').insert([dbPayload]);
    if (error) throw error;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapProductToDB(product);
    const { error } = await supabase.from('products').update(dbPayload).eq('id', id);
    if (error) throw error;
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // Blog Posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    if (!isConfigured()) return INITIAL_BLOG_POSTS;

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return data ? data.map(mapBlogPostFromDB) : [];
  },

  getBlogPostById: async (id: string): Promise<BlogPost | null> => {
    if (!isConfigured()) {
      const found = INITIAL_BLOG_POSTS.find(p => p.id === id || p.slug === id);
      return found || null;
    }

    try {
        const cleanId = id.trim().toLowerCase(); // Normalize input
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
        
        let query = supabase.from('blog_posts').select('*');

        if (isUuid) {
            query = query.eq('id', cleanId);
        } else {
            query = query.eq('slug', id.trim());
        }
        
        const { data, error } = await query.maybeSingle(); 

        if (data) {
            return mapBlogPostFromDB(data);
        }
        
        // Fallback: Fetch all and find in memory
        const { data: allPosts } = await supabase.from('blog_posts').select('*');
        if (allPosts) {
            const found = allPosts.find((p: any) => {
               const dbSlug = (p.slug || '').toLowerCase().trim();
               const dbId = p.id;
               return dbId === cleanId || dbSlug === cleanId;
            });
            if (found) return mapBlogPostFromDB(found);
        }

        return null;

    } catch (err) {
        console.error("Critical error in getBlogPostById:", err);
        return null;
    }
  },

  addBlogPost: async (post: BlogPost): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapBlogPostToDB(post);
    const { error } = await supabase.from('blog_posts').insert([dbPayload]);
    if (error) throw error;
  },

  updateBlogPost: async (id: string, post: Partial<BlogPost>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapBlogPostToDB(post);
    const { error } = await supabase.from('blog_posts').update(dbPayload).eq('id', id);
    if (error) throw error;
  },

  deleteBlogPost: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  },

  // Brands
  getBrands: async (): Promise<Brand[]> => {
    if (!isConfigured()) return INITIAL_BRANDS;
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
    return data ? data.map(mapBrandFromDB) : [];
  },
  
  addBrand: async (brand: Brand): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapBrandToDB(brand);
    const { error } = await supabase.from('brands').insert([dbPayload]);
    if (error) throw error;
  },

  updateBrand: async (id: string, brand: Partial<Brand>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapBrandToDB(brand);
    const { error } = await supabase.from('brands').update(dbPayload).eq('id', id);
    if (error) throw error;
  },
  
  deleteBrand: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw error;
  },

  // --- NEW PRICING METHODS ---
  getPricingCategories: async (): Promise<PricingCategory[]> => {
    if (!isConfigured()) return [];
    const { data } = await supabase.from('pricing_categories').select('*').order('sort_order', { ascending: true });
    return data ? data.map(mapPricingCategoryFromDB) : [];
  },

  getPricingPackages: async (): Promise<PricingPackage[]> => {
    if (!isConfigured()) return [];
    const { data } = await supabase.from('pricing_packages').select('*').order('created_at', { ascending: true });
    return data ? data.map(mapPricingPackageFromDB) : [];
  },

  getPackageById: async (id: string): Promise<PricingPackage | null> => {
    if (!isConfigured()) return null;
    const { data } = await supabase.from('pricing_packages').select('*').eq('id', id).single();
    return data ? mapPricingPackageFromDB(data) : null;
  },

  addPackage: async (pkg: PricingPackage): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapPricingPackageToDB(pkg);
    const { error } = await supabase.from('pricing_packages').insert([dbPayload]);
    if (error) throw error;
  },

  updatePackage: async (id: string, pkg: Partial<PricingPackage>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapPricingPackageToDB(pkg);
    const { error } = await supabase.from('pricing_packages').update(dbPayload).eq('id', id);
    if (error) throw error;
  },

  deletePackage: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('pricing_packages').delete().eq('id', id);
    if (error) throw error;
  },

  // --- CALCULATOR METHODS ---
  getCalculatorItems: async (): Promise<CalculatorItem[]> => {
    if (!isConfigured()) return [];
    const { data } = await supabase.from('calculator_items').select('*').eq('is_active', true).order('price', { ascending: true });
    return data ? data.map(mapCalculatorItemFromDB) : [];
  },

  getAllCalculatorItems: async (): Promise<CalculatorItem[]> => {
    if (!isConfigured()) return [];
    const { data } = await supabase.from('calculator_items').select('*').order('category', { ascending: true });
    return data ? data.map(mapCalculatorItemFromDB) : [];
  },

  addCalculatorItem: async (item: CalculatorItem): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapCalculatorItemToDB(item);
    const { error } = await supabase.from('calculator_items').insert([dbPayload]);
    if (error) throw error;
  },

  updateCalculatorItem: async (id: string, item: Partial<CalculatorItem>): Promise<void> => {
    if (!isConfigured()) return;
    const dbPayload = mapCalculatorItemToDB(item);
    const { error } = await supabase.from('calculator_items').update(dbPayload).eq('id', id);
    if (error) throw error;
  },

  deleteCalculatorItem: async (id: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('calculator_items').delete().eq('id', id);
    if (error) throw error;
  },

  // --- INQUIRY METHODS ---
  submitInquiry: async (inquiry: ServiceInquiry): Promise<void> => {
    if (!isConfigured()) {
        console.log("Mock inquiry submitted:", inquiry);
        return;
    }
    const dbPayload = mapInquiryToDB(inquiry);
    const { error } = await supabase.from('service_inquiries').insert([dbPayload]);
    if (error) throw error;
  },

  getInquiries: async (): Promise<ServiceInquiry[]> => {
    if (!isConfigured()) return [];
    const { data } = await supabase.from('service_inquiries').select('*').order('created_at', { ascending: false });
    return data ? data.map(mapInquiryFromDB) : [];
  },

  updateInquiryStatus: async (id: string, status: string): Promise<void> => {
    if (!isConfigured()) return;
    const { error } = await supabase.from('service_inquiries').update({ status }).eq('id', id);
    if (error) throw error;
  }
};
