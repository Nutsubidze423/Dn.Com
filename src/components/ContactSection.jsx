import { motion } from 'framer-motion';
import { personalInfo } from '../data/personal-info';
import MagneticButton from './MagneticButton';

const ContactSection = () => {
  return (
    <section className="py-48 bg-black relative overflow-hidden" id="contact">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90" />
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Main heading */}
          <h2 className="text-[120px] leading-[0.9] font-black mb-16" style={{ letterSpacing: '-0.05em' }}>
            LET'S WORK
          </h2>
          <h2 className="text-[120px] leading-[0.9] font-black mb-24" style={{ letterSpacing: '-0.05em' }}>
            TOGETHER
          </h2>
          
          {/* Subheading */}
          <p className="text-3xl text-gray-400 max-w-3xl mx-auto mb-32 leading-relaxed">
            Frontend developer focused on building clean, responsive, and high-performance web interfaces. 
            Open to exciting opportunities and collaborations.
          </p>
          
          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-32">
            {[
              {
                icon: '📧',
                title: 'Email',
                value: personalInfo.email,
                href: `mailto:${personalInfo.email}`
              },
              {
                icon: '📍',
                title: 'Location',
                value: personalInfo.location,
                href: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`
              },
              {
                icon: '💼',
                title: 'LinkedIn',
                value: 'View Profile',
                href: personalInfo.linkedin
              }
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.title === 'LinkedIn' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-8 rounded-3xl bg-gray-900/50 hover:bg-gray-900/80 transition-colors duration-500"
              >
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-yellow-400/30 transition-colors duration-500" />
                
                {/* Icon */}
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors duration-500">
                  {item.title}
                </h3>
                
                {/* Value */}
                <p className="text-lg text-gray-300 group-hover:text-white transition-colors duration-500">
                  {item.value}
                </p>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.a>
            ))}
          </div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-48"
          >
            <MagneticButton
              href={`mailto:${personalInfo.email}`}
              className="group relative px-20 py-10 text-3xl font-black uppercase tracking-wider"
            >
              <span className="relative z-10">GET IN TOUCH</span>
              <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 group-hover:translate-x-4 transition-transform duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </MagneticButton>
          </motion.div>
          
          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center gap-12 flex-wrap"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-12 py-6 text-xl font-bold uppercase tracking-wider"
            >
              <span className="relative z-10 group-hover:text-yellow-400 transition-colors duration-500">
                GitHub
              </span>
              <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-12 py-6 text-xl font-bold uppercase tracking-wider"
            >
              <span className="relative z-10 group-hover:text-yellow-400 transition-colors duration-500">
                LinkedIn
              </span>
              <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
            </a>
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 pt-16 border-t border-gray-800"
          >
            <p className="text-2xl font-bold mb-4">Demetre Nutsubidze</p>
            <p className="text-gray-500 text-lg">© 2024 All rights reserved</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
