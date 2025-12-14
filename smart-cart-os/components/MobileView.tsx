import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ShoppingCart, Scan, CreditCard, ChevronLeft, Plus, Minus, Trash2, ChefHat, Camera, X, Search, QrCode, Store, User, Heart, Wallet, Bitcoin, Clock, AlertTriangle, Loader2, ArrowDown, Info, Star, PackageX, CheckCircle2, History, MapPin, ChevronRight, Truck, Receipt, Activity, TrendingUp, TrendingDown, Scale, ShoppingBag, Phone, MessageSquare, Navigation, Bike, ArrowLeft } from 'lucide-react';
import { CartItem, MobileScreen, Product } from '../types';
import { getRecipeSuggestion, identifyProductFromImage } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';

// High-quality images for the catalog
const PRODUCT_IMAGES: Record<string, string> = {
  'p-001': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80', // Organic Milk
  'p-002': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', // Sourdough Bread
  'p-003': 'https://images.unsplash.com/photo-1523049673856-38866ea6c0d1?auto=format&fit=crop&w=400&q=80', // Avocados
  'p-004': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80', // Eggs
  'p-005': 'https://images.unsplash.com/photo-1474979266404-7cadd259d300?auto=format&fit=crop&w=400&q=80', // Olive Oil
  'p-006': 'https://images.unsplash.com/photo-1566478919030-26d81dd812cd?auto=format&fit=crop&w=400&q=80', // Chips
};

const getProductImage = (item: Product | CartItem) => {
    return PRODUCT_IMAGES[item.id] || item.image;
};

// --- Star Rating Component ---
const StarRating = ({ rating, onRate, size = 14, interactive = false, className = '' }: { rating: number, onRate?: (r: number) => void, size?: number, interactive?: boolean, className?: string }) => {
  return (
    <div className={`flex items-center ${className}`} role="group" aria-label="Product rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          aria-label={`Rate ${star} out of 5 stars`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRate?.(star);
          }}
          className={`${interactive ? 'cursor-pointer hover:scale-110 active:scale-95 p-1.5 -m-1' : 'cursor-default p-0.5'} transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200`}
        >
          <Star
            size={size}
            className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-50'}`}
            strokeWidth={star <= rating ? 0 : 1.5}
          />
        </button>
      ))}
    </div>
  );
};

// --- Product Detail Modal ---
const ProductDetailModal = ({ 
    product, 
    currentPrice,
    trend,
    onClose, 
    onAdd, 
    rating, 
    onRate 
}: { 
    product: Product; 
    currentPrice: number;
    trend?: 'up' | 'down' | 'same';
    onClose: () => void; 
    onAdd: (p: Product) => void, 
    rating: number, 
    onRate: (r: number) => void 
}) => {
    const [animate, setAnimate] = useState(false);
    
    // Default to true if undefined (for robust backward compatibility or AI items)
    const inStock = product.inStock !== false;

    useEffect(() => {
        setAnimate(true);
        return () => setAnimate(false);
    }, []);

    if (!product) return null;

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${animate ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose} 
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div className={`bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 relative pointer-events-auto shadow-2xl transition-transform duration-300 transform ${animate ? 'translate-y-0' : 'translate-y-full'}`}>
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Close details"
                 >
                    <X size={20} className="text-gray-600" />
                 </button>

                 <div className="flex gap-5 mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 shadow-inner relative">
                        <img src={getProductImage(product)} alt={product.name} className={`w-full h-full object-cover ${!inStock ? 'grayscale opacity-70' : ''}`} />
                        {!inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30">
                                <PackageX size={24} className="text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-start justify-between">
                            <h3 id="modal-title" className="text-xl font-bold text-gray-900 leading-tight pr-8">{product.name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 font-medium">{product.category}</p>
                        
                        <div className="mt-2 flex items-center gap-2">
                             <StarRating rating={rating} onRate={onRate} size={20} interactive className="py-1" />
                             <span className="text-xs text-gray-400 font-medium">{rating > 0 ? 'Your Rating' : 'Rate It'}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <p className="text-indigo-600 font-bold text-lg">₹{currentPrice.toFixed(2)}</p>
                                    {trend === 'up' && <TrendingUp size={16} className="text-red-500" />}
                                    {trend === 'down' && <TrendingDown size={16} className="text-green-500" />}
                                </div>
                                {trend && trend !== 'same' && (
                                    <span className={`text-[10px] font-bold uppercase ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                                        Price {trend === 'up' ? 'Up' : 'Down'}
                                    </span>
                                )}
                            </div>
                            {inStock ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">
                                    <CheckCircle2 size={10} /> In Stock
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">
                                    <PackageX size={10} /> Out of Stock
                                </span>
                            )}
                        </div>
                        
                        {/* Weight Display - Added clearly below Price */}
                        <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Scale size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-700">Net Weight: {product.weight_g}g</span>
                        </div>
                    </div>
                 </div>
                 
                 <div className="space-y-6 mb-8">
                    {product.nutrition ? (
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                             <div className="flex items-center gap-2 mb-4">
                                <Activity size={16} className="text-indigo-500" />
                                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nutrition Facts</h4>
                             </div>
                             <div className="grid grid-cols-4 gap-4 divide-x divide-slate-200">
                                 <div className="text-center px-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Kcal</p>
                                    <p className="font-bold text-slate-900 text-lg">{product.nutrition.calories}</p>
                                 </div>
                                 <div className="text-center px-1 pl-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Prot</p>
                                    <p className="font-bold text-slate-900 text-lg">{product.nutrition.protein}</p>
                                 </div>
                                 <div className="text-center px-1 pl-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Carb</p>
                                    <p className="font-bold text-slate-900 text-lg">{product.nutrition.carbs}</p>
                                 </div>
                                 <div className="text-center px-1 pl-4">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Fat</p>
                                    <p className="font-bold text-slate-900 text-lg">{product.nutrition.fat}</p>
                                 </div>
                             </div>
                        </div>
                    ) : (
                         <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm italic">
                            Nutritional information not available.
                         </div>
                    )}

                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                            <Info size={16} className="text-indigo-500"/> Ingredients
                        </h4>
                        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {product.ingredients?.join(', ') || 'No ingredients listed for this product.'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                         <span>UID: {product.rfid_uid}</span>
                    </div>
                 </div>

                 <button 
                    onClick={() => { if (inStock) { onAdd({ ...product, price: currentPrice }); onClose(); } }}
                    disabled={!inStock}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.98] focus:outline-none focus:ring-4 ${
                        inStock 
                        ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 focus:ring-indigo-200' 
                        : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                    }`}
                    aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
                 >
                    {inStock ? (
                        <>
                            <Plus size={20} />
                            Add to Cart
                        </>
                    ) : (
                        <>
                            <PackageX size={20} />
                            Out of Stock
                        </>
                    )}
                 </button>
            </div>
        </div>
    );
};

// --- Pull To Refresh Component ---
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh, className = '' }) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Attempt to find the scrollable parent (the div in App.tsx)
    const scrollParent = containerRef.current?.closest('.overflow-y-auto');
    if (scrollParent && scrollParent.scrollTop > 5) return; // Allow some buffer
    if (!scrollParent && window.scrollY > 5) return;

    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null || refreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      // Logarithmic resistance
      const resistance = 0.4;
      setTranslateY(Math.min(diff * resistance, 150));
    }
  };

  const handleTouchEnd = async () => {
    if (startY === null) return;

    if (translateY > 80) {
      setRefreshing(true);
      setTranslateY(80);
      await onRefresh();
      setRefreshing(false);
    }
    
    setTranslateY(0);
    setStartY(null);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative min-h-full ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center pointer-events-none z-20"
        style={{ 
          height: `${translateY}px`, 
          opacity: translateY > 0 ? 1 : 0,
          transition: refreshing ? 'height 0.2s ease-out' : 'height 0s'
        }}
        aria-hidden="true"
      >
        <div className="mt-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg border border-indigo-100 text-indigo-600 h-fit transform translate-y-2">
            {refreshing ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <ArrowDown 
                    size={20} 
                    style={{ transform: `rotate(${Math.min(translateY * 2.5, 180)}deg)` }} 
                    className="transition-transform duration-200"
                />
            )}
        </div>
      </div>

      {/* Content */}
      <div 
        style={{ 
          transform: `translateY(${translateY}px)`,
          transition: refreshing ? 'transform 0.2s ease-out' : 'transform 0.15s ease-out'
        }}
        className="h-full"
      >
        {children}
      </div>
    </div>
  );
};


