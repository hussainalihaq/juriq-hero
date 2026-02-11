import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PricingAndTerms from './pages/PricingAndTerms';
import Waitlist from './pages/Waitlist';
import { ThemeProvider } from './context/ThemeContext';

import { Analytics } from "@vercel/analytics/react"

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pricing" element={<PricingAndTerms />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </Router>
      <Analytics />
    </ThemeProvider>
  );
};

export default App;