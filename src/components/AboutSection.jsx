import { motion } from "framer-motion";
import { personalInfo } from "../data/personal-info";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
            <span className="text-gold">About</span>
            <span className="text-white"> Me</span>
          </h2>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </motion.div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Personal Image Placeholder */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-gold mb-2">DN</div>
                  <div className="text-gray-400 text-sm">Profile Photo</div>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 border-2 border-transparent group-hover:border-gold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              ></motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -left-4 w-20 h-20 border-2 border-gold/30"
              animate={{ rotate: 45 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-4 -right-4 w-12 h-12 bg-gold"
              animate={{ rotate: -45 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </motion.div>

          {/* Bio and Details */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">
                {personalInfo.fullName}
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                {personalInfo.bio}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="text-gold">📍</div>
              <span>{personalInfo.location}</span>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">Skills</h4>

              {/* Frontend Skills */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Frontend
                </h5>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.skills.frontend.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 text-white rounded-full border border-gray-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Tools
                </h5>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.skills.tools.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 text-white rounded-full border border-gray-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other Skills */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gold uppercase tracking-wider">
                  Other
                </h5>
                <div className="flex flex-wrap gap-2">
                  {personalInfo.skills.other.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 text-white rounded-full border border-gray-700 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              className="px-8 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Resume
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
