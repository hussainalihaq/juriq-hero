import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';

import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleGetAccess = () => {
        navigate('/signup');
    };

    return (
        <>
            <BackgroundElements />

            <Header
                onGetAccess={handleGetAccess}
                darkMode={theme === 'dark'}
                toggleDarkMode={toggleTheme}
            />

            <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 pt-12 pb-24 home-content">
                <Hero onGetAccess={handleGetAccess} />
            </main>

            <Footer />
        </>
    );
};

export default Home;
