import { motion } from 'framer-motion';

const ExpertiseMarquee = () => {
  const expertise = "ART DIRECTION • UI / VISUAL DESIGN • USER EXPERIENCE DESIGN • ENTERPRISE DESIGN THINKING • RESEARCH / STRATEGY • BRAND IDENTITY •";
  
  return (
    <section className="py-20 md:py-24 bg-background border-y border-border">
      <div className="container mx-auto px-5 md:px-20">
        <motion.div
          className="flex whitespace-nowrap overflow-hidden"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="flex space-x-4">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className="text-sm md:text-base font-bold tracking-[0.15em] uppercase"
              >
                {expertise.split('').map((char, charIndex) => {
                  const isGold = index % 2 === 0;
                  return (
                    <span key={charIndex} className={isGold ? 'text-accentGold' : 'text-textPrimary'}>
                      {char}
                    </span>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExpertiseMarquee;
