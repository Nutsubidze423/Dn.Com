import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import insp1Image from "../assets/insp1.jpg";

const TagItem = ({ tag, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="inline-block px-4 py-2 border border-white/20 text-[#FAFAFA] text-sm tracking-wider hover:border-[#C9A227]/50 hover:text-[#C9A227] hover:bg-[#C9A227]/5 transition-all duration-300 cursor-default"
    >
      {tag}
    </motion.span>
  );
};

const ToolCategory = ({ category, tools, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group"
    >
      {/* Category Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-[1px] bg-[#C9A227]/50" />
        <h3 className="font-body text-xs tracking-[0.3em] text-[#C9A227] uppercase">
          {category}
        </h3>
      </div>

      {/* Tags Grid */}
      <div className="flex flex-wrap gap-3">
        {tools.map((tool, toolIndex) => (
          <TagItem key={tool} tag={tool} index={toolIndex} />
        ))}
      </div>
    </motion.div>
  );
};

const ToolsSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const toolCategories = [
    {
      category: "Frontend",
      tools: ["React", "JavaScript", "TypeScript", "Angular", "Next.js", "Vite"]
    },
    {
      category: "Styling",
      tools: ["Tailwind CSS", "CSS3", "SASS", "Bootstrap", "Styled Components"]
    },
    {
      category: "Tools & Platforms",
      tools: ["Git", "VS Code", "Figma", "Node.js", "Vercel", "NPM"]
    },
    {
      category: "Concepts",
      tools: ["Responsive Design", "Accessibility", "SEO", "Performance", "Clean Code"]
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 bg-[#0a0a0a] overflow-hidden"
      id="tools"
    >
      {/* Animated Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <img
          src={insp1Image}
          alt=""
          className="w-full h-[120%] object-cover opacity-[0.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />

        {/* Animated gold particles effect */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-[300px] h-[300px]"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px]"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header - Responsive typography */}
        <div className="mb-12 sm:mb-20 md:mb-28">
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
              TOOLS
            </h2>
            <p className="font-body text-sm sm:text-base text-[#C9A227] mt-2 sm:mt-0 sm:mb-4 tracking-[0.3em] font-light hidden sm:block">
              ﹙ツール﹚
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
            & STACK
          </motion.h2>
          <motion.div
            className="w-16 sm:w-24 h-[1px] bg-[#C9A227]/30 mt-4 sm:mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-white/40 text-base sm:text-lg mt-4 sm:mt-8 max-w-xl font-light leading-relaxed"
          >
            Technologies and tools I use to build exceptional digital experiences.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {toolCategories.map((cat, index) => (
            <ToolCategory
              key={cat.category}
              category={cat.category}
              tools={cat.tools}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 pt-16 border-t border-white/10 grid grid-cols-3 gap-8"
        >
          {[
            { value: "1", label: "Year Experience" },
            { value: "25+", label: "Tools Mastered" },
            { value: "3", label: "Projects" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-5xl md:text-6xl font-medium text-[#C9A227] tracking-[-0.02em]">
                {stat.value}
              </p>
              <p className="font-body text-[10px] text-white/30 tracking-[0.2em] uppercase mt-3">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;
