import { motion } from "framer-motion";
import { personalInfo } from "../data/personal-info";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-gray-900"></div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        {/* Left Content - Job Title */}
        <motion.div
          className="space-y-8"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gold"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {personalInfo.jobTitle}
          </motion.div>

          <motion.div
            className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
        </motion.div>

        {/* Right Content - Intro */}
        <motion.div
          className="space-y-6"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Nice to meet you.
          </h2>

          <p className="text-lg text-gray-300 leading-relaxed">
            {personalInfo.bio}
          </p>

          <motion.div
            className="pt-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex space-x-4">
              <span className="inline-block px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 cursor-pointer">
                Download CV
              </span>
              <span className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                View Projects
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 right-10 w-20 h-20 border-2 border-gold/20 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      ></motion.div>

      <motion.div
        className="absolute bottom-1/4 left-10 w-12 h-12 border border-gold/30"
        animate={{
          rotate: -360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      ></motion.div>
    </section>
  );
};

export default HeroSection;
