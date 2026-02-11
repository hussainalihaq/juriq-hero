import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import BackgroundElements from '../components/BackgroundElements';
import Modal from '../components/Modal';

import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    // const navigate = useNavigate(); // Not needed for modal flow currently

    const handleGetAccess = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <BackgroundElements />

            <Header
                onGetAccess={handleGetAccess}
                darkMode={theme === 'dark'}
                toggleDarkMode={toggleTheme}
            />

            <main className="relative flex flex-col items-center justify-start md:justify-center min-h-[calc(100vh-64px)] px-4 md:px-6 pt-6 md:pt-12 pb-10 md:pb-24 home-content">
                <Hero onGetAccess={handleGetAccess} />
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <Footer />
        </>
    );
};

export default Home;
