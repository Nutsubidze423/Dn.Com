import { motion } from "framer-motion";
import insp3Image from "../assets/insp3.jpg";
import insp1Image from "../assets/insp1.jpg";

const InfoSection = () => {
  return (
    <section className="relative py-40 px-8 md:px-20 overflow-hidden" id="info">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={insp3Image}
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-bold text-white mb-2"
          >
            IN
          </motion.h2>
          <div className="flex items-center gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-bold text-white"
            >
              FO
            </motion.h2>
            <p className="text-xl text-gray-500">﹁ ინ ფ ო რ მ ა ც ი ა ﹂</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-20">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-10"
            >
              A cross-cultural perspective shaped by Georgian roots and modern
              web development
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-12"
            >
              A development approach led by curiosity, precision, and user
              empathy. All digital experiences created are crafted to be
              intuitive, performant, and quietly delightful.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 border-2 border-white rounded-full text-sm font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              READ MY STORY
            </motion.button>
          </div>

          {/* Optional image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
          >
            <img
              src={insp1Image}
              alt="About"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
