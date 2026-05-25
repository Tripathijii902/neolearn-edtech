import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2, BookOpen, GraduationCap, Code, Briefcase, Palette, Microscope, CreditCard, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const slideVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { x: -50, opacity: 0, transition: { duration: 0.2 } }
};

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(0); // 0: Basic, 1: Stream, 2: Class, 3: Course, 4: Payment
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'student', stream: '', classLevel: '', selectedCourse: '' 
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const navigate = useNavigate();
  const { login, register, loading, error } = useAuthStore();

  const handleBaseSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success("Welcome back!");
        onClose();
        navigate('/dashboard');
      }
    } else {
      if (formData.role === 'instructor') {
        // Instructors skip the onboarding wizard
        finalizeRegistration();
      } else {
        // Students proceed to wizard
        setStep(1);
      }
    }
  };

  const finalizeRegistration = async () => {
    const success = await register(
      formData.name, formData.email, formData.password, formData.role, formData.stream, formData.classLevel
    );
    if (success) {
      toast.success("Account created successfully!");
      onClose();
      navigate('/dashboard');
    }
  };

  const processPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      toast.success("Payment successful! Full course unlocked.");
      finalizeRegistration();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { if(step===0) onClose(); }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        ></motion.div>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-4xl min-h-[500px] bg-white dark:bg-[#0a0a16] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col md:flex-row"
        >
          {/* Left Branding Area */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-neon-purple to-neon-cyan p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-neon-purple flex items-center justify-center font-bold text-xl">N</div>
              <span className="text-2xl font-bold text-white tracking-tighter">Neo<span className="text-white/70">Learn</span></span>
            </div>

            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Master the tools of tomorrow.</h3>
              <p className="text-white/80 text-lg">Join thousands of students and instructors pushing the boundaries of tech education.</p>
            </div>
            
            <div className="relative z-10 flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">+2k</div>
            </div>
          </div>

          <div className="relative w-full md:w-1/2 p-8 md:p-12 z-10 flex flex-col justify-center overflow-x-hidden">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:text-white/50 dark:hover:text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {error && step === 0 && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-8">
                    {isLogin ? "Enter your credentials to access your portal." : "Sign up to unlock premium tech education."}
                  </p>

                  <form className="space-y-4" onSubmit={handleBaseSubmit}>
                    {!isLogin && (
                      <>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/30" />
                          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all" required />
                        </div>
                        <div className="flex gap-6 p-1">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-white/70">
                            <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-4 h-4 text-neon-purple focus:ring-neon-purple border-gray-300" />
                            Student
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-white/70">
                            <input type="radio" name="role" value="instructor" checked={formData.role === 'instructor'} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-4 h-4 text-neon-purple focus:ring-neon-purple border-gray-300" />
                            Instructor
                          </label>
                        </div>
                      </>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/30" />
                      <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all" required />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/30" />
                      <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all" required />
                    </div>

                    <button type="submit" disabled={loading} className="w-full py-4 mt-6 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : ( <>{isLogin ? "Sign In" : "Continue"} <ArrowRight className="w-4 h-4" /></> )}
                    </button>
                  </form>

                  <div className="mt-8 text-center text-sm text-gray-500 dark:text-white/50">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-neon-purple dark:text-neon-cyan font-bold hover:underline">
                      {isLogin ? "Sign up for free" : "Sign in here"}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What is your stream?</h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-6">Personalize your learning experience.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'engineering', icon: Code, label: 'Engineering' },
                      { id: 'business', icon: Briefcase, label: 'Business' },
                      { id: 'arts', icon: Palette, label: 'Arts & Design' },
                      { id: 'science', icon: Microscope, label: 'Science' }
                    ].map(stream => (
                      <button 
                        key={stream.id}
                        onClick={() => { setFormData({...formData, stream: stream.id}); setStep(2); }}
                        className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-neon-purple dark:hover:border-neon-purple hover:bg-neon-purple/5 transition-colors"
                      >
                        <stream.icon className="w-8 h-8 text-neon-purple" />
                        <span className="font-semibold text-gray-900 dark:text-white">{stream.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                  <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-neon-purple mb-4">← Back</button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">What is your class?</h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-6">Tailor the difficulty level.</p>
                  
                  <div className="space-y-3">
                    {['freshman', 'sophomore', 'junior', 'senior'].map(lvl => (
                      <button 
                        key={lvl}
                        onClick={() => { setFormData({...formData, classLevel: lvl}); setStep(3); }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-neon-cyan hover:bg-neon-cyan/5 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{lvl} Year</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                  <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-neon-purple mb-4">← Back</button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose a Path</h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-6">Recommended for {formData.stream} students.</p>
                  
                  <div className="space-y-4">
                    <div 
                      onClick={() => { setFormData({...formData, selectedCourse: 'Premium'}); setStep(4); }}
                      className="cursor-pointer group p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-neon-purple transition-all shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">Complete {formData.stream.charAt(0).toUpperCase() + formData.stream.slice(1)} Masterclass</h3>
                        <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs font-bold rounded">₹999</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-white/60">Full lifetime access to all lectures, quizzes, and premium certificates.</p>
                    </div>

                    <div 
                      onClick={() => { setFormData({...formData, selectedCourse: 'Free'}); setStep(4); }}
                      className="cursor-pointer group p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-neon-cyan transition-all shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-neon-cyan transition-colors">Intro to {formData.stream.charAt(0).toUpperCase() + formData.stream.slice(1)}</h3>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded">FREE</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-white/60">Basic access with introductory sessions and personalized static notes.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                  <button onClick={() => setStep(3)} className="text-sm text-gray-500 hover:text-neon-purple mb-4">← Back</button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formData.selectedCourse === 'Premium' ? 'Complete Purchase' : 'Start Free Trial'}
                  </h2>
                  <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
                    {formData.selectedCourse === 'Premium' ? 'Enter mock payment details.' : 'No credit card required.'}
                  </p>
                  
                  {formData.selectedCourse === 'Premium' ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <div className="flex items-center gap-3 text-gray-500 mb-4">
                          <CreditCard className="w-5 h-5" />
                          <span className="text-sm">Mock Credit Card (Don't enter real data)</span>
                        </div>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-gray-900 dark:text-white mb-3 outline-none" />
                        <div className="flex gap-3">
                          <input type="text" placeholder="MM/YY" className="flex-1 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-gray-900 dark:text-white outline-none" />
                          <input type="text" placeholder="CVC" className="flex-1 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg py-2 px-3 text-gray-900 dark:text-white outline-none" />
                        </div>
                      </div>
                      <button 
                        onClick={processPayment}
                        disabled={isProcessingPayment}
                        className="w-full py-4 bg-neon-purple hover:bg-neon-purple/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                      >
                        {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay ₹999'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-neon-cyan/20 text-neon-cyan rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlayCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all set!</h3>
                      <p className="text-gray-500 dark:text-white/60 mb-8">We've prepared your personalized notes for the intro session.</p>
                      <button 
                        onClick={finalizeRegistration}
                        disabled={loading}
                        className="w-full py-4 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Free Sessions'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
