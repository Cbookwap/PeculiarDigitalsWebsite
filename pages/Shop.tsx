import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { Product } from '../types';
import { ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    DataService.getProducts().then(setProducts);
  }, []);

  const formatPrice = (price: string) => {
    if (price.includes('₦')) return price;
    const num = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) return `₦${num.toLocaleString()}`;
    return `₦${price}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Digital Shop</h1>
          <p className="text-slate-600 dark:text-slate-400">Premium templates, source codes, and white-label solutions.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link to={`/shop/${product.id}`} key={product.id} className="block group">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-56 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <span className="absolute bottom-4 left-4 bg-peculiar-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Tag size={12} /> {product.type}
                    </span>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-peculiar-500 transition-colors">{product.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                    <span className="text-peculiar-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        View Details <ArrowRight size={16} />
                    </span>
                    </div>
                </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;