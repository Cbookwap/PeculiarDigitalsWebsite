
export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'Website' | 'WebApp' | 'MobileApp' | 'Automation';
  description: string;
  stack: string[];
  imageUrl: string;
  screenshots: string[];
  link?: string;
  status: 'Delivered' | 'In Progress' | 'Maintenance';
  budget?: string; // Mapped from DB 'worth'
  progress?: number; // 0 to 100
  deliveryPeriod?: string;
  testimonial?: string;
}

export interface Product {
  id: string;
  title: string;
  price: string;
  type: 'Template' | 'Source Code' | 'White Label';
  description: string;
  imageUrl: string;
  purchaseLink: string; // Could be Paystack/Flutterwave link
  features?: string[];
  demoUrl?: string;
  screenshots?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  
  // Payment Gateway
  paystackMode: 'live' | 'test';
  paystackPublicKey?: string;
  paystackSecretKey?: string;
  paystackTestPublicKey?: string;
  paystackTestSecretKey?: string;

  // Integrations
  tawkToPropertyId: string;
  tawkToWidgetId: string;
  chatWidgetType: 'whatsapp' | 'tawk' | 'both' | 'none';
  chatPosition: 'left' | 'right';
  chatVisibility: 'mobile' | 'desktop' | 'both';
  
  // Cookies
  cookieConsentEnabled: boolean;
}

export interface ServiceItem {
  name: string;
  subItems: string[];
}

export interface BookingRequest {
  serviceType: string;
  subService?: string;
  name: string;
  email: string;
  phone: string;
  budget?: string;
  message: string;
}

// --- NEW PRICING TYPES ---
export interface PricingCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface PricingPackage {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  discountPrice?: string;
  description?: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceInquiry {
  id?: string;
  packageName: string;
  clientName: string;
  companyName?: string;
  email: string;
  phone: string;
  whatsapp: string;
  projectDescription: string;
  additionalDetails?: string;
  hasDomain?: string;
  hasHosting?: string;
  budgetRange?: string;
  status: 'New' | 'Contacted' | 'Invoiced' | 'Closed';
  createdAt?: string;
}

export interface CalculatorItem {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
}
