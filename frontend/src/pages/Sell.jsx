import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Sell = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]); // Stores Base64 strings
    const [formData, setFormData] = useState({
        name: '',
        breed: 'Aseel (Purebred)',
        age: '',
        location: '',
        price: '',
        sellerPhone: '',
    });

    // Handle Image Selection and conversion to Base64
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            // Add the new Base64 string to the images array
            setImages((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = {
            ...formData,
            images: images, // Array of Base64 strings
            seller: JSON.parse(localStorage.getItem('user')).id // Link to logged-in user
        };

        await API.post('/listings/create', payload);
        alert("Ad Posted Successfully!");
        navigate('/market');
    } catch (err) {
        alert("Error posting ad");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-6 pb-32 font-sans">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Present your finest poultry to the Midnight Marketplace. High-quality images and accurate details ensure premium visibility.
                </p>
            </header>

            {/* Image Upload Grid */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                {/* Main Image Slot */}
                <div className="col-span-2 h-52 bg-[#1C1F26] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group">
                    {images[0] ? (
                        <img src={images[0]} className="w-full h-full object-cover" alt="Main" />
                    ) : (
                        <div className="text-center">
                            <span className="text-2xl mb-2 block">📸</span>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4">Upload Main Showcase Image</p>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleImageUpload}
                    />
                </div>

                {/* Secondary Image Slots */}
                <div className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-[100px] bg-[#1C1F26] border border-dashed border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                            {images[i] ? (
                                <img src={images[i]} className="w-full h-full object-cover" alt="Sub" />
                            ) : (
                                <span className="text-gray-600 text-xl">+</span>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageUpload}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Ads Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Sultan of Sylhet" 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44] transition-all"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    {/* Breed Select */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Breed</label>
                        <select 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44] appearance-none"
                            onChange={(e) => setFormData({...formData, breed: e.target.value})}
                        >
                            <option className="bg-[#1C1F26]">Aseel (Purebred)</option>
                            <option className="bg-[#1C1F26]">Kadaknath</option>
                            <option className="bg-[#1C1F26]">Brahma</option>
                            <option className="bg-[#1C1F26]">Silkie</option>
                        </select>
                    </div>

                    {/* Age Input */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Age (Months)</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. 14" 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44]"
                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                    </div>

                    {/* Location Input */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Location</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Dhaka, Bangladesh" 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44]"
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Asking Price (৳)</label>
                        <input 
                            required
                            type="number" 
                            placeholder="15,000" 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44]"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-2 block">Contact Phone</label>
                        <input 
                            required
                            type="tel" 
                            placeholder="+880 1XXX-XXXXXX" 
                            className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#FF7D44]"
                            onChange={(e) => setFormData({...formData, sellerPhone: e.target.value})}
                        />
                    </div>
                </div>

                {/* Attributes (Visual only as per screenshot) */}
                <div className="py-4">
                    <label className="text-[10px] text-[#FF7D44] font-black uppercase tracking-[0.2em] mb-4 block">Tags & Attributes</label>
                    <div className="flex flex-wrap gap-2">
                        {['Champion Bloodline', 'Vaccinated', 'Negotiable', 'Home Bred'].map(tag => (
                            <span key={tag} className="text-[10px] px-4 py-2 rounded-full border border-white/10 bg-[#1C1F26] text-gray-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Footer and Button */}
                <div className="pt-10">
                    <p className="text-[10px] text-gray-600 mb-6 italic">
                        By publishing, you agree to our Editorial Marketplace guidelines for authentic listings.
                    </p>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF7D44] text-white py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:bg-gray-700"
                    >
                        {loading ? "Publishing..." : "Publish Advertisement"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Sell;