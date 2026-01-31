import { motion } from "framer-motion";
import { personalInfo } from "../data/personal-info";
import MagneticButton from "./MagneticButton";

const InfoSection = () => {
  return (
    <section className="py-48 bg-black relative overflow-hidden" id="info">
      {/* Background elements */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/insp1.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left side - Text */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="text-[120px] leading-[0.9] font-black mb-16"
              style={{ letterSpacing: "-0.05em" }}
            >
              ABOUT
            </h2>
            <div className="space-y-12 text-xl text-gray-300 leading-relaxed">
              <p style={{ lineHeight: "1.8" }}>
                Frontend developer focused on building clean, responsive, and
                high-performance web interfaces with React.
              </p>
              <p style={{ lineHeight: "1.8" }}>
                Strong foundation in HTML, CSS, and modern JavaScript, with
                experience using frameworks and libraries to turn complex ideas
                into intuitive user experiences.
              </p>
              <p style={{ lineHeight: "1.8" }}>
                Detail-oriented, performance-driven, and comfortable working on
                real-world projects from UI implementation to component
                architecture.
              </p>
            </div>
            <div className="mt-24">
              <MagneticButton
                href="#contact"
                className="group relative px-16 py-8 text-2xl font-black uppercase tracking-wider"
              >
                <span className="relative z-10">GET IN TOUCH</span>
                <div className="absolute inset-0 bg-yellow-400/10 group-hover:bg-yellow-400/20 rounded-full transition-colors duration-500" />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 group-hover:translate-x-3 transition-transform duration-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/src/assets/insp3.jpg"
                alt="Demetre Nutsubidze"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-yellow-400 rounded-full opacity-30" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-yellow-400 rounded-full opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
