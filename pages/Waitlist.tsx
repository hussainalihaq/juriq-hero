import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BackgroundElements from '../components/BackgroundElements';
import Modal from '../components/Modal';
import { useTheme } from '../context/ThemeContext';

const Waitlist: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(true); // Open by default
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleClose = () => {
        setIsModalOpen(false);
        navigate('/'); // Redirect to home on close
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-off-white dark:bg-midnight-bg transition-colors duration-300">
            <BackgroundElements />

            <Header
                onGetAccess={() => setIsModalOpen(true)}
                darkMode={theme === 'dark'}
                toggleDarkMode={toggleTheme}
            />

            {/* Empty Main Content - Background only */}
            <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 md:px-6 pt-8 md:pt-12 pb-16 md:pb-24">
                {/* Optional: Add a subtle loading or text if the modal doesn't appear instantly, 
                   but usually it will be fast enough. Keeping it clean. */}
            </main>

            <Modal isOpen={isModalOpen} onClose={handleClose} />
        </div>
    );
};

export default Waitlist;
