import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Profile = () => {
    const [myAds, setMyAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Get User Data from LocalStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        try {
            const res = await API.get('/listings/my-ads');
            setMyAds(res.data);
        } catch (err) {
            console.error("Error fetching your ads");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await API.delete(`/listings/${id}`);
                setMyAds(myAds.filter(ad => ad._id !== id));
            } catch (err) {
                alert("Failed to delete ad");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-6 pb-32 font-sans">
            
            {/* --- TOP PROFILE HEADER --- */}
            <div className="flex flex-col items-center py-12 animate-fadeIn">
                {/* Large Avatar with Initial */}
                <div className="w-28 h-28 bg-gradient-to-br from-[#FF7D44] to-orange-700 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl shadow-orange-500/20 border-4 border-[#1C1F26]">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>

                {/* USER NAME AT TOP */}
                <h1 className="text-3xl font-black mt-6 uppercase tracking-tighter italic">
                    {user.firstName} {user.lastName}
                </h1>
                
                <p className="text-gray-500 text-sm font-bold tracking-widest mt-1 opacity-60">
                    {user.email || user.phone}
                </p>

                <div className="flex gap-4 mt-8">
                    <button 
                        onClick={() => navigate('/sell')}
                        className="bg-[#FF7D44] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                        Create New Ad
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* --- MY ADS SECTION --- */}
            <div className="mt-6">
                <h2 className="text-[#FF7D44] text-[10px] font-black tracking-[0.3em] mb-6 uppercase border-b border-white/5 pb-4">
                    My Active Listings ({myAds.length})
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-6 h-6 border-2 border-[#FF7D44] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : myAds.length > 0 ? (
                    <div className="space-y-4">
                        {myAds.map(ad => (
                            <div key={ad._id} className="bg-[#1C1F26] p-4 rounded-[2rem] border border-white/5 flex items-center gap-5 group animate-slideRight">
                                {/* Ad Image */}
                                <div className="w-20 h-20 bg-[#14171c] rounded-2xl overflow-hidden flex items-center justify-center p-1">
                                    <img 
                                        src={ad.images[0] || 'https://via.placeholder.com/150'} 
                                        className="w-full h-full object-contain rounded-xl" 
                                        alt="" 
                                    />
                                </div>

                                {/* Ad Info */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-white text-sm uppercase tracking-tight">{ad.name}</h3>
                                    <p className="text-[#FF7D44] font-black text-lg">₹{ad.price.toLocaleString()}</p>
                                    <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{ad.breed}</p>
                                </div>

                                {/* Delete Button */}
                                <button 
                                    onClick={() => handleDelete(ad._id)}
                                    className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-[#1C1F26] rounded-[3rem] border border-dashed border-white/5">
                        <p className="text-gray-600 text-sm italic">You haven't posted any birds yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;