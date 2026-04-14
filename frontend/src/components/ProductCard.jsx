import React from 'react';

const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#1C1F26] w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden border border-white/10 animate-slide-up">
                
                {/* --- FULL IMAGE VIEW --- */}
                <div className="relative h-96 bg-[#14171c] flex items-center justify-center p-6">
                    <img 
                        src={product.images[0]} 
                        className="max-w-full max-h-full object-contain" 
                        alt={product.name} 
                    />
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 bg-black/50 w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-md"
                    >
                        ✕
                    </button>
                    <div className="absolute bottom-6 left-6 bg-[#FF7D44] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        {product.breed}
                    </div>
                </div>
                {/* --- END IMAGE VIEW --- */}

                <div className="p-8 pb-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">{product.name}</h2>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">📍 {product.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#FF7D44] text-3xl font-black italic">₹{product.price.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-[#2D3139]/40 p-5 rounded-3xl border border-white/5">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Age Detail</p>
                            <p className="text-white font-bold">{product.age} Months Old</p>
                        </div>
                        <div className="bg-[#2D3139]/40 p-5 rounded-3xl border border-white/5">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Status</p>
                            <p className="text-green-500 font-bold">Vaccinated</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* CALL SELLER ACTION */}
                        <a 
                            href={`tel:${product.sellerPhone}`}
                            className="flex-1 bg-[#FF7D44] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                        >
                            <span>📞</span> Call Seller
                        </a>
                        <button className="bg-[#2D3139] text-white px-6 rounded-2xl border border-white/5 hover:bg-[#3d424d] transition-colors">
                            💬
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;