import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, CheckCircle2, Circle, ArrowLeft, Maximize2, MessageSquare, Save, BookOpen, Edit3, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const getCourseData = (stream) => {
  const s = stream?.toLowerCase() || 'general';
  
  const templates = {
    engineering: {
      title: "Complete Engineering Masterclass",
      modules: [
        {
          id: 1, title: "Module 1: Logic & Algorithms",
          lessons: [
            { id: 101, title: "Data Structures 101", duration: "12:45", completed: true },
            { id: 102, title: "Algorithm Optimization", duration: "18:20", completed: true },
            { id: 103, title: "System Design Basics", duration: "25:10", completed: false },
          ]
        },
        {
          id: 2, title: "Module 2: Advanced Concepts",
          lessons: [
            { id: 201, title: "Scalability", duration: "15:30", completed: false },
            { id: 202, title: "Microservices", duration: "22:15", completed: false },
          ]
        }
      ]
    },
    business: {
      title: "Complete Business Masterclass",
      modules: [
        {
          id: 1, title: "Module 1: Market Analysis",
          lessons: [
            { id: 101, title: "Understanding Markets", duration: "12:45", completed: true },
            { id: 102, title: "Competitor Research", duration: "18:20", completed: true },
            { id: 103, title: "ROI Strategies", duration: "25:10", completed: false },
          ]
        },
        {
          id: 2, title: "Module 2: Advanced Finance",
          lessons: [
            { id: 201, title: "Valuation", duration: "15:30", completed: false },
            { id: 202, title: "Mergers & Acquisitions", duration: "22:15", completed: false },
          ]
        }
      ]
    },
  };

  return templates[s] || {
    title: "Introductory Masterclass",
    modules: [
      {
        id: 1, title: "Module 1: Core Fundamentals",
        lessons: [
          { id: 101, title: "Introduction", duration: "12:45", completed: true },
          { id: 102, title: "Core Concepts", duration: "18:20", completed: true },
          { id: 103, title: "Practical Application", duration: "25:10", completed: false },
        ]
      },
      {
        id: 2, title: "Module 2: Next Steps",
        lessons: [
          { id: 201, title: "Advanced Topics", duration: "15:30", completed: false },
          { id: 202, title: "Final Project", duration: "22:15", completed: false },
        ]
      }
    ]
  };
};

