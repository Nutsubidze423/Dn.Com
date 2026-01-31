import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const ContactFooter = () => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <footer className="py-40 md:py-60 bg-background border-t border-border">
      <div className="container mx-auto px-5 md:px-20 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
          className="text-center"
        >
          {/* Large Heading */}
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-12">
            <span className="text-textPrimary">Come</span>
            <span className="text-accentGold"> say </span>
            <span className="text-textPrimary">Hello</span>
          </h2>

          <div className="text-2xl md:text-4xl font-light text-textSecondary mb-8">
            ﹁ გ ა მ ა რ ჯ ო ბ ა ﹂
          </div>

          {/* Contact Info */}
          <div className="mb-16 space-y-6">
            <motion.a
              href="mailto:demetrenutsubidze423@gmail.com"
              className="inline-block text-lg md:text-xl font-light text-lightGray hover:underline transition-colors duration-[0.3s]"
              whileHover={{ scale: 1.05 }}
            >
              demetrenutsubidze423@gmail.com
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            <motion.a
              href="https://github.com/Nutsubidze423"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-darkGray rounded-full text-sm font-semibold tracking-wide uppercase text-textSecondary hover:border-accentGold hover:text-accentGold transition-all duration-[0.3s]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.a>

            <motion.a
              href="https://www.linkedin.com/in/demetre-nutsubidze/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border border-darkGray rounded-full text-sm font-semibold tracking-wide uppercase text-textSecondary hover:border-accentGold hover:text-accentGold transition-all duration-[0.3s]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </motion.a>
          </div>

          {/* Copyright */}
          <motion.div
            className="text-xs font-light text-mediumGray"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            © 2026 DEMETRE NUTSUBIDZE
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default ContactFooter;
