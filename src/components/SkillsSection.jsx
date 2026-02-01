import { motion } from "framer-motion";
import insp4Image from "../assets/insp4.jpg";
import insp5Image from "../assets/insp5.jpg";
import insp6Image from "../assets/insp6.jpg";

const SkillsSection = () => {
  return (
    <section className="py-32 px-8 md:px-20 bg-black" id="skills">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-24 text-center"
        >
          EXPERTISE
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Skill Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              src={insp4Image}
              alt="Frontend"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-3xl font-bold text-white mb-3">FRONTEND</h3>
              <p className="text-gray-300 text-lg">
                React, JavaScript, TypeScript, HTML, CSS
              </p>
            </div>
          </motion.div>

          {/* Skill Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              src={insp5Image}
              alt="Tools"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-3xl font-bold text-white mb-3">TOOLS</h3>
              <p className="text-gray-300 text-lg">
                Git, VS Code, Figma, Chrome DevTools
              </p>
            </div>
          </motion.div>

          {/* Skill Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img
              src={insp6Image}
              alt="Performance"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <h3 className="text-3xl font-bold text-white mb-3">
                PERFORMANCE
              </h3>
              <p className="text-gray-300 text-lg">
                Optimization, Responsive Design, Accessibility
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
