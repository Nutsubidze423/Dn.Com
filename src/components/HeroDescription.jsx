import { motion } from 'framer-motion';

const HeroDescription = () => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section className="py-40 md:py-60 bg-background">
      <div className="container mx-auto px-5 md:px-20 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={variants}
        >
          {/* Small Heading */}
          <div className="text-xs md:text-sm font-normal tracking-[0.2em] uppercase text-accentGold mb-4">
            DN
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-textPrimary mb-6">
            is the folio of
          </h1>

          <div className="text-5xl md:text-8xl font-bold tracking-tight text-textPrimary mb-6">
            <div>Demetre</div>
            <div>Nutsubidze ↓</div>
          </div>

          {/* Subtitle */}
          <div className="text-lg md:text-xl font-normal tracking-[0.15em] uppercase text-textSecondary mb-4">
            Front End Developer, Swimmer
          </div>

          {/* Job Description */}
          <div className="text-sm font-normal text-mediumGray mb-8">
            Based in Tbilisi, Georgia
          </div>

          {/* Bio Paragraph */}
          <p className="text-lg md:text-xl font-light leading-[1.7] text-lightGray max-w-3xl mb-12">
            Frontend developer focused on building clean, responsive, and high-performance web interfaces with React. 
            Strong foundation in HTML, CSS, and modern JavaScript, with experience using frameworks and libraries to turn 
            complex ideas into intuitive user experiences. Detail-oriented, performance-driven, and comfortable working 
            on real-world projects from UI implementation to component architecture.
          </p>

          {/* Greeting Section */}
          <div className="space-y-5">
            <motion.div
              className="text-2xl md:text-3xl font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-textPrimary">[Nice to meet you]</span>
            </motion.div>
            
            <motion.div
              className="text-2xl md:text-3xl font-medium text-textSecondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              「გამარჯობა」
            </motion.div>
            
            <motion.div
              className="text-2xl md:text-3xl font-medium text-accentGold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              [Scroll Down]
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroDescription;
