import { motion } from "framer-motion";
import insp1Image from "../assets/insp1.jpg";

const HeroDescription = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen py-32 px-8 md:px-12 overflow-hidden bg-black">
      {/* Background Image with parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={insp1Image}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </motion.div>

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* Main Content */}
        <div className="min-h-[70vh] flex flex-col justify-center">
          {/* Large Typography - Staggered reveal */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.h2 variants={slideInLeft} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
              <span className="text-[#D4AF37]">DN</span> IS THE FOLIO OF
            </motion.h2>
            <motion.h1 variants={slideInLeft} className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              DEMETRE [<span className="text-[#D4AF37]">DEMETRE</span>] NUTSUBIDZE
            </motion.h1>
          </motion.div>

          {/* Role - Staggered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl lg:text-4xl text-white/80 font-light">
              FRONTEND DEVELOPER, <span className="italic text-[#D4AF37]">creative</span> THINKER
            </motion.p>
            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl lg:text-4xl text-white/80 font-light">
              AND <span className="italic text-[#D4AF37]">passionate</span> CODER
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Bar - Staggered */}
        <motion.div 
          className="flex justify-between items-end pt-20 border-t border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="text-xs tracking-[0.2em] text-white/60">
            [NICE TO MEET YOU]
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center gap-2 text-xs tracking-[0.2em] text-white/60">
            <span>[SCROLL</span>
            <span className="text-[#D4AF37]">ჩამოდი</span>
            <span>DOWN]</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.span>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-xs tracking-[0.2em] text-white/60">
            ﹁ სასიამოვნოა გაცნობა ﹂
          </motion.p>
        </motion.div>

        {/* Bio Text - Fade in */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-center mt-32 mb-20"
        >
          <p className="text-xs tracking-[0.3em] text-[#D4AF37] mb-6">
            SR FRONTEND DEVELOPER @ FREELANCE
          </p>
          <p className="text-xs tracking-[0.2em] text-white/40 mb-8">
            BASED IN TBILISI
          </p>
          <p className="text-white/60 leading-relaxed">
            I partner with brands, companies and entrepreneurs to transform visions into
            captivating experiences, all designed with the users at the helm.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroDescription;
