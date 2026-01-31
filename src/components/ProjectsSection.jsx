import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import MagneticButton from './MagneticButton';

const ProjectsSection = () => {
  return (
    <section className="py-48 bg-black relative overflow-hidden" id="projects">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
      
      {/* Section header */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[120px] leading-[0.9] font-black mb-24"
          style={{
            fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
            fontWeight: 900
          }}
        >
          PROJECTS
        </motion.h2>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-32 mb-24">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              {/* Project card */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-900/50 hover:bg-gray-900/80 transition-colors duration-500">
                {/* Image with hover effect */}
                <motion.div 
                  className="relative h-[800px] overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-80" />
                  
                  {/* Project info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-20">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="text-8xl font-black mb-8" style={{ letterSpacing: '-0.05em' }}>
                        {project.name}
                      </h3>
                      <p className="text-2xl text-gray-300 mb-12 max-w-2xl leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-6 mb-12">
                        {project.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-6 py-3 bg-gray-800 rounded-full text-sm uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <MagneticButton
                        href={project.liveUrl}
                        className="group relative px-12 py-6 text-xl font-bold uppercase tracking-wider"
                      >
                        <span className="relative z-10">VIEW PROJECT</span>
                        <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:translate-x-2 transition-transform duration-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </MagneticButton>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <MagneticButton
            href="#contact"
            className="group relative px-16 py-8 text-2xl font-black uppercase tracking-wider"
          >
            <span className="relative z-10">CONTACT ME</span>
            <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 group-hover:translate-x-3 transition-transform duration-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
