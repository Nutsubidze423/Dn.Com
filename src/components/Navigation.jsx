import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "#home", id: "home" },
    { name: "WORK", href: "#projects", id: "projects" },
    { name: "PROCESS", href: "#process", id: "process" },
    { name: "TOOLS", href: "#tools", id: "tools" },
    { name: "ABOUT", href: "#info", id: "info" },
    { name: "CONTACT", href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past hero
      setScrolled(window.scrollY > window.innerHeight * 0.5);

      // Determine active section
      const sections = ["home", "projects", "process", "tools", "skills", "info", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e, link) => {
    if (link.id === 'home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }
    })
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-8 md:px-12 py-6 sm:py-8">
        <div className="max-w-[1800px] mx-auto flex items-start justify-between">
          {/* Left - Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, { id: 'home' })}
            className="font-display text-[#FAFAFA] text-base tracking-[0.15em] hover:text-[#C9A227] transition-colors duration-500 mix-blend-difference z-[60]"
          >
            DN
          </a>

          {/* Right - Vertical Navigation Links (Desktop - Mason Wong Style) */}
          <div className="hidden md:flex flex-col items-end gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-[#FAFAFA] text-[11px] tracking-[0.2em] hover:text-[#C9A227] transition-all duration-500 flex items-center gap-3 mix-blend-difference group ${
                  activeSection === link.id ? "opacity-100" : "opacity-50"
                }`}
              >
                <span className="animated-underline">{link.name}</span>
                {activeSection === link.id && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 bg-[#C9A227] rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#FAFAFA] mix-blend-difference z-[60] p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.div 
                className="w-6 h-[1.5px] bg-current origin-center"
                animate={mobileMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.div 
                className="w-6 h-[1.5px] bg-current"
                animate={mobileMenuOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.div 
                className="w-4 h-[1.5px] bg-current ml-auto origin-center"
                animate={mobileMenuOpen ? { rotate: -45, y: -9, width: 24 } : { rotate: 0, y: 0, width: 16 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] z-50 md:hidden flex flex-col"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Menu Content */}
              <div className="flex-1 flex flex-col justify-center px-8 sm:px-12">
                <nav className="space-y-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      custom={i}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link)}
                        className={`block text-3xl sm:text-4xl font-display tracking-[-0.02em] transition-colors duration-300 ${
                          activeSection === link.id 
                            ? "text-[#C9A227]" 
                            : "text-[#FAFAFA] hover:text-[#C9A227]"
                        }`}
                      >
                        {link.name}
                      </a>
                      {activeSection === link.id && (
                        <motion.div 
                          className="w-12 h-[1px] bg-[#C9A227] mt-2"
                          layoutId="mobileActiveIndicator"
                        />
                      )}
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Menu Footer */}
              <motion.div 
                className="px-8 sm:px-12 py-8 border-t border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-4">
                  Get in touch
                </p>
                <a 
                  href="mailto:demetrenutsubidze423@gmail.com"
                  className="text-sm text-[#FAFAFA] hover:text-[#C9A227] transition-colors duration-300"
                >
                  demetrenutsubidze423@gmail.com
                </a>
                
                <div className="flex gap-6 mt-6">
                  <a 
                    href="https://www.linkedin.com/in/demetre-nutsubidze/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-[0.2em] text-white/40 hover:text-[#C9A227] transition-colors duration-300"
                  >
                    LINKEDIN
                  </a>
                  <a 
                    href="https://github.com/Nutsubidze423" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] tracking-[0.2em] text-white/40 hover:text-[#C9A227] transition-colors duration-300"
                  >
                    GITHUB
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
