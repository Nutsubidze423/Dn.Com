import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import insp4Image from "../assets/insp4.jpg";

const SkillItem = ({ skill, index }) => {
  const itemRef = useRef(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const distance = (mouseX - centerX) / centerX;
    x.set(distance * 15);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
  };

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: 0.2 + index * 0.12, 
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="border-t border-white/10 py-8 group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="flex items-center justify-between"
        style={{ x: springX }}
      >
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium text-[#FAFAFA] group-hover:text-[#C9A227] transition-colors duration-500 tracking-[-0.01em]">
          {skill.name}
        </h3>
        <motion.span 
          className="text-[#C9A227]/0 group-hover:text-[#C9A227]/60 transition-all duration-500 text-xl"
          initial={{ x: -10, opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
        >
          →
        </motion.span>
      </motion.div>
      <motion.p 
        className="text-xs text-white/30 mt-3 tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-light"
      >
        {skill.desc}
      </motion.p>
    </motion.div>
  );
};

const SkillsSection = () => {
  const skills = [
    { name: "FRONTEND DEVELOPMENT", desc: "React, JavaScript, TypeScript" },
    { name: "UI / VISUAL DESIGN", desc: "CSS, Tailwind, Responsive Design" },
    { name: "TOOLS & WORKFLOW", desc: "Git, VS Code, Figma, DevTools" },
    { name: "PERFORMANCE", desc: "Optimization, Accessibility, SEO" },
    { name: "MODERN FRAMEWORKS", desc: "Angular, Next.js, Vite" },
  ];

  return (
    <section className="py-20 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 bg-[#0a0a0a] relative overflow-hidden grain-overlay" id="skills">
      {/* Luxury background gradient */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={insp4Image}
          alt=""
          className="w-full h-full object-cover opacity-[0.03]"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/98 to-[#0a0a0a]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Vertical Japanese Text at Top with luxury animation */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex justify-center mb-12 sm:mb-16 md:mb-24"
        >
          <div className="writing-vertical text-[10px] sm:text-xs tracking-[0.4em] sm:tracking-[0.6em] text-[#C9A227]/70 font-light">
            ﹙技術﹚
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-20 lg:gap-32">
          {/* Left - Image & Quote */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div 
              className="aspect-[4/3] overflow-hidden mb-10 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.img
                src={insp4Image}
                alt="Workspace"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            <div>
              <motion.p 
                className="font-display text-2xl md:text-3xl text-[#FAFAFA] font-light italic mb-4 tracking-[-0.01em]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                quietly <span className="text-[#C9A227]">powerful</span>
              </motion.p>
              <motion.p 
                className="font-body text-lg md:text-xl text-[#FAFAFA] font-medium uppercase tracking-[0.1em]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Digital Experiences
              </motion.p>
              <motion.p 
                className="text-white/40 mt-6 text-sm leading-relaxed font-light tracking-wide max-w-md"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Design to me is a bridge between emotion and function.
              </motion.p>
            </div>
          </motion.div>

          {/* Right - Skills List */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.p 
              className="text-[10px] tracking-[0.3em] text-[#C9A227] mb-12 uppercase font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              [EXPERTISE AND SERVICES]
            </motion.p>

            <div className="space-y-0">
              {skills.map((skill, index) => (
                <SkillItem key={skill.name} skill={skill} index={index} />
              ))}
              {/* Last border */}
              <div className="border-t border-white/10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* CSS for vertical writing */}
      <style>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
};

export default SkillsSection;
