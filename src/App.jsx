import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import HeroIntro from './components/HeroIntro';
import ProjectsSection from './components/ProjectsSection';
import ProcessSection from './components/ProcessSection';
import ToolsSection from './components/ToolsSection';
import InfoSection from './components/InfoSection';
import ContactSection from './components/ContactSection';
import CustomCursor from './components/CustomCursor';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const lenisRef = useRef(null);

  // Scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Add lenis class to html
    document.documentElement.classList.add('lenis');

    return () => {
      lenis.destroy();
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  // Luxury loading animation with counter
  useEffect(() => {
    const duration = 2500; // 2.5 seconds for luxury feel
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLoadingProgress(Math.floor(progress));
      
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setMinTimeElapsed(true);
      }
    };
    
    requestAnimationFrame(updateProgress);
  }, []);

  // Hide loader with luxury transition
  useEffect(() => {
    if (minTimeElapsed && loadingProgress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [minTimeElapsed, loadingProgress]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#FAFAFA] relative">
      <CustomCursor />
      
      {/* Scroll Progress Indicator */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX }}
      />
      
      {/* Luxury Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="loading-screen"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Logo with draw animation */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="font-display text-[120px] md:text-[180px] font-medium tracking-[-0.03em] text-[#C9A227] leading-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              >
                DN
              </motion.h1>
              
              <motion.p
                className="text-[10px] tracking-[0.5em] text-white/40 mt-6 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Demetre Nutsubidze
              </motion.p>
            </motion.div>
            
            {/* Progress counter */}
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="font-display text-5xl md:text-6xl text-[#C9A227] tracking-[-0.02em]">
                {loadingProgress.toString().padStart(2, '0')}
              </span>
              
              {/* Progress bar */}
              <div className="mt-4 w-48 h-[2px] bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-[#C9A227]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
            </motion.div>
            
            {/* Corner text */}
            <motion.div
              className="absolute bottom-8 left-8 text-[10px] tracking-[0.3em] text-white/30 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Portfolio 2025
            </motion.div>
            
            <motion.div
              className="absolute bottom-8 right-8 text-[10px] tracking-[0.3em] text-white/30 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Tbilisi, Georgia
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <Navigation />
            <main>
              <HeroIntro />
              <ProjectsSection />
              <ProcessSection />
              <ToolsSection />
              <InfoSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
