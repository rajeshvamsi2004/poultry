import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Auth = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', otp: '', password: '', firstName: '', lastName: '' });
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if(!formData.email) return alert("Enter email");
        setLoading(true);
        try {
            await API.post('/auth/send-otp', { email: formData.email });
            setStep(2);
        } catch (err) {
    console.log("FULL ERROR:", err);
    alert(err.response?.data?.error || "Error sending code");
}
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const res = await API.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
            if (res.data.isNewUser) {
                setStep(3);
            } else {
                // EXISTING USER: Save token and go to market immediately
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/market');
            }
        } catch (err) { alert("Invalid Code"); }
        setLoading(false);
    };

    const handleFinalSignup = async () => {
        setLoading(true);
        try {
            const res = await API.post('/auth/complete-signup', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/market');
        } catch (err) { alert("Signup failed"); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#1C1F26] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                
                {step === 1 && (
                    <div className="text-center animate-fadeIn">
                        <div className="bg-[#FF7D44] w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">📧</div>
                        <h1 className="text-3xl font-black text-white mb-2">COCKBAZAR</h1>
                        <p className="text-gray-400 text-sm mb-10">Premium Editorial Marketplace</p>
                        <input 
                            type="email" placeholder="example@gmail.com" 
                            className="w-full bg-[#2D3139] p-5 rounded-2xl text-white mb-6 outline-none border border-white/5 focus:border-[#FF7D44] text-center"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <button type="button" onClick={handleSendOTP} disabled={loading} className="w-full bg-[#FF7D44] text-white py-5 rounded-full font-bold uppercase tracking-widest">
                            {loading ? "Sending..." : "Get OTP →"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slideRight">
                        <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                        <p className="text-gray-400 text-sm mb-8">Code sent to {formData.email}</p>
                        <input 
                            type="text" placeholder="Enter 6-digit Code" maxLength="6"
                            className="w-full bg-[#2D3139] p-5 rounded-2xl text-white mb-6 outline-none border border-white/5 text-center tracking-[10px] text-2xl font-bold"
                            onChange={(e) => setFormData({...formData, otp: e.target.value})}
                        />
                        <button type="button" onClick={handleVerifyOTP} disabled={loading} className="w-full bg-[#FF7D44] text-white py-5 rounded-full font-bold uppercase tracking-widest">
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-slideRight">
                        <h2 className="text-2xl font-bold text-white mb-8">Set Your Password</h2>
                        <input 
                            type="password" placeholder="Create Password" 
                            className="w-full bg-[#2D3139] p-5 rounded-2xl text-white mb-4 outline-none border border-white/5"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button type="button" onClick={() => setStep(4)} className="w-full bg-[#FF7D44] text-white py-5 rounded-full font-bold uppercase tracking-widest">Continue</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-slideRight">
                        <h2 className="text-2xl font-bold text-white mb-8">Final Details</h2>
                        <div className="space-y-4 mb-8">
                            <input type="text" placeholder="First Name" className="w-full bg-[#2D3139] p-5 rounded-2xl text-white outline-none border border-white/5" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            <input type="text" placeholder="Last Name" className="w-full bg-[#2D3139] p-5 rounded-2xl text-white outline-none border border-white/5" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                        <button type="button" onClick={handleFinalSignup} disabled={loading} className="w-full bg-[#FF7D44] text-white py-5 rounded-full font-bold uppercase tracking-widest">
                            Complete Signup
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
