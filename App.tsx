import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Modal from './components/Modal';
import BackgroundElements from './components/BackgroundElements';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleOpenModal = (email?: string) => {
    if (email) setPrefilledEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset email after a short delay so the transition is smooth
    setTimeout(() => setPrefilledEmail(''), 300);
  };

  return (
    <>
      <BackgroundElements />
      
      <Header 
        onGetAccess={() => handleOpenModal()} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <main className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 pt-12 pb-24">
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

export default App;