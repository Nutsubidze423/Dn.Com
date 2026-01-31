import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const Navigation = () => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 h-[80px] bg-background/80 backdrop-blur-sm border-b border-border px-5 md:px-20 flex items-center justify-between"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <div className="text-2xl font-bold text-textPrimary">
        <span>D</span><span className="text-accentGold">N</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-10">
        <motion.a 
          href="#home" 
          className="text-sm font-normal tracking-[0.1em] uppercase text-textPrimary hover:text-accentGold transition-colors duration-[0.3s]"
          whileHover={{ scale: 1.05 }}
        >
          Home
        </motion.a>
        <motion.a 
          href="#projects" 
          className="text-sm font-normal tracking-[0.1em] uppercase text-textPrimary hover:text-accentGold transition-colors duration-[0.3s]"
          whileHover={{ scale: 1.05 }}
        >
          Projects
        </motion.a>
        <motion.a 
          href="#info" 
          className="text-sm font-normal tracking-[0.1em] uppercase text-textPrimary hover:text-accentGold transition-colors duration-[0.3s]"
          whileHover={{ scale: 1.05 }}
        >
          Info
        </motion.a>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Menu className="w-6 h-6 text-textPrimary" />
      </div>
    </motion.nav>
  );
};

export default Navigation;
