import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Marketplace = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeBreed, setActiveBreed] = useState('All Breeds');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const breeds = ["All Breeds", "Aseel", "Kadaknath", "Rhode Island Red", "Silkie", "Leghorn"];

    useEffect(() => {
        const loadListings = async () => {
            setLoading(true);
            try {
                const res = await API.get('/listings', {
                    params: {
                        breed: activeBreed === 'All Breeds' ? '' : activeBreed,
                        search: searchTerm
                    }
                });
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load listings");
            } finally {
                setLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            loadListings();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [activeBreed, searchTerm]);

    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-6 pb-32">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-[#FF7D44] font-black text-xl tracking-tighter italic cursor-pointer" onClick={() => navigate('/market')}>
                    COCKBAZAR
                </h1>
                <div className="flex gap-4">
                    <div onClick={() => navigate('/profile')} className="w-10 h-10 bg-[#1C1F26] rounded-full flex items-center justify-center border border-white/5 overflow-hidden cursor-pointer hover:scale-110 transition-transform">
                        <img src={`https://ui-avatars.com/api/?name=${user.firstName || 'User'}&background=FF7D44&color=fff`} alt="profile" />
                    </div>
                </div>
            </header>

            {/* Search Input */}
            <div className="relative mb-8 group">
                <input 
                    type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search breed or location..." 
                    className="w-full bg-[#1C1F26] py-4 pl-12 pr-6 rounded-2xl outline-none border border-white/5 focus:border-[#FF7D44] transition-all"
                />
                <span className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#FF7D44]">🔍</span>
            </div>

            <h2 className="text-[#FF7D44] text-[10px] font-black tracking-[0.2em] mb-2 uppercase">Premium Selection</h2>
            <h1 className="text-4xl font-bold mb-8 leading-tight">The Midnight <br /> Marketplace</h1>

            {/* Breed Filters */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
                {breeds.map(b => (
                    <button 
                        key={b} onClick={() => setActiveBreed(b)}
                        className={`px-6 py-2.5 rounded-full whitespace-nowrap text-xs font-bold transition-all ${activeBreed === b ? 'bg-[#FF7D44] text-white shadow-lg shadow-orange-500/20' : 'bg-[#1C1F26] text-gray-400 border border-white/5'}`}
                    >
                        {b}
                    </button>
                ))}
            </div>

            {/* Product List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-[#FF7D44] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Entering the bazaar...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map(p => (
                        <div key={p._id} className="bg-[#1C1F26] rounded-[2.5rem] overflow-hidden border border-white/5 group animate-fadeIn transition-all hover:border-[#FF7D44]/30">
                            
                            {/* --- FIXED IMAGE CONTAINER --- */}
                            <div className="relative h-64 bg-[#14171c] flex items-center justify-center p-4">
                                <img 
                                    src={p.images[0] || 'https://via.placeholder.com/400x300'} 
                                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                                    alt={p.name} 
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase text-white tracking-widest">
                                    {p.breed}
                                </div>
                                <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-xs">🤍</button>
                            </div>
                            {/* --- END IMAGE CONTAINER --- */}

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold truncate pr-2 uppercase tracking-tighter">{p.name}</h3>
                                    <p className="text-[#FF7D44] font-black text-xl">₹{p.price.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2 mb-6">
                                    <span className="text-[9px] font-black bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-md uppercase tracking-tighter">
                                        {p.age} Months
                                    </span>
                                    <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-md uppercase tracking-tighter">
                                        📍 {p.location}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setSelectedProduct(p)}
                                    className="w-full bg-[#FF7D44] py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-orange-500/10 active:scale-95 transition-all"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#1C1F26] rounded-[3rem] border border-dashed border-white/5">
                    <p className="text-gray-500 italic">No listings found in the bazaar.</p>
                </div>
            )}

            {/* Modal */}
            {selectedProduct && (
                <ProductCard product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            )}
        </div>
    );
};

export default Marketplace;