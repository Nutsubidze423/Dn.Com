import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useCallback } from "react";

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [cursorX, cursorY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    
    // Add class to body to hide default cursor
    document.body.classList.add('custom-cursor-active');
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [handleMouseMove]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] hidden md:flex items-center justify-center bg-[#C9A227] rounded-full"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        x: "-50%",
        y: "-50%",
        width: 12,
        height: 12,
      }}
    />
  );
}

export default CustomCursor;
