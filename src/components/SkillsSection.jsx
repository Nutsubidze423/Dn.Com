import { motion } from "framer-motion";

const SkillsSection = () => {
  const skills = [
    {
      name: "Frontend",
      description: "React, JavaScript, TypeScript, HTML, CSS",
    },
    { name: "Tools", description: "Git, VS Code" },
    { name: "Design", description: "Photoshop, Figma, Illustrator" },
    { name: "Performance", description: "Web Vitals, Optimization" },
    { name: "UI/UX", description: "Responsive Design, Accessibility" },
    { name: "Backend", description: "Node.js, APIs" },
  ];

  return (
    <section className="py-48 bg-black relative" id="skills">
      {/* Section header */}
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-32"
        >
          <h2
            className="text-[120px] leading-[0.9] font-black mb-12"
            style={{ letterSpacing: "-0.05em" }}
          >
            SKILLS
          </h2>
          <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
            Building exceptional digital experiences through technical expertise
            and design sensibility
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-gray-900/50 hover:bg-gray-900/80 p-12 rounded-3xl transition-colors duration-500"
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-400 rounded-tl-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-400 rounded-tr-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-400 rounded-bl-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-400 rounded-br-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <h3
                className="text-4xl font-black mb-6 group-hover:text-yellow-400 transition-colors duration-500"
                style={{ letterSpacing: "-0.05em" }}
              >
                {skill.name}
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed">
                {skill.description}
              </p>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Skills visual showcase */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={`/src/assets/insp${item}.jpg`}
                alt={`Skill ${item}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full hover:translate-y-0 transition-transform duration-500">
                <h4 className="text-2xl font-black mb-2">SKILL {item}</h4>
                <p className="text-sm text-gray-300">Advanced proficiency</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
