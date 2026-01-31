import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      className="group mb-30"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Image Container */}
      <motion.div 
        className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8 group-hover:rounded-lg transition-all duration-[0.6s]"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img 
          src={project.image} 
          alt={project.name}
          className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-[0.6s]"
        />
        <motion.div 
          className="absolute inset-0 bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity duration-[0.6s]"
        ></motion.div>
      </motion.div>

      {/* Project Info */}
      <div className="space-y-3 md:space-y-4">
        <motion.h3 
          className="text-2xl md:text-3xl font-semibold text-textPrimary group-hover:text-accentGold transition-colors duration-[0.3s]"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          {project.name}
        </motion.h3>
        
        <p className="text-base md:text-lg font-normal leading-[1.6] text-textSecondary">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-4">
          {project.tags.map((tag, index) => (
            <motion.span
              key={index}
              className="px-4 py-2 border border-darkGray rounded-full text-xs font-medium tracking-wide uppercase text-textSecondary group-hover:border-accentGold group-hover:text-accentGold transition-all duration-[0.3s]"
              whileHover={{ scale: 1.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* View Project Link */}
        <motion.a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-sm font-semibold uppercase tracking-wide text-accentGold group-hover:underline group-hover:underline-offset-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          View Project <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
