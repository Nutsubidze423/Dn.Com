import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-white/50 pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorX,
          top: cursorY,
        }}
      />
    </>
  );
}

export default CustomCursor;
