import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import insp3Image from "../assets/insp3.jpg";

const InfoSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 0.5], ["60px", "0px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  const infoItems = [
    { label: "LOCATION", value: "Based in Tbilisi, Georgia" },
    { label: "ROLE", value: "Frontend Developer" },
    { label: "FOCUS", value: "React, TypeScript, Modern UI" },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen py-20 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 overflow-hidden bg-[#0a0a0a]" 
      id="info"
    >
      {/* Static Background Image - No parallax to prevent buggy movement */}
      <div className="absolute inset-0 z-0">
        <img 
          src={insp3Image} 
          alt="" 
          className="w-full h-full object-cover opacity-[0.08]" 
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/85" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title - Luxury IN FO with reveal animation - Responsive */}
        <motion.div className="mb-12 sm:mb-16 md:mb-24" style={{ y: textY, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <h2 
              className="font-display font-medium text-[#FAFAFA] leading-[0.85] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(4rem, 15vw, 12.5rem)' }}
            >
              IN
            </h2>
          </motion.div>
          <div className="flex items-center gap-4 sm:gap-8 overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display font-medium text-[#FAFAFA] leading-[0.85] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(4rem, 15vw, 12.5rem)' }}
            >
              FO
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-body text-sm sm:text-lg md:text-xl text-[#C9A227] tracking-[0.2em] sm:tracking-[0.3em] font-light"
            >
              ﹙情報﹚
            </motion.p>
          </div>
        </motion.div>

        {/* Content with staggered reveal - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-32">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="font-body text-lg md:text-xl text-white/70 leading-[1.8] mb-8 font-light">
              A [<span className="text-[#C9A227] font-medium">purpose-driven</span>] developer
              crafting digital experiences that merge technical precision with
              creative vision.
            </p>
            <p className="font-body text-base text-white/50 leading-[1.8] mb-10 font-light">
              My approach combines clean code architecture with intuitive design,
              ensuring every project is built to perform and delight.
            </p>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-4 px-12 py-5 border border-[#C9A227]/30 text-[#FAFAFA] text-xs tracking-[0.3em] hover:bg-[#C9A227] hover:text-[#0a0a0a] hover:border-[#C9A227] transition-all duration-500 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              READ MY STORY
              <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
            </motion.a>
          </motion.div>

          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {infoItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 + index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className="group"
              >
                <p className="text-[10px] tracking-[0.3em] text-[#C9A227]/70 mb-3 uppercase font-medium">
                  {item.label}
                </p>
                <p className="font-body text-xl md:text-2xl text-[#FAFAFA] font-light tracking-wide group-hover:text-[#C9A227] transition-colors duration-500">
                  {item.value}
                </p>
                {/* Animated line */}
                <motion.div 
                  className="h-[1px] bg-white/10 mt-6 overflow-hidden"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.12 }}
                >
                  <div className="h-full bg-[#C9A227]/30 w-full origin-left group-hover:scale-x-100 scale-x-0 transition-transform duration-700" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
