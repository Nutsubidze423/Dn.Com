import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, Palette, Code2, Rocket } from "lucide-react";
import insp5Image from "../assets/insp5.jpg";

const ProcessStep = ({ step, index, isLast }) => {
  const stepRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start end", "center center"]
  });
  
  const lineScale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

  const icons = [Search, Palette, Code2, Rocket];
  const Icon = icons[index];

  return (
    <motion.div
      ref={stepRef}
      className="relative flex gap-8 md:gap-16"
      style={{ opacity }}
    >
      {/* Timeline line */}
      {!isLast && (
        <motion.div
          className="absolute left-[23px] md:left-[31px] top-16 w-[2px] h-[calc(100%+4rem)] bg-gradient-to-b from-[#C9A227]/50 to-transparent origin-top"
          style={{ scaleY: lineScale }}
        />
      )}
      
      {/* Icon circle */}
      <motion.div 
        className="relative z-10 flex-shrink-0"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#C9A227]/30 bg-[#0a0a0a] flex items-center justify-center group-hover:border-[#C9A227] transition-colors duration-500">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#C9A227]" />
        </div>
        <div className="absolute inset-0 rounded-full bg-[#C9A227]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
      
      {/* Content */}
      <motion.div style={{ x }} className="pb-16 md:pb-24">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-display text-5xl md:text-7xl font-medium text-[#C9A227]/20 tracking-[-0.02em]">
            0{index + 1}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-medium text-[#FAFAFA] tracking-[-0.01em]">
            {step.title}
          </h3>
        </div>
        <p className="font-body text-white/50 text-base md:text-lg leading-[1.8] max-w-md font-light">
          {step.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-6">
          {step.tags.map((tag, i) => (
            <span 
              key={tag}
              className="text-[10px] tracking-[0.2em] text-[#C9A227]/60 uppercase px-3 py-1 border border-[#C9A227]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProcessSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const steps = [
    {
      title: "DISCOVERY",
      description: "Understanding your vision, goals, and requirements. I dive deep into research to ensure every decision is purposeful and aligned with your objectives.",
      tags: ["Research", "Strategy", "Planning"]
    },
    {
      title: "DESIGN",
      description: "Crafting visual experiences that captivate and convert. From wireframes to high-fidelity mockups, every pixel is intentional.",
      tags: ["UI/UX", "Prototyping", "Visual Design"]
    },
    {
      title: "DEVELOP",
      description: "Bringing designs to life with clean, performant code. I build with modern technologies and best practices for scalable solutions.",
      tags: ["Frontend", "Animation", "Integration"]
    },
    {
      title: "DEPLOY",
      description: "Launching your project with precision. I ensure smooth deployment, optimization, and ongoing support for continued success.",
      tags: ["Launch", "Optimize", "Support"]
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 bg-[#0a0a0a] overflow-hidden"
      id="process"
    >
      {/* Animated Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <img
          src={insp5Image}
          alt=""
          className="w-full h-[120%] object-cover opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        
        {/* Animated gold glow */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Second animated glow */}
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - Responsive typography */}
        <div className="mb-16 sm:mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-6"
          >
            <h2 
              className="font-display font-medium text-[#FAFAFA] tracking-[-0.03em] leading-[0.9]"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)' }}
            >
              PROCESS
            </h2>
            <p className="font-body text-sm sm:text-base text-[#C9A227] mt-2 sm:mt-0 sm:mb-4 tracking-[0.3em] font-light hidden sm:block">
              ﹙過程﹚
            </p>
          </motion.div>
          <motion.h2 
            className="font-display font-medium text-[#FAFAFA] tracking-[-0.03em] leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            APPROACH
          </motion.h2>
          <motion.div 
            className="w-16 sm:w-24 h-[1px] bg-[#C9A227]/30 mt-4 sm:mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>

        {/* Process Steps */}
        <div className="relative">
          {steps.map((step, index) => (
            <ProcessStep 
              key={step.title}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 pt-16 border-t border-white/10"
        >
          <p className="font-display text-2xl md:text-3xl text-[#FAFAFA] font-light italic tracking-[-0.01em]">
            "Every great project starts with <span className="text-[#C9A227]">understanding</span>"
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
