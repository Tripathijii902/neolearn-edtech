import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Compass, Zap, User } from 'lucide-react';

const FloatingGuideWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-72 glass-panel rounded-2xl p-4 overflow-hidden border border-neon-cyan/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] dark:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <Compass className="w-4 h-4 text-neon-cyan" /> Quick Guide
              </h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                <Zap className="w-5 h-5 text-neon-purple mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Interactive Courses</h5>
                  <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">Scroll down to explore paths with floating 3D interactions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                <User className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard Demo</h5>
                  <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">Visit /dashboard to see the premium student portal.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-shadow duration-300 z-50 relative"
      >
        {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
        
        {/* Pulse effect when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-neon-cyan opacity-40 animate-ping"></span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingGuideWidget;
