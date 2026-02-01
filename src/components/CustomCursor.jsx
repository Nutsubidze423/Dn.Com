import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 6); // Offset by half of cursor size
      cursorY.set(e.clientY - 6);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed w-3 h-3 bg-[#D4AF37] rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
      }}
    />
  );
}

export default CustomCursor;
