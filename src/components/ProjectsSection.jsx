import { motion } from "framer-motion";
import { projects } from "../data/projects";
import redseemImage from "../assets/1.png";
import spaceTourismImage from "../assets/2.png";

const ProjectsSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 100 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-200px" },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section className="py-32 px-8 md:px-20 bg-black" id="projects">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-24">
        <div className="flex justify-between items-start mb-4">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white"
          >
            FEATURED
          </motion.h2>
          <p className="text-xl text-gray-500 mt-4">﹁ პ რ ო ე ქ ტ ე ბ ი ﹂</p>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white"
        >
          PROJECTS
        </motion.h2>
      </div>

      {/* Project 1 - Redseem Clothing */}
      <motion.div {...fadeInUp} className="max-w-7xl mx-auto mb-32">
        {/* MASSIVE Image Container */}
        <div className="relative overflow-hidden rounded-2xl group mb-12">
          {/* Image reveal overlay */}
          <motion.div
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-white origin-right z-10"
          />

          {/* The actual image - VERY TALL */}
          <div className="relative h-[500px] md:h-[700px] lg:h-[850px]">
            <img
              src={redseemImage}
              alt="Redseem Clothing"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Hover content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
              <motion.div
                initial={{ y: 40 }}
                whileHover={{ y: 0 }}
                className="text-center"
              >
                <p className="text-white text-3xl font-semibold mb-2">
                  VIEW PROJECT
                </p>
                <p className="text-white/70 text-lg">Click to explore →</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div>
          <a
            href="https://voluble-douhua-67fd8e.netlify.app/shop.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 hover:text-[#D4AF37] transition-colors duration-300 cursor-pointer">
              REDSEEM CLOTHING
            </h3>
          </a>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-3xl">
            Modern clothing e-commerce website with clean design and seamless
            shopping experience. Built with a focus on user experience and
            visual storytelling.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              JAVASCRIPT
            </span>
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              HTML
            </span>
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              CSS
            </span>
          </div>

          <a
            href="https://voluble-douhua-67fd8e.netlify.app/shop.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold text-lg hover:gap-4 transition-all duration-300"
          >
            VISIT LIVE SITE
            <span>→</span>
          </a>
        </div>
      </motion.div>

      {/* Project 2 - SpaceTourism (IDENTICAL STRUCTURE) */}
      <motion.div
        {...fadeInUp}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-7xl mx-auto mb-32"
      >
        <div className="relative overflow-hidden rounded-2xl group mb-12">
          <motion.div
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-white origin-right z-10"
          />

          <div className="relative h-[500px] md:h-[700px] lg:h-[850px]">
            <img
              src={spaceTourismImage}
              alt="SpaceTourism"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
              <motion.div
                initial={{ y: 40 }}
                whileHover={{ y: 0 }}
                className="text-center"
              >
                <p className="text-white text-3xl font-semibold mb-2">
                  VIEW PROJECT
                </p>
                <p className="text-white/70 text-lg">Click to explore →</p>
              </motion.div>
            </div>
          </div>
        </div>

        <div>
          <a
            href="https://spacetourism-gules.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 hover:text-[#D4AF37] transition-colors duration-300 cursor-pointer">
              SPACETOURISM
            </h3>
          </a>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 max-w-3xl">
            Space travel agency concept featuring immersive design and
            interactive exploration. Modern UI showcasing destinations beyond
            Earth.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              ANGULAR
            </span>
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              TYPESCRIPT
            </span>
            <span className="px-6 py-2.5 border border-[#333] rounded-full text-sm uppercase tracking-wide text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
              JAVASCRIPT
            </span>
          </div>

          <a
            href="https://spacetourism-gules.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold text-lg hover:gap-4 transition-all duration-300"
          >
            VISIT LIVE SITE
            <span>→</span>
          </a>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto text-center mt-40">
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
          Immersive experiences uniquely created based on user-insights and
          design thinking methodologies. Always setting you apart from the
          industry.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-14 py-5 border-2 border-white rounded-full text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          VIEW ALL WORK
        </motion.button>
      </div>
    </section>
  );
};

export default ProjectsSection;
