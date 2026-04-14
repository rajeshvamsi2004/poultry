import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'BUY', icon: '🛒', path: '/market' },
        { label: 'SELL', icon: '📸', path: '/sell' },
        { label: 'HEALTH', icon: '🩺', path: '/health' },
        { label: 'SHASTRA', icon: '📜', path: '/shastra' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F1115]/90 backdrop-blur-xl border-t border-white/5 px-8 py-4 flex justify-between items-center z-[100]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <button 
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className="flex flex-col items-center gap-1.5 transition-all"
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${isActive ? 'bg-[#FF7D44] text-white scale-110 shadow-lg shadow-orange-500/40' : 'bg-[#1C1F26] text-gray-500 border border-white/5'}`}>
                            {item.icon}
                        </div>
                        <span className={`text-[10px] font-black tracking-tighter ${isActive ? 'text-[#FF7D44]' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;