import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className="relative group perspective-1000"
    >
      {/* Glow Effect Behind Card */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <motion.div
        whileHover={{ 
          scale: 1.02,
          rotateX: 2,
          rotateY: -2,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay * 2 // stagger the float slightly
          },
          hover: {
            type: "spring",
            stiffness: 400,
            damping: 30
          }
        }}
        className="relative h-full glass-panel rounded-2xl p-6 flex flex-col items-start justify-between z-10 overflow-hidden"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FloatingCard;
