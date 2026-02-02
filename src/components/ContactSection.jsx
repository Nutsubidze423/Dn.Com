import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, MapPin, Calendar, ArrowUpRight, Check } from "lucide-react";
import insp2Image from "../assets/insp2.jpg";

const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const email = "demetrenutsubidze423@gmail.com";

  const handleEmailClick = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => {
        window.location.href = `mailto:${email}`;
      }, 500);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  };

  const socialLinks = [
    { name: "LINKEDIN", url: "https://www.linkedin.com/in/demetre-nutsubidze/", icon: Linkedin },
    { name: "GITHUB", url: "https://github.com/Nutsubidze423", icon: Github },
    { name: "EMAIL", url: `#`, icon: Mail, onClick: handleEmailClick },
  ];

  return (
    <footer className="relative min-h-screen py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 overflow-hidden grain-overlay" id="contact">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={insp2Image} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.5)_100%)]" />
      </div>

      <div className="max-w-[1800px] mx-auto relative z-10 h-full flex flex-col justify-between min-h-[80vh]">
        {/* Top Bar - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-10 sm:mb-16 md:mb-20"
        >
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-white/40 uppercase font-medium">[DEMETRE NUTSUBIDZE]</p>
          <p className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-[#C9A227]/60 uppercase font-medium">[AVAILABLE FOR WORK]</p>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Heading - Luxury Style with fluid typography */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 sm:mb-16 md:mb-20"
          >
            <div className="overflow-hidden">
              <h2 
                className="font-display font-medium text-[#FAFAFA] leading-[0.9] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3rem, 12vw, 8.75rem)' }}
              >COME</h2>
            </div>
            <div className="overflow-hidden">
              <h2 
                className="font-display font-medium text-[#FAFAFA] leading-[0.9] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3rem, 12vw, 8.75rem)' }}
              >SAY</h2>
            </div>
            <div className="overflow-hidden flex items-center gap-4 sm:gap-8">
              <h2 
                className="font-display font-medium text-gradient leading-[0.9] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(3rem, 12vw, 8.75rem)' }}
              >HELLO</h2>
              <span className="font-body text-base sm:text-xl md:text-2xl text-white/30 tracking-[0.2em] sm:tracking-[0.3em] font-light hidden sm:block">
                ﹙こんにちは﹚
              </span>
            </div>
          </motion.div>

          {/* Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="grid md:grid-cols-2 gap-16 mb-20"
          >
            <div>
              <p className="font-body text-white/50 text-base leading-[1.8] mb-8 font-light">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              <div className="flex items-center gap-4 text-white/30 text-xs tracking-[0.15em] font-light">
                <MapPin size={14} />
                <span>Tbilisi, Georgia</span>
                <span className="mx-2 text-[#C9A227]/50">•</span>
                <Calendar size={14} />
                <span>Open to remote work</span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email with copy functionality */}
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-4 text-[#FAFAFA] hover:text-[#C9A227] transition-colors duration-500 group w-full text-left"
              >
                {copied ? <Check size={18} className="text-[#C9A227]" /> : <Mail size={18} className="text-white/50" />}
                <span className="font-body text-lg font-light tracking-wide">{email}</span>
                <span className={`opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase ${copied ? 'text-[#C9A227]' : 'text-white/40'}`}>
                  {copied ? 'Copied!' : 'Click to copy'}
                </span>
              </button>
              
              <a href="https://www.linkedin.com/in/demetre-nutsubidze/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#FAFAFA] hover:text-[#C9A227] transition-colors duration-500 group">
                <Linkedin size={18} className="text-white/50" />
                <span className="font-body text-lg font-light tracking-wide">LinkedIn</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <a href="https://github.com/Nutsubidze423" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#FAFAFA] hover:text-[#C9A227] transition-colors duration-500 group">
                <Github size={18} className="text-white/50" />
                <span className="font-body text-lg font-light tracking-wide">GitHub</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-10 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links with Arrows */}
            <div className="flex gap-10">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  onClick={link.onClick}
                  target={link.url.startsWith('http') ? "_blank" : undefined}
                  rel={link.url.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 text-white/40 hover:text-[#C9A227] transition-colors duration-500 group cursor-pointer"
                >
                  <span className="text-[11px] tracking-[0.2em] font-medium">{link.name}</span>
                  <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 text-[#C9A227]/0 group-hover:text-[#C9A227]/60">→</span>
                </a>
              ))}
            </div>

            {/* Center - Back to Top */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="text-white/30 hover:text-[#C9A227] transition-colors duration-500 text-[10px] tracking-[0.25em] flex items-center gap-2 uppercase font-medium group"
            >
              <span>BACK TO TOP</span>
              <span className="group-hover:-translate-y-1 transition-transform duration-500">↑</span>
            </button>

            {/* Copyright */}
            <p className="text-[10px] tracking-[0.2em] text-white/30 font-light">
              © 2026 DEMETRE NUTSUBIDZE
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default ContactSection;
