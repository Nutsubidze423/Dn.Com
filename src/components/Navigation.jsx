import { motion } from "framer-motion";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-[1600px] mx-auto px-8 md:px-20 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="text-2xl font-bold text-white hover:text-[#D4AF37] transition-colors duration-300"
        >
          DN
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          <a
            href="#home"
            className="text-sm uppercase tracking-[0.15em] text-white hover:text-[#D4AF37] transition-colors duration-300"
          >
            HOME
          </a>
          <a
            href="#projects"
            className="text-sm uppercase tracking-[0.15em] text-white hover:text-[#D4AF37] transition-colors duration-300"
          >
            PROJECTS
          </a>
          <a
            href="#info"
            className="text-sm uppercase tracking-[0.15em] text-white hover:text-[#D4AF37] transition-colors duration-300"
          >
            INFO
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white">
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
