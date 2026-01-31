import { motion } from 'framer-motion';

function AnimatedText({ text }) {
  const letters = text.split('');
  
  return (
    <div>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

export default AnimatedText;
