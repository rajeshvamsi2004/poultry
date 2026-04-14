import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Shastra = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        API.get('/shastra/daily')
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, []);

    if (!data) return <div className="p-10 text-white animate-pulse uppercase tracking-widest text-xs">Syncing with Stars...</div>;

    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-6 pb-40">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-none">కుక్కుట <br/> శాస్త్రం</h1>
                    <p className="text-[#FF7D44] text-[10px] font-black tracking-widest mt-2 uppercase">{data.date}</p>
                </div>
                <div className="text-right">
                    <span className="bg-orange-500/10 text-[#FF7D44] border border-orange-500/20 px-3 py-1 rounded text-[9px] font-bold block mb-1">
                        {data.paksha}
                    </span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded text-[9px] font-bold block">
                        {data.nakshatra}
                    </span>
                </div>
            </div>

            {/* Strategy Card */}
            <div className="bg-gradient-to-br from-[#1C1F26] to-[#14171c] p-8 rounded-[2.5rem] border border-white/5 mb-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl italic font-black">BAAZ</div>
                <p className="text-[#FF7D44] text-[10px] font-black tracking-[0.3em] mb-4 uppercase">Strategy of the Day</p>
                <p className="text-2xl font-bold leading-relaxed italic text-white/90">
                    "{data.strategy.split(': ')[1].split(' (')[0]}"
                </p>
                <p className="text-xs text-gray-500 mt-4 leading-relaxed font-medium">
                    {data.strategy.split('(')[1].replace(')', '')}
                </p>
            </div>

            {/* The Timing Wheels Grid */}
            <h2 className="text-gray-600 text-[10px] font-black tracking-[0.3em] mb-6 uppercase text-center italic">Muhurtam Quarters</h2>
            
            <div className="grid grid-cols-2 gap-6">
                {data.timings.map((slot) => (
                    <div key={slot.id} className="bg-[#1C1F26] p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center group hover:border-[#FF7D44]/30 transition-all">
                        
                        {/* Circular Progress Wheel */}
                        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                            <svg className="w-full h-full -rotate-90">
                                <circle 
                                    cx="48" cy="48" r="44" 
                                    stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none"
                                />
                                <circle 
                                    cx="48" cy="48" r="44" 
                                    stroke={slot.color} strokeWidth="4" fill="none"
                                    strokeDasharray="276" strokeDashoffset="70"
                                    className="drop-shadow-[0_0_8px_rgba(255,125,68,0.4)]"
                                />
                            </svg>
                            <span className="absolute text-xs font-black tracking-tighter">{slot.time.split(' - ')[0]}</span>
                        </div>

                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Winner Breed</p>
                        <p className="text-sm font-black text-white uppercase tracking-tight italic">{slot.winner}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Alert */}
            <div className="mt-10 p-5 bg-blue-900/10 border border-blue-500/20 rounded-3xl">
                <p className="text-[10px] text-blue-400 font-bold leading-relaxed text-center">
                    Note: Shastra results depend on localized star charts. Cross-check with your local breeder for exact time offsets.
                </p>
            </div>
        </div>
    );
};

export default Shastra;