interface MobileViewProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onSimulateScan: () => void;
  onAddProduct: (product: Product) => void;
  total: number;
}

interface SwipeableItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  rating: number;
  onRate: (r: number) => void;
}

const SwipeableCartItem: React.FC<SwipeableItemProps> = ({ item, onUpdateQuantity, onRemove, isFavorite, onToggleFavorite, rating, onRate }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only allow swipe if horizontal movement is dominant (scrolling protection)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Only allow swiping left (negative diffX)
        if (diffX < 0 && diffX > -150) {
            setOffsetX(diffX);
        }
    }
  };

  const onTouchEnd = () => {
    if (offsetX < -75) { // Threshold to delete
        setOffsetX(-500); // Animate off screen
        setTimeout(() => onRemove(item.id), 200);
    } else {
        setOffsetX(0); // Snap back
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
      }
  };

  return (
    <div className="relative overflow-hidden mb-4 rounded-xl group touch-pan-y select-none">
        {/* Background Layer (Delete Action) */}
        <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-8 rounded-xl z-0" aria-hidden="true">
            <Trash2 className="text-white animate-pulse" size={24} />
        </div>

        {/* Foreground Layer (Content) */}
        <div 
            className="bg-white relative z-10 transition-transform duration-200 ease-out border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ transform: `translateX(${offsetX}px)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={`${item.name}, quantity ${item.quantity}, click to toggle details or swipe left to remove.`}
            onKeyDown={handleKeyDown}
        >
             <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Product Info */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative">
                        <img src={getProductImage(item)} alt={item.name} className="w-full h-full object-cover" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                            className="absolute top-1 right-1 bg-white/90 p-2.5 rounded-full shadow-sm hover:scale-110 transition-all z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={isFavorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
                        >
                            <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
                        </button>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">{item.id.substring(0,8)}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500">Category: <span className="text-gray-700 font-medium">{item.category}</span></p>
                            <span className="text-gray-300" aria-hidden="true">|</span>
                            <div onClick={e => e.stopPropagation()}>
                                <StarRating rating={rating} onRate={onRate} interactive size={12} className="p-1" />
                            </div>
                        </div>
                        
                        {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-2 animate-in fade-in slide-in-from-top-1">
                                <div className="flex justify-between items-center">
                                    <span>Weight: <span className="text-gray-900 font-medium">{item.weight_g}g</span></span>
                                    {item.nutrition && <span className="text-indigo-600 font-bold">{item.nutrition.calories} kcal</span>}
                                </div>
                                {item.ingredients && (
                                    <p className="leading-relaxed">
                                        <span className="font-medium text-gray-700">Ingredients:</span> {item.ingredients.slice(0, 5).join(', ')}{item.ingredients.length > 5 ? '...' : ''}
                                    </p>
                                )}
                                {item.nutrition && (
                                    <div className="flex gap-2 pt-1" aria-label="Nutritional macros">
                                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-blue-100" title="Protein">P: {item.nutrition.protein}</span>
                                        <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-green-100" title="Carbohydrates">C: {item.nutrition.carbs}</span>
                                        <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-medium border border-yellow-100" title="Fat">F: {item.nutrition.fat}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quantity */}
                <div className="col-span-1 md:col-span-3 flex justify-center">
                    <div className="flex items-center bg-gray-50 rounded-lg p-1" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, -1); }}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={`Decrease quantity of ${item.name}`}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900" aria-label={`Current quantity ${item.quantity}`}>{item.quantity}</span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, 1); }}
                            className="w-10 h-10 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-indigo-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            aria-label={`Increase quantity of ${item.name}`}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Price */}
                <div className="col-span-1 md:col-span-2 text-right">
                    <span className="font-bold text-lg text-gray-900" aria-label={`Subtotal ${item.price * item.quantity} rupees`}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    {item.addedAt && (
                        <p className="text-[10px] text-gray-400 mt-1 font-medium">
                            Added {new Date(item.addedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>

                {/* Delete (Desktop/Fallback) */}
                <div className="col-span-1 flex justify-end">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-3 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                        aria-label={`Remove ${item.name} from cart`}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
             </div>
        </div>
    </div>
  );
};

const MobileView: React.FC<MobileViewProps> = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onSimulateScan, 
  onAddProduct,
  total 
}) => {
  const [screen, setScreen] = useState<MobileScreen>('CART');
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState<{name: string; category: string; confidence: number; image: string; weight: number} | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Market Simulation State
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [priceTrends, setPriceTrends] = useState<Record<string, 'up' | 'down' | 'same'>>({});

  useEffect(() => {
    // Initialize prices
    const initialPrices: Record<string, number> = {};
    MOCK_PRODUCTS.forEach(p => { initialPrices[p.id] = p.price; });
    setMarketPrices(initialPrices);

    // Update prices every 15 seconds to simulate market fluctuation
    const interval = setInterval(() => {
        setMarketPrices(prev => {
            const next = { ...prev };
            const trends: Record<string, 'up' | 'down' | 'same'> = {};
            
            MOCK_PRODUCTS.forEach(p => {
                const base = p.price;
                // Fluctuate between -5% and +5% of BASE price to prevent drift
                const fluctuation = (Math.random() * 0.1) - 0.05; 
                const newPrice = Number((base * (1 + fluctuation)).toFixed(2));
                
                // Compare with previous displayed price for trend arrow
                const current = prev[p.id] || base;
                
                next[p.id] = newPrice;
                trends[p.id] = newPrice > current ? 'up' : newPrice < current ? 'down' : 'same';
            });
            setPriceTrends(trends);
            return next;
        });
    }, 15000); // 15 seconds for "real-time" demo feel

    return () => clearInterval(interval);
  }, []);

  const getPrice = (productId: string) => marketPrices[productId] || MOCK_PRODUCTS.find(p => p.id === productId)?.price || 0;
  const getTrend = (productId: string) => priceTrends[productId] || 'same';

  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'STRIPE' | 'CARD' | 'BITCOIN'>('WALLET');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
        const saved = localStorage.getItem('smartcart_recent');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const addToRecentlyViewed = (product: Product) => {
      setRecentlyViewed(prev => {
          // Remove if exists to move to top, ensuring no duplicates
          const filtered = prev.filter(p => p.id !== product.id);
          const updated = [product, ...filtered].slice(0, 5);
          localStorage.setItem('smartcart_recent', JSON.stringify(updated));
          return updated;
      });
  };

  const handleRefresh = async () => {
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const playSuccessSound = () => {
      try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(800, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
              osc.start();
              osc.stop(ctx.currentTime + 0.15);
          }
      } catch (e) {
          // Ignore audio errors
      }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessingPayment(false);
    onClearCart();
    setScreen('ORDER_SUCCESS');
    playSuccessSound();
  };

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
        const saved = localStorage.getItem('smartcart_favorites');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  // Ratings State
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    try {
        const saved = localStorage.getItem('smartcart_ratings');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('smartcart_ratings', JSON.stringify(ratings));
  }, [ratings]);

  const handleRate = (id: string, rating: number) => {
    setRatings(prev => ({ ...prev, [id]: rating }));
  };

  // Calculate Delivery Time
  const deliveryEstimate = useMemo(() => {
    if (cart.length === 0) return "--";
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    // Base 15 mins + 1.5 mins per item + 5 mins traffic buffer
    const minTime = Math.ceil(15 + (itemCount * 1.5) + 5);
    const maxTime = minTime + 10;
    return `${minTime}-${maxTime} min`;
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('smartcart_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
        prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };
  
  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [scannerSupported, setScannerSupported] = useState(false);

  useEffect(() => {
    if ('BarcodeDetector' in window) {
        setScannerSupported(true);
    }
  }, []);

  // Barcode Detection Loop
  useEffect(() => {
    let intervalId: number;
    let detector: any;

    const initDetector = async () => {
        if ('BarcodeDetector' in window) {
            // @ts-ignore
            detector = new window.BarcodeDetector({
                formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
            });
        }
    };

    const startScanning = async () => {
        if (screen === 'SCAN_CAMERA' && videoRef.current && !scanResult) {
            await initDetector();
            
            if (!detector) return;

            intervalId = window.setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === 4 && !analyzingImage) {
                    try {
                        const barcodes = await detector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                            const code = barcodes[0].rawValue;
                            handleScannedCode(code);
                        }
                    } catch (err) {
                        // Ignore frame errors
                    }
                }
            }, 200);
        }
    };

    if (screen === 'SCAN_CAMERA') {
        startScanning();
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [screen, analyzingImage, scanResult]);

  const handleScannedCode = (code: string) => {
      const exactMatch = MOCK_PRODUCTS.find(p => p.rfid_uid === code || p.id === code);
      // Demo fallback: Map unknown codes to a mock product using hash
      const product = exactMatch || MOCK_PRODUCTS[Math.abs(code.split('').reduce((a,b)=>a+b.charCodeAt(0),0)) % MOCK_PRODUCTS.length];

      if (product) {
          playSuccessSound();
          if (navigator.vibrate) navigator.vibrate(200);
          
          // Instead of adding immediately, show real-time detection overlay
          setScanResult({
              name: product.name,
              category: product.category,
              confidence: 1, // 100% confidence for barcode match
              image: getProductImage(product),
              weight: product.weight_g
          });
          // Note: The camera loop pauses effectively because scanResult is set, 
          // preventing further detections in the useEffect dependency.
      }
  };

  const handleGetRecipe = async () => {
    setLoadingRecipe(true);
    const result = await getRecipeSuggestion(cart);
    setRecipe(result);
    setLoadingRecipe(false);
  };

  const startCamera = async () => {
    setScreen('SCAN_CAMERA');
    setIsCameraActive(true);
    setTimeout(async () => {
      if (videoRef.current) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            videoRef.current.srcObject = stream;
        } catch (e) {
            console.error("Camera error", e);
            alert("Unable to access camera. Please check permissions.");
            setScreen('CART');
        }
      }
    }, 100);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureAndIdentify = () => {
    if (!videoRef.current) return;
    setAnalyzingImage(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg');

    stopCamera(); 

    identifyProductFromImage(base64).then((result) => {
        setAnalyzingImage(false);
        if (result) {
            // Check if weight is provided (API future proofing) or infer it
            let finalWeight = result.weight_g;
            
            if (!finalWeight) {
                // Weight Inference Logic
                finalWeight = 500; // Default fallback
                const catLower = result.category.toLowerCase();
                const nameLower = result.name.toLowerCase();
                
                if (catLower.includes('dairy') || catLower.includes('milk') || catLower.includes('beverage') || nameLower.includes('water') || nameLower.includes('juice') || nameLower.includes('drink')) {
                    finalWeight = 1000;
                } else if (catLower.includes('snack') || catLower.includes('chip') || catLower.includes('candy') || nameLower.includes('bar') || nameLower.includes('chocolate')) {
                    finalWeight = 150;
                } else if (catLower.includes('bakery') || catLower.includes('bread') || nameLower.includes('bun') || nameLower.includes('bagel')) {
                    finalWeight = 450;
                } else if (catLower.includes('produce') || catLower.includes('fruit') || catLower.includes('veg')) {
                    finalWeight = 150 + Math.floor(Math.random() * 350);
                } else if (catLower.includes('meat') || catLower.includes('chicken') || catLower.includes('beef') || catLower.includes('fish')) {
                    finalWeight = 500 + Math.floor(Math.random() * 500);
                } else if (catLower.includes('pantry') || catLower.includes('can') || catLower.includes('jar') || catLower.includes('sauce')) {
                    finalWeight = 400;
                } else if (catLower.includes('cereal') || nameLower.includes('oats') || nameLower.includes('box')) {
                    finalWeight = 500;
                }
            }

            setScanResult({
                name: result.name,
                category: result.category,
                confidence: result.confidence || 0,
                image: base64,
                weight: finalWeight
            });
        } else {
            alert("Could not identify product. Try again.");
            startCamera();
        }
    });
  };

  const handleConfirmScan = () => {
    if (!scanResult) return;
    const newProduct = {
        id: `ai-${Date.now()}`,
        name: scanResult.name,
        category: scanResult.category,
        price: parseFloat((Math.random() * 450 + 50).toFixed(2)),
        image: scanResult.image,
        rfid_uid: `AI-${Math.random().toString(36).substring(7).toUpperCase()}`,
        weight_g: scanResult.weight || 500, // Ensure weight is passed to product object
        inStock: true, // AI found it, so it's in stock
        ingredients: ['Freshly Identified Product'],
        nutrition: {
             calories: 150 + Math.floor(Math.random() * 200),
             protein: '5g',
             carbs: '15g',
             fat: '8g'
        }
    };
    onAddProduct(newProduct);
    addToRecentlyViewed(newProduct);
    setScanResult(null);
    setScreen('CART');
  };

  const handleConfirmAndScanNext = () => {
    if (!scanResult) return;
    const newProduct = {
        id: `ai-${Date.now()}`,
        name: scanResult.name,
        category: scanResult.category,
        price: parseFloat((Math.random() * 450 + 50).toFixed(2)),
        image: scanResult.image,
        rfid_uid: `AI-${Math.random().toString(36).substring(7).toUpperCase()}`,
        weight_g: scanResult.weight || 500,
        inStock: true,
        ingredients: ['Freshly Identified Product'],
        nutrition: {
             calories: 150 + Math.floor(Math.random() * 200),
             protein: '5g',
             carbs: '15g',
             fat: '8g'
        }
    };
    onAddProduct(newProduct);
    addToRecentlyViewed(newProduct);
    setScanResult(null);
    startCamera();
  };

  const handleRetryScan = () => {
    setScanResult(null);
    startCamera();
  };

  const getConfidenceColor = (score: number) => {
    if (score === 1) return "text-indigo-600";
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getConfidenceBg = (score: number) => {
    if (score === 1) return "bg-indigo-500";
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // --- ORDER SUCCESS SCREEN ---
  if (screen === 'ORDER_SUCCESS') {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-white text-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                  <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
              <p className="text-gray-500 mb-8 max-w-xs">Your payment was successful and your order has been placed. Order ID: #{Math.floor(Math.random() * 100000)}</p>
              
              <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
                  <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                      <span className="text-gray-500 text-sm">Amount Paid</span>
                      <span className="font-bold text-gray-900">₹{(total * 1.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Delivery Estimate</span>
                      <span className="font-bold text-indigo-600">{deliveryEstimate}</span>
                  </div>
              </div>

              <div className="flex flex-col w-full max-w-xs gap-3">
                  <button 
                      onClick={() => setScreen('CART')}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                      Continue Shopping
                  </button>
                  <button 
                      onClick={() => setScreen('TRACK_ORDER')}
                      className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-100"
                  >
                      Track Order
                  </button>
              </div>
          </div>
      );
  }

  // --- TRACK ORDER SCREEN ---
  if (screen === 'TRACK_ORDER') {
      return (
          <div className="h-full bg-slate-50 relative flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-4 z-20 flex items-center gap-4 bg-gradient-to-b from-white via-white/80 to-transparent pb-8">
                  <button 
                      onClick={() => setScreen('CART')}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900"
                  >
                      <ArrowLeft size={20} />
                  </button>
                  <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Order #12345</p>
                      <p className="text-sm font-bold text-gray-900">Arriving in 12 mins</p>
                  </div>
              </div>

              {/* Map Background (Simulated) */}
              <div className="flex-1 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+000(77.5946,12.9716)/77.5946,12.9716,14,0,60/800x800?access_token=pk.mock')] bg-cover bg-center opacity-60 mix-blend-multiply"></div>
                  {/* Decorative Map Elements if image fails or for enhanced feel */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Route Line Animation */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <path d="M 180 550 C 220 450, 150 350, 200 250" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="10 5" className="animate-[dash_20s_linear_infinite]" />
                      <circle cx="180" cy="550" r="8" fill="#4f46e5" className="animate-ping" />
                      <circle cx="180" cy="550" r="4" fill="white" />
                  </svg>
                  
                  {/* Driver Marker */}
                  <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="relative">
                          <div className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-indigo-600 p-2 flex items-center justify-center animate-bounce">
                              <Bike size={24} className="text-indigo-600" />
                          </div>
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-600 rotate-45"></div>
                      </div>
                  </div>
              </div>

              {/* Bottom Sheet */}
              <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 z-20 animate-in slide-in-from-bottom-10">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                  
                  {/* Status Card */}
                  <div className="bg-indigo-50 rounded-2xl p-5 mb-6 border border-indigo-100 flex items-center justify-between">
                      <div>
                          <p className="text-indigo-900 font-bold text-lg mb-1">On the way</p>
                          <p className="text-indigo-600 text-sm">Your order has been picked up</p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 animate-pulse">
                          <Truck size={24} />
                      </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-6 pl-2 relative border-l-2 border-gray-100 ml-2 mb-8">
                      <div className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-gray-900">Order Placed</p>
                          <p className="text-xs text-gray-400">10:45 AM</p>
                      </div>
                      <div className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                          <p className="text-sm font-bold text-gray-900">Prepared & Packed</p>
                          <p className="text-xs text-gray-400">11:05 AM</p>
                      </div>
                      <div className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-4 border-indigo-100 shadow-sm animate-pulse"></div>
                          <p className="text-sm font-bold text-indigo-600">Out for Delivery</p>
                          <p className="text-xs text-gray-400">11:15 AM</p>
                      </div>
                      <div className="relative pl-6 opacity-40">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                          <p className="text-sm font-bold text-gray-900">Delivered</p>
                          <p className="text-xs text-gray-400">Est. 11:30 AM</p>
                      </div>
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80" alt="Driver" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Star size={12} className="text-yellow-400 fill-yellow-400" />
                              <span className="font-medium text-gray-700">4.9</span>
                              <span>•</span>
                              <span>Honda Activa (KA-05-JM-1234)</span>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                              <Phone size={20} />
                          </button>
                          <button className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors">
                              <MessageSquare size={20} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  // --- CHECKOUT SCREEN ---
  if (screen === 'CHECKOUT') {
    // ... (No changes needed in Checkout view logic as it uses cart items which already have fixed prices)
    return (
        <PullToRefresh onRefresh={handleRefresh} className="p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                 <button 
                    onClick={() => setScreen('CART')} 
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-label="Back to Cart"
                >
                    <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>

            <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-500"/> Shipping Address
                        </h3>
                        <button className="text-sm text-indigo-600 font-bold hover:text-indigo-700">Edit</button>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Store size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-sm">Home</p>
                            <p className="text-gray-500 text-sm mt-0.5">123 Innovation Drive, Tech Park</p>
                            <p className="text-gray-500 text-sm">Bangalore, KA 560100</p>
                        </div>
                    </div>
                </div>

                {/* Delivery Method */}
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Truck size={18} className="text-indigo-500"/> Delivery Method
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-indigo-600" />
                            <div>
                                <p className="font-bold text-indigo-900 text-sm">Standard Delivery</p>
                                <p className="text-indigo-700 text-xs mt-0.5">Arrives in {deliveryEstimate}</p>
                            </div>
                        </div>
                        <span className="font-bold text-indigo-700">Free</span>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard size={18} className="text-indigo-500"/> Payment Method
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2" role="radiogroup" aria-label="Select payment method">
                        <button 
                            onClick={() => setPaymentMethod('WALLET')}
                            className={`h-20 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'WALLET' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm ring-2 ring-blue-500 ring-offset-2' : 'border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50'}`}
                        >
                            <Wallet size={24} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase">Wallet</span>
                        </button>
                         <button 
                            onClick={() => setPaymentMethod('STRIPE')}
                            className={`h-20 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'STRIPE' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50'}`}
                        >
                            <span className="font-bold italic text-xl mb-1">S</span>
                             <span className="text-[10px] font-bold uppercase">Stripe</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('CARD')}
                            className={`h-20 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50'}`}
                        >
                            <CreditCard size={24} className="mb-2" />
                             <span className="text-[10px] font-bold uppercase">Card</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('BITCOIN')}
                            className={`h-20 border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${paymentMethod === 'BITCOIN' ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm ring-2 ring-orange-500 ring-offset-2' : 'border-gray-200 text-gray-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-gray-50'}`}
                        >
                            <Bitcoin size={24} className="mb-2" />
                             <span className="text-[10px] font-bold uppercase">Crypto</span>
                        </button>
                    </div>
                </div>

                {/* Order Summary Recap */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Receipt size={18} className="text-indigo-500"/> Order Total
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal ({cart.length} items)</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Tax (8%)</span>
                            <span>₹{(total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Delivery</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-indigo-600">₹{(total * 1.08).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                {/* Pay Button */}
                <button 
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.98] transition-all focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center gap-2 mb-8"
                >
                    {isProcessingPayment ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay ₹{(total * 1.08).toFixed(2)}
                            <ChevronRight size={20} />
                        </>
                    )}
                </button>
            </div>
        </PullToRefresh>
    );
  }

  // --- CAMERA OVERLAY SCREEN ---
  if (screen === 'SCAN_CAMERA') {
    return (
        <div className="h-full w-full bg-black relative flex flex-col">
            {scanResult && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
                        <img src={scanResult.image} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            {/* Confidence Meter or Verified Badge */}
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold uppercase text-gray-400">Detection Status</span>
                                {scanResult.confidence === 1 ? (
                                     <span className="text-lg font-bold text-indigo-600 flex items-center gap-1">
                                         <CheckCircle2 size={18} /> Verified
                                     </span>
                                ) : (
                                    <span className={`text-lg font-bold ${getConfidenceColor(scanResult.confidence)}`}>
                                        {Math.round(scanResult.confidence * 100)}%
                                    </span>
                                )}
                            </div>
                            
                            {scanResult.confidence < 1 && (
                                <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${getConfidenceBg(scanResult.confidence)}`} 
                                        style={{ width: `${scanResult.confidence * 100}%` }}
                                    ></div>
                                </div>
                            )}
                            
                            {scanResult.confidence === 1 && (
                                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-2 rounded-xl text-xs font-medium mb-6 flex items-center gap-2">
                                    <Scan size={14} />
                                    <span>Product matched via barcode database.</span>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{scanResult.name}</h3>
                            {/* Weight Display - Prominently displayed alongside name/details */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-gray-500 font-medium">{scanResult.category}</span>
                                <span className="text-gray-300">•</span>
                                <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                    {scanResult.weight}g
                                    <span className="text-[10px] font-normal text-gray-500 uppercase ml-1">Est</span>
                                </span>
                            </div>
                            
                            {scanResult.confidence < 0.7 && (
                                <div className="bg-orange-50 border border-orange-100 text-orange-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-3">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                <p>Confidence is low. Please verify this is the correct item before adding.</p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={handleRetryScan}
                                        className="py-3 px-4 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-200"
                                        aria-label="Retry scan"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleConfirmAndScanNext}
                                        className="py-3 px-4 rounded-xl bg-indigo-100 font-bold text-indigo-700 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-100"
                                        aria-label="Add this item and scan another"
                                    >
                                        Add & Scan
                                    </button>
                                </div>
                                <button 
                                    onClick={handleConfirmScan}
                                    className="w-full py-3 px-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
                                    aria-label="Add to cart"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ... Camera overlay UI ... */}
            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button 
                    onClick={() => { 
                        stopCamera();
                        setScreen('CART'); 
                    }} 
                    className="text-white p-3 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Close camera"
                >
                    <X size={24}/>
                </button>
                <span className="text-white font-medium text-xl tracking-tight">Scan Item</span>
                <div className="w-8"></div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gray-900">
                {analyzingImage ? (
                    <div className="text-white text-center z-30">
                        <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-8"></div>
                        <p className="text-xl font-medium animate-pulse">Analyzing with Gemini...</p>
                    </div>
                ) : (
                    <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90" />
                        
                        {/* Camera Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <style>{`
                                @keyframes scan { 0% { top: 0%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
                                .scan-line { animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                            `}</style>

                            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] overflow-hidden bg-white/5">
                                {/* Grid Background */}
                                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                
                                {/* Scan Line */}
                                <div className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,1)] scan-line top-0 z-10"></div>

                                {/* Corner Brackets */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl shadow-sm"></div>
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl shadow-sm"></div>
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl shadow-sm"></div>
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl shadow-sm"></div>

                                {/* Center Reticle */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <div className="w-1 h-4 bg-white/80"></div>
                                    <div className="h-1 w-4 bg-white/80 absolute"></div>
                                    <div className="absolute w-16 h-16 border border-white/20 rounded-full animate-ping"></div>
                                </div>
                            </div>

                            <div className="mt-8 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full flex items-center space-x-2">
                                {scannerSupported ? <QrCode size={16} className="text-indigo-400" /> : <Scan size={16} className="text-indigo-400" />}
                                <span className="text-white/90 text-sm font-medium">
                                    {scannerSupported ? "Scan Barcode or Capture" : "Position item in frame"}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {!analyzingImage && (
                <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
                    <button 
                        onClick={captureAndIdentify}
                        className="group w-24 h-24 bg-white rounded-full border-4 border-gray-300 shadow-xl flex items-center justify-center transition-transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500"
                        aria-label="Capture photo for identification"
                    >
                        <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center group-hover:scale-90 transition-transform">
                             <div className="w-16 h-16 bg-gray-100 rounded-full"></div>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
  }

  if (screen === 'SEARCH') {
    return (
        <PullToRefresh onRefresh={handleRefresh} className="p-8">
            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    currentPrice={getPrice(selectedProduct.id)}
                    trend={getTrend(selectedProduct.id)}
                    onClose={() => setSelectedProduct(null)}
                    onAdd={(p) => { onAddProduct(p); setScreen('CART'); }}
                    rating={ratings[selectedProduct.id] || 0}
                    onRate={(r) => handleRate(selectedProduct.id, r)}
                />
            )}
            <button 
                onClick={() => setScreen('CART')} 
                className="mb-4 text-indigo-600 font-bold flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label="Back to Cart"
            >
                <ChevronLeft size={24} /> Back to Cart
            </button>
            
            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <History size={18} className="text-indigo-500"/> Recently Viewed
                        </h3>
                        <button 
                            onClick={() => {
                                setRecentlyViewed([]);
                                localStorage.removeItem('smartcart_recent');
                            }}
                            className="text-xs text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                        >
                            Clear
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                        {recentlyViewed.map(storedProduct => {
                            // Hydrate from mock if possible to get latest stock status
                            const p = MOCK_PRODUCTS.find(mp => mp.id === storedProduct.id) || storedProduct;
                            const inStock = p.inStock !== false;
                            const price = getPrice(p.id);
                            
                            return (
                                <div 
                                    key={`recent-${p.id}`} 
                                    className={`min-w-[160px] w-[160px] snap-start bg-white p-3 rounded-xl shadow-sm border cursor-pointer relative group transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                        inStock 
                                        ? 'border-gray-100 hover:border-indigo-500 hover:shadow-md' 
                                        : 'border-red-100 opacity-80'
                                    }`} 
                                    onClick={() => { setSelectedProduct(p); addToRecentlyViewed(p); }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View recently viewed item ${p.name}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setSelectedProduct(p);
                                            addToRecentlyViewed(p);
                                        }
                                    }}
                                >
                                    {/* Stock Badge */}
                                    <div className={`absolute top-0 left-0 z-20 px-2 py-0.5 rounded-br-lg rounded-tl-xl text-[9px] font-bold uppercase tracking-wide text-white shadow-sm ${
                                        inStock ? 'hidden' : 'bg-red-500'
                                    }`}>
                                        OOS
                                    </div>
                                    
                                    <img src={getProductImage(p)} className={`w-full h-24 object-cover rounded-lg mb-2 ${!inStock ? 'grayscale opacity-60' : ''}`} alt={p.name} />
                                    <h3 className="font-bold mb-1 text-sm truncate">{p.name}</h3>
                                    <div className="mt-auto">
                                        <p className="text-indigo-600 font-medium text-sm">₹{price.toFixed(2)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold mb-4">Product Catalog</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MOCK_PRODUCTS.map(p => {
                    const inStock = p.inStock !== false; // Default true if undefined
                    const currentPrice = getPrice(p.id);
                    const trend = getTrend(p.id);

                    return (
                        <div 
                            key={p.id} 
                            className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer relative group transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                inStock 
                                ? 'border-gray-100 hover:border-indigo-500 hover:shadow-md' 
                                : 'border-red-100 opacity-80'
                            }`} 
                            onClick={() => {
                                setSelectedProduct(p);
                                addToRecentlyViewed(p);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`View details for ${p.name}, price ${currentPrice}, ${inStock ? 'In stock' : 'Out of stock'}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedProduct(p);
                                    addToRecentlyViewed(p);
                                }
                            }}
                        >
                            {/* Stock Badge */}
                            <div className={`absolute top-0 left-0 z-20 px-2 py-1 rounded-br-lg rounded-tl-xl text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
                                inStock ? 'hidden' : 'bg-red-500'
                            }`}>
                                Out of Stock
                            </div>

                            {/* TOOLTIP START */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-max min-w-[120px] bg-gray-900/95 backdrop-blur-sm text-white text-[10px] p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 shadow-xl flex flex-col items-center border border-white/10 transform scale-95 group-hover:scale-100 group-hover:-translate-y-1" aria-hidden="true">
                                <div className="flex items-center gap-1.5 mb-1 w-full justify-between border-b border-white/10 pb-1">
                                    <span className="text-gray-400 font-mono">UID</span>
                                    <span className="font-mono text-xs">{p.rfid_uid}</span>
                                </div>
                                <div className="flex items-center gap-1.5 w-full justify-between">
                                    <span className="text-gray-400">Weight</span>
                                    <span className="font-bold">{p.weight_g}g</span>
                                </div>
                                {/* Arrow */}
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
                            </div>
                            {/* TOOLTIP END */}

                            {/* Favorite Button (Catalog) */}
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    toggleFavorite(p.id); 
                                }}
                                className="absolute top-3 right-3 z-10 p-2.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label={favorites.includes(p.id) ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart size={18} className={favorites.includes(p.id) ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-red-400"} />
                            </button>

                            <img src={getProductImage(p)} className={`w-full h-32 object-cover rounded-lg mb-2 ${!inStock ? 'grayscale opacity-60' : ''}`} alt={p.name} />
                            <h3 className="font-bold mb-1">{p.name}</h3>
                            <div className="mt-auto">
                                <div className="flex items-center gap-2">
                                    <p className="text-indigo-600 font-medium">₹{currentPrice.toFixed(2)}</p>
                                    {trend === 'up' && <TrendingUp size={12} className="text-red-500" />}
                                    {trend === 'down' && <TrendingDown size={12} className="text-green-500" />}
                                </div>
                                <div className="flex justify-between items-center mt-1" onClick={e => e.stopPropagation()}>
                                    <p className="text-xs text-gray-500 font-medium">{p.weight_g}g</p>
                                    <StarRating rating={ratings[p.id] || 0} onRate={(r) => handleRate(p.id, r)} interactive size={12} className="p-1" />
                                </div>
                            </div>
                            {/* ADD TO CART BUTTON */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(inStock) {
                                        onAddProduct({ ...p, price: currentPrice });
                                        setScreen('CART');
                                    }
                                }}
                                disabled={!inStock}
                                className={`mt-3 w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    inStock 
                                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border-indigo-100' 
                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                }`}
                                aria-label={inStock ? `Add ${p.name} to cart` : `${p.name} out of stock`}
                            >
                                {inStock ? (
                                    <>
                                        <Plus size={16} /> Add
                                    </>
                                ) : (
                                    <>
                                        <PackageX size={16} /> OOS
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </PullToRefresh>
    )
  }

  if (screen === 'FAVORITES') {
    // Combine mock products with any special items currently in cart that are favorited
    // This allows identifying AI-added items that are favorited as long as they are in the cart
    const allKnownProducts = [...MOCK_PRODUCTS, ...cart];
    // Filter duplicates by ID
    const uniqueProducts = Array.from(new Map(allKnownProducts.map(item => [item.id, item])).values());
    const favProducts = uniqueProducts.filter(p => favorites.includes(p.id));

    return (
        <PullToRefresh onRefresh={handleRefresh} className="p-8">
            {selectedProduct && (
                <ProductDetailModal 
                    product={selectedProduct} 
                    currentPrice={getPrice(selectedProduct.id)}
                    trend={getTrend(selectedProduct.id)}
                    onClose={() => setSelectedProduct(null)}
                    onAdd={(p) => { onAddProduct(p); setScreen('CART'); }}
                    rating={ratings[selectedProduct.id] || 0}
                    onRate={(r) => handleRate(selectedProduct.id, r)}
                />
            )}
            <button 
                onClick={() => setScreen('CART')} 
                className="mb-4 text-indigo-600 font-bold flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label="Back to Cart"
            >
                <ChevronLeft size={24} /> Back to Cart
            </button>
            <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
            
            {favProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Heart size={64} className="mb-4 opacity-20 text-indigo-500" />
                    <p className="text-lg font-medium">No favorites yet</p>
                    <button onClick={() => setScreen('SEARCH')} className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Browse Catalog
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {favProducts.map(p => {
                        const inStock = p.inStock !== false;
                        const currentPrice = getPrice(p.id);
                        const trend = getTrend(p.id);
                        
                        return (
                        <div 
                            key={p.id} 
                            className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer relative group transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                inStock 
                                ? 'border-gray-100 hover:border-indigo-500 hover:shadow-md' 
                                : 'border-red-100 opacity-80'
                            }`}
                            onClick={() => { 
                                setSelectedProduct(p);
                                addToRecentlyViewed(p);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${p.name}, click to add to cart`}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && inStock) {
                                    setSelectedProduct(p);
                                    addToRecentlyViewed(p);
                                }
                            }}
                        >
                            {/* Stock Badge */}
                            <div className={`absolute top-0 left-0 z-20 px-2 py-1 rounded-br-lg rounded-tl-xl text-[10px] font-bold uppercase tracking-wide text-white shadow-sm ${
                                inStock ? 'hidden' : 'bg-red-500'
                            }`}>
                                Out of Stock
                            </div>

                            {/* Favorite Button */}
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    toggleFavorite(p.id); 
                                }}
                                className="absolute top-3 right-3 z-10 p-2.5 bg-white rounded-full shadow-md hover:scale-110 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Remove from favorites"
                            >
                                <Heart size={18} className="fill-red-500 text-red-500" />
                            </button>

                            <img src={getProductImage(p)} className={`w-full h-32 object-cover rounded-lg mb-2 ${!inStock ? 'grayscale opacity-60' : ''}`} alt={p.name} />
                            <h3 className="font-bold mb-1">{p.name}</h3>
                            <div className="mt-auto">
                                <div className="flex items-center gap-2">
                                    <p className="text-indigo-600 font-medium">₹{currentPrice.toFixed(2)}</p>
                                    {trend === 'up' && <TrendingUp size={12} className="text-red-500" />}
                                    {trend === 'down' && <TrendingDown size={12} className="text-green-500" />}
                                </div>
                                <div className="flex justify-between items-center mt-1" onClick={e => e.stopPropagation()}>
                                    <p className="text-xs text-gray-500 font-medium">{p.weight_g}g</p>
                                    <StarRating rating={ratings[p.id] || 0} onRate={(r) => handleRate(p.id, r)} interactive size={12} className="p-1" />
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}
        </PullToRefresh>
    )
  }

  // --- MAIN DESKTOP UI (CART VIEW) ---
  return (
    <div className="min-h-full bg-[#F3F4F6] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white px-8 py-5 shadow-sm flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Store size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">AC Store</span>
        </div>

        <div className="hidden md:flex items-center gap-12 text-sm font-medium text-gray-500">
            <a href="#" className="text-gray-900 font-semibold focus:outline-none focus:text-indigo-600">Home</a>
            <a href="#" className="hover:text-indigo-600 transition-colors focus:outline-none focus:text-indigo-600" onClick={() => setScreen('SEARCH')}>Categories</a>
            <a href="#" className="hover:text-indigo-600 transition-colors focus:outline-none focus:text-indigo-600">About Us</a>
            <a href="#" className="hover:text-indigo-600 transition-colors focus:outline-none focus:text-indigo-600">Contact Us</a>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={() => setScreen('CART')}
                className={`relative p-3 hover:text-indigo-600 transition-colors rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${screen === 'CART' ? 'text-indigo-600' : 'text-gray-500'}`}
                title="Cart"
                aria-label={`Shopping cart, ${cart.length} items`}
            >
                <ShoppingCart size={22} />
                {cart.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            
            <button 
                onClick={() => setScreen('FAVORITES')}
                className={`relative p-3 hover:text-indigo-600 transition-colors text-gray-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                title="My Favorites"
                aria-label="View favorites"
            >
                <Heart size={22} className={favorites.length > 0 ? "fill-red-50 text-red-500/80" : ""} />
            </button>

            <button 
                onClick={() => setScreen('SEARCH')}
                className={`p-3 hover:text-indigo-600 transition-colors text-gray-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                title="Search Products"
                aria-label="Search products"
            >
                <Search size={22} />
            </button>
            
            <button 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                aria-label="Go to My Dashboard"
            >
                My Dashboard
            </button>
        </div>
      </nav>

      <PullToRefresh onRefresh={handleRefresh} className="flex-1 max-w-[1400px] w-full mx-auto">
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    <div className="flex gap-2">
                        <button onClick={startCamera} className="text-sm flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-indigo-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <Camera size={18}/> Scan Item
                        </button>
                        <button onClick={onSimulateScan} className="text-sm flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-indigo-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500">
                             <Scan size={18}/> Sim Scan
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                     {/* Table Header */}
                     <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 text-sm font-medium text-gray-500 bg-gray-50/50">
                        <div className="col-span-6">Product</div>
                        <div className="col-span-3 text-center">Quantity</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-1"></div>
                     </div>

                     <div className="p-6">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <ShoppingCart size={64} strokeWidth={1} className="mb-4 opacity-50"/>
                                <p className="text-lg font-medium">Your cart is empty</p>
                                <button onClick={() => setScreen('SEARCH')} className="mt-4 text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1">Start Browsing</button>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <SwipeableCartItem 
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={onUpdateQuantity}
                                    onRemove={onRemoveItem}
                                    isFavorite={favorites.includes(item.id)}
                                    onToggleFavorite={toggleFavorite}
                                    rating={ratings[item.id] || 0}
                                    onRate={(r) => handleRate(item.id, r)}
                                />
                            ))
                        )}
                     </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button 
                        onClick={() => setScreen('SEARCH')} 
                        className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                        Back
                    </button>
                    {cart.length > 0 && (
                        <button 
                            onClick={() => onClearCart()}
                            className="bg-red-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Order Summary</h3>
                    <div className="space-y-4 text-gray-500 text-sm font-medium">
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span className="text-gray-900">₹0.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span className="text-gray-900">₹0.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1"><Clock size={14} className="text-indigo-500" /> Est. Delivery</span>
                            <span className="text-indigo-600 font-bold">{deliveryEstimate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (8%)</span>
                            <span className="text-gray-900">₹{(total * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                            <span className="text-base">Total</span>
                            <span className="text-2xl font-bold text-gray-900">₹{(total * 1.08).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Chef Suggestion */}
                {cart.length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-6 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ChefHat size={64} className="text-orange-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-orange-800">
                                <ChefHat size={20} />
                                <span className="font-bold text-sm uppercase tracking-wide">AI Chef Assistant</span>
                            </div>
                            
                            {!recipe ? (
                                <div>
                                    <p className="text-orange-700/80 text-xs mb-3 font-medium">Get a creative recipe idea based on your cart items.</p>
                                    <button 
                                        onClick={handleGetRecipe} 
                                        disabled={loadingRecipe} 
                                        className="w-full bg-white text-orange-600 py-3 rounded-xl font-bold shadow-sm border border-orange-100 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    >
                                        {loadingRecipe ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Thinking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Suggest a Recipe</span>
                                                <ChefHat size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-orange-100/50">
                                    <p className="text-sm text-orange-900 italic font-medium leading-relaxed">"{recipe}"</p>
                                    <button onClick={() => setRecipe(null)} className="text-[10px] text-orange-500 font-bold mt-2 uppercase hover:text-orange-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-orange-200 rounded p-1">
                                        <Plus size={10} /> Try Another
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Payment Method - Preview Only */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 opacity-60 pointer-events-none grayscale">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg">Payment Method</h3>
                    <div className="grid grid-cols-4 gap-3 mb-8">
                        <div className="h-12 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            <Wallet size={20} />
                        </div>
                         <div className="h-12 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            <span className="font-bold italic">S</span>
                        </div>
                        <div className="h-12 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            <CreditCard size={20} />
                        </div>
                        <div className="h-12 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            <Bitcoin size={20} />
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setScreen('CHECKOUT')}
                    disabled={cart.length === 0}
                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                        cart.length > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-[0.98]' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                >
                    Check Out
                </button>
            </div>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default MobileView;