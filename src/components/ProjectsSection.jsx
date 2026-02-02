import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import redseemImage from "../assets/1.png";
import spaceTourismImage from "../assets/2.png";

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Mouse position for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="group"
      >
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden rounded-sm block mb-8"
          style={{ transform: "translateZ(50px)" }}
        >
          {/* Changed from fixed height to aspect-ratio for better image fitting */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#111]">
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
              </div>
            )}
            
            {/* Error fallback */}
            {imageError && (
              <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-white/30 text-sm tracking-wider">Image unavailable</span>
              </div>
            )}
            
            <motion.img
              src={project.image}
              alt={`${project.title} - Project Preview`}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            />
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
            
            {/* Animated border on hover */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-[#C9A227]/30 transition-all duration-700 rounded-sm" />
            
            {/* View project text - luxury style */}
            <div className="absolute bottom-8 left-8 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0">
              <span className="text-[#FAFAFA] text-xs tracking-[0.3em] flex items-center gap-4 font-medium">
                VIEW PROJECT 
                <motion.span 
                  className="text-lg text-[#C9A227]"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  →
                </motion.span>
              </span>
            </div>
            
            {/* Corner accent */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#C9A227]/0 group-hover:border-[#C9A227]/50 transition-all duration-700" />
          </div>
        </a>

        <div style={{ transform: "translateZ(30px)" }}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 group/title"
          >
            <h3 className="font-display text-2xl md:text-3xl font-medium text-[#FAFAFA] hover:text-[#C9A227] transition-colors duration-500 tracking-[-0.01em]">
              {project.title}
            </h3>
          </a>
          <div className="flex items-center gap-3">
            {project.tags.map((tag, i) => (
              <span key={tag} className="text-[11px] text-white/40 tracking-[0.2em] uppercase">
                {tag}{i < project.tags.length - 1 && <span className="ml-3 text-[#C9A227]/50">/</span>}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const projects = [
    {
      title: "REDSEEM CLOTHING",
      image: redseemImage,
      link: "https://voluble-douhua-67fd8e.netlify.app/shop.html",
      tags: ["JAVASCRIPT", "HTML", "CSS"],
    },
    {
      title: "SPACETOURISM",
      image: spaceTourismImage,
      link: "https://spacetourism-gules.vercel.app/",
      tags: ["ANGULAR", "TYPESCRIPT", "JAVASCRIPT"],
    },
  ];

  return (
    <section className="relative py-20 sm:py-32 md:py-40 px-4 sm:px-8 md:px-20 bg-[#0a0a0a] overflow-hidden grain-overlay" id="projects">
      {/* Luxury background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
      
      {/* Subtle radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Section Header - Luxury Style with fluid typography */}
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 md:mb-32 relative z-10">
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 
            className="font-display font-medium text-[#FAFAFA] tracking-[-0.03em] leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 8rem)' }}
          >
            FEATURED
          </h2>
          <p className="font-body text-sm sm:text-base text-[#C9A227] mt-2 sm:mt-0 sm:mb-4 tracking-[0.3em] font-light hidden sm:block">
            ﹙作品集﹚
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
          PROJECTS
        </motion.h2>
        <motion.div 
          className="w-16 sm:w-24 h-[1px] bg-[#C9A227]/30 mt-4 sm:mt-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>

      {/* Projects Grid - Responsive with single column on small screens */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 md:gap-16 mb-16 sm:mb-24 md:mb-32 relative z-10" style={{ perspective: "1000px" }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      {/* View All Work Link - Luxury Style */}
      <motion.div 
        className="max-w-7xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <a 
          href="https://github.com/Nutsubidze423" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 px-12 py-5 border border-[#C9A227]/30 text-[#FAFAFA] text-xs tracking-[0.3em] hover:bg-[#C9A227] hover:text-[#0a0a0a] hover:border-[#C9A227] transition-all duration-500 group magnetic-button"
        >
          VIEW ALL WORK
          <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
        </a>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
