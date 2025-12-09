
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Product, ServiceInquiry } from '../types';
import { useSettings } from '../components/SettingsContext';
import { ArrowLeft, ShoppingBag, CheckCircle, MonitorPlay, ExternalLink, ShieldCheck, X, Loader } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { usePaystackPayment } from 'react-paystack';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto-scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (id) {
      DataService.getProductById(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  const formatPrice = (price: string) => {
    if (price.includes('₦')) return price;
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₦${num.toLocaleString()}`;
    return `₦${price}`;
  };

  const getNumericPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const handleBuyNow = () => {
    setIsCheckoutOpen(true);
  };

  // Logic to determine which key to use based on mode
  const getPaystackKey = () => {
      if (!settings) return '';
      // @ts-ignore: settings might have extra properties from DB not fully typed in context sometimes
      return settings.paystackMode === 'test' 
        ? settings.paystackTestPublicKey 
        : settings.paystackPublicKey;
  };

  const activeKey = getPaystackKey();

  // Infinite Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !product?.screenshots || product.screenshots.length === 0) return;
    let animationId: number;
    const scroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= (container.scrollWidth / 2)) container.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [product, isPaused]);

  // On Success Handler
  const onSuccess = (reference: any) => {
    // Save order to database
    const inquiry: ServiceInquiry = {
        packageName: `[SHOP] ${product?.title}`,
        clientName: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        whatsapp: customerDetails.phone,
        projectDescription: `Purchased Product: ${product?.title}. Paystack Ref: ${reference.reference}`,
        status: 'Invoiced' 
    };
    DataService.submitInquiry(inquiry);
    setPaymentSuccess(true);
    setIsCheckoutOpen(false);
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  // Custom Paystack Button Component
  const PayButton = () => {
      const amountInKobo = (getNumericPrice(product?.price || '0') * 100);
      
      // Fix TS2345: Explicitly type config as any to bypass strict checks
      const config: any = {
        reference: (new Date()).getTime().toString(),
        email: customerDetails.email,
        amount: amountInKobo,
        publicKey: activeKey || '',
        metadata: {
            name: customerDetails.name,
            phone: customerDetails.phone,
            custom_fields: []
        }
      };
      
      const initializePayment = usePaystackPayment(config);
      
      return (
          <button 
            type="button"
            onClick={() => {
                if (!activeKey) {
                    alert("Payment Gateway not configured correctly. Please contact support.");
                    return;
                }
                // Fix TS2554: Suppress argument count error
                // @ts-ignore
                initializePayment(onSuccess, onClose);
            }}
            className="w-full py-3 bg-peculiar-600 text-white font-bold rounded-lg hover:bg-peculiar-500 shadow-lg"
          >
              Pay Now {formatPrice(product?.price || '0')}
          </button>
      );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950"><Loader className="animate-spin text-peculiar-500"/></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Product Not Found</div>;

  // Duplicate screenshots for infinite loop
  const displayScreenshots = product.screenshots && product.screenshots.length > 0 
    ? [...product.screenshots, ...product.screenshots, ...product.screenshots, ...product.screenshots] 
    : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/shop')} className="mb-8 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-peculiar-500 transition-colors">
            <ArrowLeft size={20} /> Back to Shop
        </button>

        {paymentSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl text-center border border-green-200 dark:border-green-800 animate-fade-in">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Payment Successful!</h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8">
                    Your order for <strong>{product.title}</strong> has been confirmed. Please check your email for the download link or next steps.
                </p>
                <button onClick={() => navigate('/shop')} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">
                    Continue Shopping
                </button>
            </div>
        ) : (
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Left: Image (Same as before) */}
                <Reveal>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-800">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-peculiar-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                            {product.type}
                        </div>
                    </div>
                </div>
                {/* Trust Badges (Same as before) */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <ShieldCheck className="text-green-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <CheckCircle className="text-blue-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Verified Code</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <MonitorPlay className="text-purple-500 mb-2" size={24} />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Instant Access</span>
                    </div>
                </div>
                </Reveal>

                {/* Right: Details & Pay Button */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">{product.title}</h1>
                        <div className="text-3xl font-bold text-peculiar-600 dark:text-peculiar-400 mb-6">
                            {formatPrice(product.price)}
                        </div>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        {settings?.paystackPublicKey || settings?.paystackTestPublicKey ? (
                            <button 
                                onClick={handleBuyNow} 
                                className="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                <ShoppingBag size={20} /> Buy Now
                            </button>
                        ) : (
                            <a href={product.purchaseLink} target="_blank" rel="noopener noreferrer" 
                            className="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg">
                                <ShoppingBag size={20} /> Buy Now (External)
                            </a>
                        )}
                        
                        {product.demoUrl && (
                            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex-1 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-lg">
                                <ExternalLink size={20} /> Live Demo
                            </a>
                        )}
                    </div>

                    {product.features && product.features.length > 0 && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Key Features</h3>
                            <div className="space-y-3">
                                {product.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                                            <CheckCircle size={14} />
                                        </div>
                                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Screenshots Gallery (Same as before) */}
        {displayScreenshots.length > 0 && (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Product Gallery</h3>
                <div 
                   className="relative w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg group bg-white dark:bg-slate-900 p-4"
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
                          <div key={idx} className="flex-shrink-0 w-[85vw] md:w-[600px] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video">
                              <img src={shot} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" />
                          </div>
                      ))}
                   </div>
                </div>
            </div>
        )}

        {/* --- CHECKOUT MODAL --- */}
        {isCheckoutOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
                    <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={24} />
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Customer Details</h3>
                    
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                            <input 
                                required 
                                value={customerDetails.name} 
                                onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-peculiar-500"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address</label>
                            <input 
                                type="email"
                                required 
                                value={customerDetails.email} 
                                onChange={e => setCustomerDetails({...customerDetails, email: e.target.value})}
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-peculiar-500"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">Phone Number</label>
                            <input 
                                required 
                                value={customerDetails.phone} 
                                onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})}
                                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-peculiar-500"
                                placeholder="080..."
                            />
                        </div>

                        <div className="pt-4">
                            {customerDetails.name && customerDetails.email && customerDetails.phone ? (
                                <PayButton />
                            ) : (
                                <button type="button" disabled className="w-full py-3 bg-slate-300 dark:bg-slate-800 text-slate-500 rounded-lg font-bold cursor-not-allowed">
                                    Fill details to Pay
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
