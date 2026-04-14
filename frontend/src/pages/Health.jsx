import React, { useState, useRef, useEffect } from 'react';
import API from '../services/api';

const Health = () => {
    const [inputText, setInputText] = useState("");
    const [selectedImg, setSelectedImg] = useState(null); // To store Base64 preview
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hello! I am Dr. Baaz. Send me a message or a photo of your bird's symptoms for analysis." }
    ]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => setSelectedImg(reader.result);
        if (file) reader.readAsDataURL(file);
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() && !selectedImg) return;

        const userMsg = { 
            id: Date.now(), 
            type: 'user', 
            text: inputText, 
            img: selectedImg 
        };
        setMessages(prev => [...prev, userMsg]);
        
        const textToSend = inputText;
        const imgToSend = selectedImg;
        
        setInputText("");
        setSelectedImg(null);
        setLoading(true);

        try {
            const res = await API.post('/ai/analyze', { 
                message: textToSend, 
                image: imgToSend 
            });
            
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                type: 'bot', 
                text: res.data.response 
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Error connecting to AI server." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1115] text-white p-6 pb-40">
            {/* ... Chat Messages UI ... */}
            <div className="space-y-6">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-2xl max-w-[80%] ${m.type === 'user' ? 'bg-orange-500/20' : 'bg-gray-800'}`}>
                            {m.img && <img src={m.img} className="w-full rounded-lg mb-2" alt="Symptom" />}
                            <p className="text-sm">{m.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Image Preview */}
            {selectedImg && (
                <div className="fixed bottom-40 left-6 bg-gray-800 p-2 rounded-xl border border-orange-500">
                    <img src={selectedImg} className="h-20 w-20 object-cover rounded-lg" alt="Preview" />
                    <button onClick={() => setSelectedImg(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs">✕</button>
                </div>
            )}

            {/* Input Bar */}
            <div className="fixed bottom-24 left-6 right-6 flex gap-2">
                <div className="flex-1 bg-gray-900 rounded-full px-4 flex items-center border border-white/10">
                    <label className="cursor-pointer p-2">
                        📷
                        <input type="file" className="hidden" onChange={handleImageSelect} accept="image/*" />
                    </label>
                    <input 
                        className="bg-transparent flex-1 p-3 outline-none text-sm" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask Dr. Baaz..." 
                    />
                </div>
                <button onClick={handleSendMessage} className="bg-orange-500 p-4 rounded-full">➤</button>
            </div>
        </div>
    );
};

export default Health;