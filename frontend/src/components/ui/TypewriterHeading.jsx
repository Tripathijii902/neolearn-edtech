import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = [
  "Master the Future of Technology.",
  "Accelerate Your Tech Career.",
  "Build Next-Gen Applications."
];

const TypewriterHeading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3500); // Change title every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-32 md:h-48 mb-6 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.h1
          key={titles[index]}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-tight text-center"
        >
          {titles[index].split(' ').map((word, i, arr) => {
            // Gradient the last word
            if (i === arr.length - 1) {
              return <span key={i} className="text-gradient"> {word}</span>;
            }
            return <span key={i}> {word}</span>;
          })}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default TypewriterHeading;
