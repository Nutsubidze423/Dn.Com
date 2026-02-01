import { motion } from "framer-motion";
import insp1Image from "../assets/insp1.jpg";

const HeroDescription = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 100 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <section className="relative py-40 px-8 md:px-20 overflow-hidden">
      {/* Background Image - FULL SECTION BACKGROUND */}
      <div className="absolute inset-0 z-0">
          <img
            src={insp1Image}
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
        {/* Gradient overlay to blend into black */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Small intro */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-6"
        >
          DN
        </motion.p>

        {/* Large title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
        >
          is the folio of
        </motion.h2>

        {/* Name - HUGE */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] mb-2"
        >
          Demetre
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] mb-12"
        >
          Nutsubidze ↓
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-lg uppercase tracking-[0.2em] text-gray-400 mb-4"
        >
          FRONT END DEVELOPER, SWIMMER
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-sm uppercase tracking-[0.15em] text-gray-600 mb-12"
        >
          BASED IN TBILISI, GEORGIA
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-16"
        >
          Frontend developer focused on building clean, responsive, and
          high-performance web interfaces with React. Strong foundation in HTML,
          CSS, and modern JavaScript, with experience using frameworks and
          libraries to turn complex ideas into intuitive user experiences.
        </motion.p>

        {/* Greeting section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <p className="text-2xl font-medium">
            <span className="text-[#D4AF37]">[</span>
            NICE TO MEET YOU
            <span className="text-[#D4AF37]">]</span>
          </p>
          <p className="text-2xl text-gray-400">「გამარჯობა」</p>
          <p className="text-xl text-gray-500">
            <span className="text-[#D4AF37]">[</span>
            SCROLL DOWN
            <span className="text-[#D4AF37]">]</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroDescription;
