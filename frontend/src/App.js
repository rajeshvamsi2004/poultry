import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import Sell from './pages/Sell';
import Health from './pages/Health';
import Shastra from './pages/Shastra';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

// Protected: Only if token exists
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
};

// Public: Only if token DOES NOT exist
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/market" replace /> : children;
};

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/';

    return (
        <div className="bg-[#0F1115] min-h-screen">
            <Routes>
                <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
                
                <Route path="/market" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
                <Route path="/shastra" element={<ProtectedRoute><Shastra /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/market" : "/"} replace />} />
            </Routes>

            {!isAuthPage && <BottomNav />}
        </div>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;