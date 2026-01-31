import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const MagneticButton = ({ href, children, className = '' }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = rect.width / 2;
      const intensity = Math.min(distance / maxDistance, 1);
      
      const moveX = (deltaX / rect.width) * 20 * intensity;
      const moveY = (deltaY / rect.height) * 20 * intensity;
      
      setPosition({ x: moveX, y: moveY });
    };

    const handleMouseEnter = () => {
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <a
      href={href}
      ref={buttonRef}
      className={`relative inline-block overflow-hidden ${className}`}
    >
      <motion.span
        className="relative z-10"
        animate={position}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.span>
    </a>
  );
};

export default MagneticButton;
