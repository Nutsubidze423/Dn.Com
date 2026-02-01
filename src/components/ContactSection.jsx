import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <footer
      className="relative py-32 px-8 md:px-20 bg-black border-t border-[#1a1a1a]"
      id="contact"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            COME say HELLO
          </h2>
          <p className="text-3xl text-gray-500">﹁ გ ა მ ა რ ჯ ო ბ ა ﹂</p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <a
            href="mailto:demetrenutsubidze423@gmail.com"
            className="text-2xl md:text-3xl text-white hover:text-[#D4AF37] transition-colors duration-300 underline decoration-1 underline-offset-4"
          >
            demetrenutsubidze423@gmail.com
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-6 mb-20"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://www.linkedin.com/in/demetre-nutsubidze/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#333] rounded-full text-sm font-semibold uppercase tracking-wider text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
          >
            <span>→</span>
            LINKEDIN
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="https://github.com/Nutsubidze423"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border border-[#333] rounded-full text-sm font-semibold uppercase tracking-wider text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
          >
            <span>→</span>
            GITHUB
          </motion.a>
        </motion.div>

        {/* Copyright */}
        <div className="text-sm text-gray-600 uppercase tracking-wider">
          © 2026 DEMETRE NUTSUBIDZE
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
