import { motion } from "framer-motion";
import { personalInfo } from "../data/personal-info";

const HomeSection = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900"></div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Large Initials */}
        <motion.div
          className="text-[15rem] md:text-[20rem] font-black tracking-tighter mb-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 10,
            duration: 0.8,
          }}
        >
          <span className="text-white">D</span>
          <span className="text-gold">N</span>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="text-xl md:text-2xl font-light tracking-widest text-gray-400 uppercase"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {personalInfo.fullName}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-gold to-transparent"
            animate={{
              opacity: [0.3, 1, 0.3],
              height: [24, 32, 24],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeSection;
