import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, BookOpen, Award, ArrowRight } from 'lucide-react';
import FloatingCard from '../components/ui/FloatingCard';
import TypewriterHeading from '../components/ui/TypewriterHeading';
import FloatingGuideWidget from '../components/ui/FloatingGuideWidget';
import AuthModal from '../components/AuthModal';
import useThemeStore from '../store/themeStore';
import { Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-deep-space transition-colors duration-500">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-hero-glow rounded-full mix-blend-screen pointer-events-none"></div>

      {/* Navigation - Minimalist */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tighter">
          Neo<span className="text-neon-purple">Learn</span>
        </div>
        <div className="space-x-8 text-sm font-medium text-gray-600 dark:text-white/70 hidden md:flex">
          <a href="#courses" className="hover:text-neon-purple dark:hover:text-white transition-colors">Courses</a>
          <a href="#about" className="hover:text-neon-purple dark:hover:text-white transition-colors">About</a>
          <a href="#instructors" className="hover:text-neon-purple dark:hover:text-white transition-colors">Instructors</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          </button>
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="bg-gray-900 text-white dark:bg-white dark:text-deep-space px-6 py-2 rounded-full font-semibold hover:bg-neon-cyan hover:text-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center text-center min-h-screen justify-center">
        <motion.div style={{ y, opacity }} className="z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-sm text-neon-cyan font-medium border-neon-cyan/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            Next-Gen Learning Platform
          </motion.div>
          
          <TypewriterHeading />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-white/60 max-w-2xl mb-12 font-light"
          >
            Elevate your skills with immersive, industry-led courses designed for the modern engineer. No gravity holding you back.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-6"
          >
            <a href="#courses" className="group relative px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full font-bold text-white overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.2)] dark:shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300">
              <span className="relative z-10 flex items-center gap-2">
                Explore Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <button className="px-8 py-4 rounded-full font-bold text-gray-900 dark:text-white glass-panel hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" /> Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="relative z-20 py-32 px-8 max-w-7xl mx-auto bg-gray-50 dark:bg-deep-space">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Featured <span className="text-gradient">Paths</span></h2>
          <p className="text-gray-500 dark:text-white/50">Curated programs to accelerate your career</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <FloatingCard delay={0.1}>
            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-6 text-neon-purple">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Advanced Full-Stack</h3>
            <p className="text-gray-600 dark:text-white/60 mb-6 font-light text-sm">Master Next.js, Node architecture, and cloud deployment in this comprehensive bootcamp.</p>
            <div className="w-full h-48 rounded-lg bg-gradient-to-br from-purple-100 to-gray-200 dark:from-purple-900/40 dark:to-black overflow-hidden mb-6 relative">
               {/* Placeholder for Course Image, utilizing floating effect */}
               <motion.div 
                 animate={{ y: [0, -5, 0] }} 
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-4 bg-white/40 dark:bg-white/5 rounded backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-center"
               >
                 <span className="text-gray-600 dark:text-white/30 text-xs font-semibold">React & Node.js</span>
               </motion.div>
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full py-3 rounded-lg bg-white dark:bg-white/5 hover:bg-neon-purple text-gray-900 dark:text-white hover:text-white transition-colors font-medium border border-gray-200 dark:border-white/10">
              View Syllabus
            </button>
          </FloatingCard>

          {/* Card 2 */}
          <FloatingCard delay={0.3}>
             <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center mb-6 text-neon-cyan">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Web3 & Smart Contracts</h3>
            <p className="text-gray-600 dark:text-white/60 mb-6 font-light text-sm">Dive deep into Solidity, Ethereum, and decentralized application architecture.</p>
            <div className="w-full h-48 rounded-lg bg-gradient-to-br from-cyan-100 to-gray-200 dark:from-cyan-900/40 dark:to-black overflow-hidden mb-6 relative">
               <motion.div 
                 animate={{ y: [0, -5, 0] }} 
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute inset-4 bg-white/40 dark:bg-white/5 rounded backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-center"
               >
                 <span className="text-gray-600 dark:text-white/30 text-xs font-semibold">Solidity & Hardhat</span>
               </motion.div>
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full py-3 rounded-lg bg-white dark:bg-white/5 hover:bg-neon-cyan text-gray-900 dark:text-white hover:text-white transition-colors font-medium border border-gray-200 dark:border-white/10">
              View Syllabus
            </button>
          </FloatingCard>

          {/* Card 3 */}
          <FloatingCard delay={0.5}>
             <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">System Design Pro</h3>
            <p className="text-gray-600 dark:text-white/60 mb-6 font-light text-sm">Learn to architect scalable, resilient systems for millions of concurrent users.</p>
            <div className="w-full h-48 rounded-lg bg-gradient-to-br from-emerald-100 to-gray-200 dark:from-emerald-900/40 dark:to-black overflow-hidden mb-6 relative">
               <motion.div 
                 animate={{ y: [0, -5, 0] }} 
                 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 className="absolute inset-4 bg-white/40 dark:bg-white/5 rounded backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-center"
               >
                 <span className="text-gray-600 dark:text-white/30 text-xs font-semibold">Microservices</span>
               </motion.div>
            </div>
            <button onClick={() => setIsAuthOpen(true)} className="w-full py-3 rounded-lg bg-white dark:bg-white/5 hover:bg-emerald-500 text-gray-900 dark:text-white hover:text-white transition-colors font-medium border border-gray-200 dark:border-white/10">
              View Syllabus
            </button>
          </FloatingCard>
        </div>
      </section>

      {/* Floating Guide Widget */}
      <FloatingGuideWidget />

      {/* Auth Modal Overlay */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default LandingPage;
