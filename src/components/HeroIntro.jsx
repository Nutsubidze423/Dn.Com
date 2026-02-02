import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ShatteringStatue from "./ShatteringStatue";

gsap.registerPlugin(ScrollTrigger);

const HeroIntro = () => {
  const sectionRef = useRef(null);
  const mainTextRef = useRef(null);
  const subTextRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [statueLoaded, setStatueLoaded] = useState(false);
  
  // ScrollTrigger refs for cleanup
  const scrollTriggerRef = useRef(null);
  const timelineRef = useRef(null);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate statue loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatueLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Main scroll animation setup
  useEffect(() => {
    const section = sectionRef.current;
    const mainText = mainTextRef.current;
    const subText = subTextRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;

    if (!section) return;

    // Set initial states
    gsap.set(leftText, { opacity: 0, x: -100 });
    gsap.set(rightText, { opacity: 0, x: 100 });
    gsap.set(mainText, { opacity: 1, y: 0 });
    gsap.set(subText, { opacity: 1, y: 0 });

    // Mobile: Simple animations, no scroll scrubbing for 3D
    if (isMobile) {
      gsap.to(leftText, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 1,
        ease: "power2.out"
      });
      
      gsap.to(rightText, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out"
      });
      
      return;
    }

    // Desktop: Scroll-driven animations
    
    // Create timeline for text animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=500%",
        pin: true,
        scrub: 0.3,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update scroll progress for 3D statue
          setScrollProgress(self.progress);
        }
      }
    });
    
    timelineRef.current = tl;
    scrollTriggerRef.current = tl.scrollTrigger;

    // Phase 1: Hold main text (0-15%)
    tl.to({}, { duration: 0.15 });

    // Phase 2: Main text out, side texts in (15-35%)
    tl.to(mainText, { 
      opacity: 0, 
      y: -50, 
      duration: 0.15,
      ease: "power2.inOut"
    }, 0.15);
    
    tl.to(subText, { 
      opacity: 0, 
      y: -30, 
      duration: 0.15,
      ease: "power2.inOut"
    }, 0.15);
    
    tl.to(leftText, { 
      opacity: 1, 
      x: 0, 
      duration: 0.15,
      ease: "power2.out"
    }, 0.2);
    
    tl.to(rightText, { 
      opacity: 1, 
      x: 0, 
      duration: 0.15,
      ease: "power2.out"
    }, 0.2);

    // Phase 3: Hold side texts (35-70%)
    tl.to({}, { duration: 0.35 });

    // Phase 4: Side texts out (70-90%)
    tl.to(leftText, { 
      opacity: 0, 
      x: -50, 
      duration: 0.15,
      ease: "power2.in"
    }, 0.7);
    
    tl.to(rightText, { 
      opacity: 0, 
      x: 50, 
      duration: 0.15,
      ease: "power2.in"
    }, 0.7);

    // Phase 5: End (90-100%)
    tl.to({}, { duration: 0.1 });

    // Improved cleanup - kill all ScrollTriggers and tweens
    return () => {
      // Kill the timeline first
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      // Kill the ScrollTrigger instance
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      // Kill any remaining tweens on the elements
      gsap.killTweensOf([leftText, rightText, mainText, subText]);
    };
  }, [isMobile]);

  // Handle resize with debounce
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="h-screen relative bg-black overflow-hidden" 
      id="home"
    >
      {/* 3D Shattering Statue Background */}
      {statueLoaded && !isMobile && (
        <ShatteringStatue scrollProgress={scrollProgress} />
      )}
      
      {/* Mobile fallback - simple gradient */}
      {isMobile && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Main Text - Center - Using clamp for fluid typography */}
      <div 
        ref={mainTextRef} 
        className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 z-10"
      >
        <h1 
          className="font-display font-medium text-[#FAFAFA] leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(60px, 18vw, 260px)' }}
        >
          D&nbsp;&nbsp;&nbsp;N
        </h1>
        <p ref={subTextRef} className="font-body text-sm sm:text-lg md:text-xl text-white/60 font-light mt-4 sm:mt-8 tracking-[0.3em] sm:tracking-[0.4em] uppercase">
          ﹙デメトレ﹚
        </p>
      </div>

      {/* Left Text - Improved mobile scaling */}
      <div
        ref={leftTextRef}
        className="absolute inset-y-0 left-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 z-10"
      >
        <div className="max-w-xs sm:max-w-md">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-[#C9A227] mb-4 sm:mb-6 uppercase font-medium">[INTRO]</p>
          <h2 
            className="font-display font-medium text-[#FAFAFA] leading-[1.1] mb-2 sm:mb-4 tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3.75rem)' }}
          >
            IS THE FOLIO OF
          </h2>
          <p 
            className="font-display font-medium text-[#FAFAFA] leading-[1] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 4.5rem)' }}
          >
            DEMETRE
          </p>
          <p className="text-xs sm:text-base text-white/50 mt-4 sm:mt-6 tracking-[0.15em] sm:tracking-[0.2em] font-light">
            ﹙デメトレ・ヌツビゼ﹚
          </p>
        </div>
      </div>

      {/* Right Text - Improved mobile scaling */}
      <div
        ref={rightTextRef}
        className="absolute inset-y-0 right-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 z-10 text-right"
      >
        <div className="max-w-xs sm:max-w-md ml-auto">
          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-[#C9A227] mb-4 sm:mb-6 uppercase font-medium">[ROLE]</p>
          <p 
            className="font-body text-white/80 font-light leading-[1.2] mb-2 sm:mb-3 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3.75rem)' }}
          >
            FRONTEND
          </p>
          <p 
            className="font-body text-white/80 font-light leading-[1.2] mb-2 sm:mb-3 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3.75rem)' }}
          >
            <span className="italic text-[#C9A227]">creative</span> DEV
          </p>
          <p 
            className="font-body text-white/80 font-light leading-[1.2] mb-2 sm:mb-3 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3.75rem)' }}
          >
            AND <span className="italic text-[#C9A227]">passionate</span>
          </p>
          <p 
            className="font-body text-white/80 font-light leading-[1.2] tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 3.75rem)' }}
          >
            CODER
          </p>
        </div>
      </div>

      {/* Luxury Bottom Status Bar - Responsive layout */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 px-4 sm:px-8 md:px-16 z-20">
        <span className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-white/30 uppercase font-medium hidden sm:block">
          [NICE TO MEET YOU]
        </span>
        <span className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] text-white/30 uppercase flex items-center gap-2 sm:gap-3 font-medium">
          [SCROLL <span className="text-sm sm:text-base animate-bounce">↓</span> DOWN]
        </span>
        <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-white/30 font-light hidden sm:block">
          ﹙はじめまして﹚
        </span>
      </div>
    </section>
  );
};

export default HeroIntro;