const CoursePlayer = () => {
  const [activeLesson, setActiveLesson] = useState(103);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, quiz
  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState('');
  
  // Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const { enrolledCourses } = useCourseStore();
  const { token, user } = useAuthStore();
  const courseId = enrolledCourses[0]?._id;

  const courseData = getCourseData(user?.stream);

  useEffect(() => {
    if (!noteText) {
      let template = '';
      switch (user?.stream?.toLowerCase()) {
        case 'engineering':
          template = "Welcome to your Engineering Free Session!\n\nBasic Info:\n- Focus on logical problem solving.\n- Remember to optimize your algorithms.\n- Ask questions in the discussion tab!\n\nYour Notes:\n";
          break;
        case 'business':
          template = "Welcome to your Business Free Session!\n\nBasic Info:\n- Focus on market analysis.\n- Remember to check the ROI.\n- Ask questions in the discussion tab!\n\nYour Notes:\n";
          break;
        case 'arts':
          template = "Welcome to your Arts Free Session!\n\nBasic Info:\n- Focus on color theory and layout.\n- Remember to stay creative.\n- Ask questions in the discussion tab!\n\nYour Notes:\n";
          break;
        case 'science':
          template = "Welcome to your Science Free Session!\n\nBasic Info:\n- Focus on the scientific method.\n- Remember to record your hypotheses.\n- Ask questions in the discussion tab!\n\nYour Notes:\n";
          break;
        default:
          template = "Welcome to your Free Session!\n\nBasic Info:\n- Take detailed notes here.\n- Ask questions in the discussion tab!\n\nYour Notes:\n";
      }
      setNoteText(template);
    }
  }, [user, noteText]);

  const handleSaveNote = () => {
    setSavedNote(noteText);
    toast.success('Note saved securely to local storage (mock)!');
  };

  const handleQuizSubmit = async () => {
    const passed = selectedAnswer === 1;
    const score = passed ? 100 : 0;
    
    if (passed) {
      setQuizResult('correct');
      toast.success("Quiz passed! Score saved.");
    } else {
      setQuizResult('incorrect');
      toast.error("Incorrect answer. Please review the material.");
    }

    if (courseId && token) {
      try {
        await axios.post(`http://localhost:5000/api/v1/enroll/${courseId}/quiz`, { score, passed }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to save quiz score:", error);
        toast.error("Could not save score to database.");
      }
    }
  };

  return (
    <div className="h-screen bg-black flex overflow-hidden font-sans text-white">
      {/* Left Column: Sidebar Curriculum */}
      <motion.div 
        animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="h-full bg-black border-r border-white/10 flex-shrink-0 flex flex-col z-20 overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-neon-cyan transition-colors text-sm font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h2 className="text-xl font-bold leading-tight">{courseData.title}</h2>
          
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-neon-purple to-neon-cyan w-2/5 h-full rounded-full"></div>
            </div>
            <span className="text-white/50">40%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {courseData.modules.map(module => (
            <div key={module.id} className="mb-6">
              <h3 className="px-6 text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
                {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => { setActiveLesson(lesson.id); setActiveTab('overview'); }}
                    className={`w-full text-left px-6 py-3 flex items-start gap-3 transition-colors ${
                      activeLesson === lesson.id 
                        ? 'bg-neon-purple/10 border-l-2 border-neon-purple' 
                        : 'hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        activeLesson === lesson.id ? 
                        <PlayCircle className="w-5 h-5 text-neon-purple" /> :
                        <Circle className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${activeLesson === lesson.id ? 'text-white' : 'text-white/70'}`}>
                        {lesson.title}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{lesson.duration}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Center Column: Main Video Area */}
      <div className="flex-1 flex flex-col relative bg-black overflow-hidden">
        {/* Top Navbar */}
        <div className="w-full p-4 flex justify-between items-center z-10 bg-black/40 border-b border-white/5 absolute top-0 left-0 right-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Toggle Notes
          </button>
        </div>

        {/* Real Video Player */}
        <div className="w-full h-full relative flex items-center justify-center pt-16">
           <video 
             className="w-full h-full object-contain"
             controls
             autoPlay
             src="/demo-lecture.mp4"
           >
             Your browser does not support the video tag.
           </video>
        </div>
      </div>

      {/* Right Column: Interactive Panel */}
      <motion.div 
        animate={{ width: rightPanelOpen ? 450 : 0, opacity: rightPanelOpen ? 1 : 0 }}
        className="h-full bg-black border-l border-white/10 flex-shrink-0 flex flex-col overflow-hidden"
      >
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'overview' ? 'text-neon-cyan' : 'text-white/50 hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4" /> Overview
              {activeTab === 'overview' && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-neon-cyan"></motion.div>}
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'notes' ? 'text-neon-cyan' : 'text-white/50 hover:text-white'}`}
            >
              <Edit3 className="w-4 h-4" /> My Notes
              {activeTab === 'notes' && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-neon-cyan"></motion.div>}
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'quiz' ? 'text-neon-cyan' : 'text-white/50 hover:text-white'}`}
            >
              <HelpCircle className="w-4 h-4" /> Quiz
              {activeTab === 'quiz' && <motion.div layoutId="tab-indicator" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-neon-cyan"></motion.div>}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="overview">
                <h1 className="text-3xl font-bold mb-2">{courseData.modules[0].lessons[2].title}</h1>
                <p className="text-white/50 mb-8">In this lesson, we cover advanced concepts related to {user?.stream || 'your stream'} and how to effectively apply them in real-world scenarios.</p>
                
                <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
                <ul className="list-disc list-inside space-y-2 text-white/70">
                  <li>Understanding core {user?.stream || 'fundamentals'}</li>
                  <li>Implementing advanced strategies</li>
                  <li>Applying theoretical knowledge</li>
                  <li>Testing and verifying results</li>
                </ul>

                <button className="mt-8 w-full px-6 py-4 bg-neon-purple hover:bg-neon-purple/80 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <CheckCircle2 className="w-5 h-5" /> Mark as Complete
                </button>
              </motion.div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="notes">
                <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold mb-4">Lesson Notes</h3>
                  <textarea 
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none mb-4"
                    placeholder="Type your notes here..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/40">Autosaves locally</span>
                    <button onClick={handleSaveNote} className="px-4 py-2 bg-white/10 hover:bg-neon-cyan hover:text-black rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>

                {savedNote && (
                  <div className="mt-8">
                    <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">Saved Notes</h4>
                    <div className="p-4 bg-neon-cyan/5 border-l-2 border-neon-cyan rounded-r-lg text-white/80 whitespace-pre-wrap">
                      {savedNote}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="quiz">
                <div className="bg-[#111] p-6 rounded-2xl border border-neon-purple/30">
                  <h3 className="text-xl font-bold mb-2">Knowledge Check</h3>
                  <p className="text-white/50 mb-6 text-sm">Test your understanding of this lesson.</p>
                  
                  <div className="space-y-6">
                    <p className="font-medium">Q: What is the primary benefit of mastering {user?.stream || 'these'} concepts?</p>
                    
                    <div className="space-y-3">
                      {[
                        { id: 0, text: "It reduces the amount of work needed." },
                        { id: 1, text: "It allows for efficient problem solving and higher quality outcomes." },
                        { id: 2, text: "It is required for basic operations." },
                      ].map((ans) => (
                        <div 
                          key={ans.id}
                          onClick={() => setSelectedAnswer(ans.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAnswer === ans.id ? 'border-neon-cyan bg-neon-cyan/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex-shrink-0 border flex items-center justify-center ${selectedAnswer === ans.id ? 'border-neon-cyan' : 'border-white/30'}`}>
                              {selectedAnswer === ans.id && <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan"></div>}
                            </div>
                            <span className="text-sm">{ans.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {quizResult && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-4 rounded-xl border text-sm ${quizResult === 'correct' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-red-500/20 border-red-500 text-red-200'}`}>
                        {quizResult === 'correct' ? '✅ Correct! Great job.' : '❌ Incorrect. Please review the video and try again.'}
                      </motion.div>
                    )}

                    <button 
                      onClick={handleQuizSubmit}
                      disabled={selectedAnswer === null}
                      className="mt-6 w-full py-3 bg-white text-black hover:bg-neon-cyan hover:text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CoursePlayer;
