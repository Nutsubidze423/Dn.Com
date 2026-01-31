import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HeroIntro from './components/HeroIntro';
import HeroDescription from './components/HeroDescription';
import ProjectsSection from './components/ProjectsSection';
import InfoSection from './components/InfoSection';
import SkillsSection from './components/SkillsSection';
import ContactSection from './components/ContactSection';
import CustomCursor from './components/CustomCursor';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isCursorActive, setIsCursorActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Custom Cursor */}
      {isCursorActive && <CustomCursor />}
      
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          >
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[200px] leading-[0.9] font-black mb-8"
            >
              DN
            </motion.h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Navigation />
            <HeroIntro />
            <HeroDescription />
            <ProjectsSection />
            <InfoSection />
            <SkillsSection />
            <ContactSection />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
