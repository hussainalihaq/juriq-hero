import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import BackgroundElements from '../components/BackgroundElements';

import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [prefilledEmail, setPrefilledEmail] = useState('');

    const handleOpenModal = (email?: string) => {
        if (email) setPrefilledEmail(email);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setPrefilledEmail(''), 300);
    };

    return (
        <>
            <BackgroundElements />

            <Header
                onGetAccess={() => handleOpenModal()}
                darkMode={theme === 'dark'}
                toggleDarkMode={toggleTheme}
            />

            <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 pt-12 pb-24 home-content">
                <Hero onGetAccess={handleOpenModal} />
            </main>

            <Footer />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialEmail={prefilledEmail}
            />
        </>
    );
};

export default Home;
