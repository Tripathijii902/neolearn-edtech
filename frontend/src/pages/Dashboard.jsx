import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Award, PlayCircle, Settings, LogOut, LayoutDashboard, User, PlusCircle, Search, Filter, Sun, Moon, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FloatingGuideWidget from '../components/ui/FloatingGuideWidget';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCourseStore from '../store/courseStore';
import useThemeStore from '../store/themeStore';
import toast from 'react-hot-toast';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const analyticsData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 5 },
  { name: 'Fri', hours: 4 },
  { name: 'Sat', hours: 7 },
  { name: 'Sun', hours: 6 },
];

const instructorAnalytics = [
  { name: 'Mon', enrollments: 12 },
  { name: 'Tue', enrollments: 19 },
  { name: 'Wed', enrollments: 15 },
  { name: 'Thu', enrollments: 25 },
  { name: 'Fri', enrollments: 22 },
  { name: 'Sat', enrollments: 30 },
  { name: 'Sun', enrollments: 28 },
];

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { courses, fetchCourses, loading, enrolledCourses, fetchEnrolledCourses, enrollInCourse } = useCourseStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const certificateRef = useRef(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Theme State
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, [fetchCourses, fetchEnrolledCourses]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEnroll = async (courseId, e) => {
    e.preventDefault();
    const success = await enrollInCourse(courseId);
    if (success) {
      toast.success("Successfully enrolled! You can now access this course.");
      fetchEnrolledCourses();
    } else {
      toast.error("Failed to enroll. You might already be enrolled.");
    }
  };

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;
    
    toast.loading('Generating your high-quality certificate...', { id: 'cert' });
    
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`${user?.name?.replace(/\s+/g, '_') || 'Student'}_Certificate.pdf`);
      
      toast.success('Certificate downloaded successfully!', { id: 'cert' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate certificate', { id: 'cert' });
    }
  };

  // Derived state for filtering
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Helper to check if enrolled
  const isEnrolled = (courseId) => enrolledCourses.some(c => c._id === courseId);

  // We use dark: prefixes heavily assuming HTML has class="dark"
  // If not, it falls back to light mode colors
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-deep-space text-gray-900 dark:text-white flex overflow-hidden transition-colors duration-500">
      {/* Background Ambient Elements (Only visible in dark mode typically, but let's keep them) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none hidden dark:block">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 relative z-20 hidden lg:flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-black/20 backdrop-blur-xl rounded-none shadow-none min-h-screen pt-8 pb-6 px-4 transition-colors duration-500">
        <div className="mb-12 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center font-bold text-sm text-white">
            N
          </div>
          <div className="text-xl font-bold tracking-tighter dark:text-white text-gray-900">
            Neo<span className="text-neon-cyan">Learn</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <div onClick={() => setActiveTab('dashboard')} className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 dark:bg-white/10 text-neon-cyan dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent dark:border-white/10' : 'text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-neon-cyan' : ''}`} /> Dashboard
          </div>
          <div onClick={() => setActiveTab('my-courses')} className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors ${activeTab === 'my-courses' ? 'bg-gray-100 dark:bg-white/10 text-neon-purple dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent dark:border-white/10' : 'text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <BookOpen className={`w-5 h-5 ${activeTab === 'my-courses' ? 'text-neon-purple' : ''}`} /> My Courses
          </div>
          <div onClick={() => setActiveTab('certificates')} className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors ${activeTab === 'certificates' ? 'bg-gray-100 dark:bg-white/10 text-emerald-500 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent dark:border-white/10' : 'text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <Award className={`w-5 h-5 ${activeTab === 'certificates' ? 'text-emerald-400' : ''}`} /> Certificates
          </div>
          
          {(user?.role?.toLowerCase() === 'instructor' || user?.role?.toLowerCase() === 'admin') && (
            <Link to="/instructor/courses/new" className="px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-neon-purple mt-4 border border-transparent hover:border-neon-purple/30">
              <PlusCircle className="w-5 h-5 text-neon-purple" /> Instructor Panel
            </Link>
          )}

          {user?.role?.toLowerCase() === 'admin' && (
            <Link to="/admin" className="px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-neon-cyan mt-2 border border-transparent hover:border-neon-cyan/30">
              <Activity className="w-5 h-5 text-neon-cyan" /> Admin Analytics
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-2 pt-8 border-t border-gray-200 dark:border-white/10">
          <div onClick={() => setActiveTab('settings')} className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-colors ${activeTab === 'settings' ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-transparent dark:border-white/10' : 'text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-gray-900 dark:text-white' : ''}`} /> Settings
          </div>
          <div onClick={() => setIsLogoutModalOpen(true)} className="px-4 py-3 rounded-xl text-red-500 dark:text-red-400/80 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 font-medium flex items-center gap-3 cursor-pointer transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-8 lg:p-12 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <p className="text-gray-500 dark:text-white/50 text-sm">Pick up right where you left off.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-4">
            <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-sm">{user?.name || 'Neo Student'}</div>
              <div className="text-xs text-neon-purple dark:text-neon-cyan">{user?.role || 'Pro Student'}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-neon-purple/30 overflow-hidden flex items-center justify-center shadow-sm">
               <User className="w-6 h-6 text-gray-400 dark:text-white/50" />
            </div>
          </motion.div>
        </header>

        {/* Dynamic Content Views */}
        {activeTab === 'dashboard' && user?.role?.toLowerCase() === 'instructor' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Quick Actions */}
            <div className="mb-12">
              <Link to="/instructor/courses/new" className="block w-full bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 rounded-3xl p-8 hover:border-neon-cyan transition-colors text-center shadow-lg">
                <PlusCircle className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create New Course</h3>
                <p className="text-gray-500 dark:text-white/70">Start building your next masterpiece and share your knowledge.</p>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Total Earnings', value: '₹45,000', icon: Award, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Active Students', value: '1,240', icon: User, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
                { label: 'Avg Rating', value: '4.8', icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:border-gray-200 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-white/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enrollments Chart */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none mb-12">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Enrollments Over Time</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={instructorAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                    <XAxis dataKey="name" stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                    <YAxis stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5, 5, 16, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#06b6d4' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="enrollments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'dashboard' && user?.role?.toLowerCase() !== 'instructor' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Courses in Progress', value: enrolledCourses.length || '0', icon: BookOpen, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
                { label: 'Hours Learned', value: '42.5', icon: Clock, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
                { label: 'Certificates Earned', value: '1', icon: Award, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:border-gray-200 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-white/50">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Activity Chart */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none mb-12">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Learning Activity</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                    <XAxis dataKey="name" stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                    <YAxis stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(5, 5, 16, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#8b5cf6' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Advanced Search & Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Available Courses
              </h2>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-colors shadow-sm dark:shadow-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-8 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none shadow-sm dark:shadow-none cursor-pointer"
                  >
                    <option value="all" className="dark:bg-deep-space">All Levels</option>
                    <option value="beginner" className="dark:bg-deep-space">Beginner</option>
                    <option value="intermediate" className="dark:bg-deep-space">Intermediate</option>
                    <option value="advanced" className="dark:bg-deep-space">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
               <div className="text-gray-500 dark:text-white/50">Loading courses...</div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredCourses.map((course) => {
                  const enrolled = isEnrolled(course._id);
                  return (
                  <div key={course._id} className="group relative bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 overflow-hidden hover:border-neon-purple/50 transition-colors shadow-md dark:shadow-none">
                    {/* Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/0 to-neon-cyan/0 group-hover:from-neon-purple/5 group-hover:to-neon-cyan/5 transition-all duration-500"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                      {/* Course Thumbnail */}
                      <div className="w-full sm:w-48 h-32 rounded-xl bg-gradient-to-br from-purple-900 to-black relative overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                        <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000'} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-80 dark:opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                          <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform shadow-2xl rounded-full" />
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-xs font-semibold text-neon-purple mb-1 flex items-center justify-between">
                             <span>{course.instructor?.name ? `BY ${course.instructor.name.toUpperCase()}` : 'NEW COURSE'}</span>
                             <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 text-[10px] uppercase tracking-wider">{course.difficulty || 'beginner'}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-neon-cyan transition-colors">{course.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-white/50 line-clamp-2 mb-4">{course.description}</p>
                        </div>

                        {/* Action Area */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                          <span className="text-neon-purple dark:text-neon-cyan font-bold">₹{course.price === 0 ? 'FREE' : course.price}</span>
                          
                          {enrolled ? (
                            <Link to="/player" className="px-4 py-2 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 text-neon-purple dark:text-white rounded-lg text-sm font-semibold hover:bg-neon-purple hover:text-white transition-colors">
                              Continue Learning
                            </Link>
                          ) : (
                            <button 
                              onClick={(e) => handleEnroll(course._id, e)}
                              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-neon-purple dark:hover:bg-neon-cyan transition-colors"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
                {filteredCourses.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-gray-500 dark:text-white/50">
                    No courses found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'my-courses' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>
            
            {enrolledCourses.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Link to="/player">
                  <div className="bg-white dark:bg-white/5 border border-neon-purple/50 dark:border-neon-purple/50 rounded-2xl overflow-hidden hover:border-neon-cyan/50 transition-colors group shadow-lg dark:shadow-[0_0_15px_rgba(139,92,246,0.15)] relative">
                    <div className="absolute top-2 right-2 bg-neon-purple text-white text-xs font-bold px-2 py-1 rounded-md z-10">DEMO</div>
                    <div className="h-40 bg-gray-200 dark:bg-black relative">
                      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97" className="w-full h-full object-cover opacity-80 dark:opacity-60" alt="Demo Course" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                        <PlayCircle className="w-12 h-12 text-white shadow-2xl" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">Demo: React Architecture Masterclass</h3>
                      <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 mb-2">
                        <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full w-1/4"></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-white/50 text-right">25% Complete</div>
                      <p className="text-xs text-gray-500 dark:text-white/50 mt-4">Click to test the video player, notes, and quiz system!</p>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {enrolledCourses.map(course => (
                   <Link to="/player" key={course._id}>
                     <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-neon-purple/50 transition-colors group shadow-sm dark:shadow-none">
                       <div className="h-40 bg-gray-200 dark:bg-black relative">
                         <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'} className="w-full h-full object-cover opacity-80 dark:opacity-60" alt="" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                           <PlayCircle className="w-12 h-12 text-white shadow-2xl" />
                         </div>
                       </div>
                       <div className="p-6">
                         <h3 className="font-bold text-lg mb-2 group-hover:text-neon-purple transition-colors">{course.title}</h3>
                         <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-2 mb-2">
                           <div className="bg-gradient-to-r from-neon-purple to-neon-cyan h-2 rounded-full w-1/4"></div>
                         </div>
                         <div className="text-xs text-gray-500 dark:text-white/50 text-right">25% Complete</div>
                       </div>
                     </div>
                   </Link>
                 ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-6">My Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden group shadow-md dark:shadow-none">
                 <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-20 group-hover:opacity-100 transition-opacity">
                    <Award className="w-32 h-32 text-emerald-500 dark:text-emerald-400" />
                 </div>
                 <div className="relative z-10">
                   <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-4">Verified Certificate</div>
                   <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">React Architecture Masterclass</h3>
                   <p className="text-gray-500 dark:text-white/60 mb-8">Issued on May 24, 2026</p>
                   <button onClick={downloadCertificate} className="px-6 py-2 bg-emerald-50 dark:bg-white/10 text-emerald-600 dark:text-white border border-emerald-200 dark:border-transparent hover:bg-emerald-500 hover:text-white rounded-xl font-medium transition-colors">Download PDF</button>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            <div className="max-w-xl bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
               <div className="space-y-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Display Name</label>
                   <input type="text" defaultValue={user?.name} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-colors" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-2">Email Address</label>
                   <input type="email" defaultValue={user?.email} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 px-4 text-gray-900 dark:text-white focus:outline-none focus:border-neon-purple transition-colors" />
                 </div>
                 <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                   <button className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-xl hover:bg-neon-purple hover:text-white shadow-md transition-colors">Save Changes</button>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </main>

      <FloatingGuideWidget />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-deep-space rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10 z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
              <p className="text-gray-500 dark:text-white/60 mb-8 text-sm">Do you really want to log out of your NeoLearn account?</p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden Certificate Template for PDF Generation */}
      <div className="fixed top-[-10000px] left-[-10000px]">
        <div 
          ref={certificateRef}
          className="w-[1122px] h-[793px] bg-white text-black p-12 flex flex-col items-center justify-center relative overflow-hidden"
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Decorative borders */}
          <div className="absolute inset-8 border-[12px] border-emerald-500/20 rounded-xl"></div>
          <div className="absolute inset-12 border-2 border-emerald-500/40 rounded-lg"></div>
          
          <div className="mb-12 flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-xl">N</div>
            <h1 className="text-6xl font-bold tracking-tighter text-gray-900">Neo<span className="text-neon-cyan">Learn</span></h1>
          </div>
          
          <h2 className="text-[64px] text-gray-800 font-serif mb-12 uppercase tracking-widest text-center" style={{ fontFamily: 'Georgia, serif' }}>Certificate of Completion</h2>
          
          <p className="text-2xl text-gray-500 mb-6 italic">This is to certify that</p>
          <h3 className="text-6xl font-bold text-neon-purple mb-12 border-b-2 border-gray-300 pb-4 px-24 text-center">{user?.name || 'Neo Student'}</h3>
          
          <p className="text-2xl text-gray-500 mb-6 italic">has successfully completed the course</p>
          <h4 className="text-5xl font-bold text-gray-800 mb-20 text-center">React Architecture Masterclass</h4>
          
          <div className="flex w-full justify-between px-32 mt-auto">
            <div className="text-center">
              <div className="border-b border-gray-400 pb-2 mb-2 w-48 text-xl font-bold">May 24, 2026</div>
              <div className="text-gray-500 uppercase tracking-widest text-sm">Issue Date</div>
            </div>
            
            <div className="text-center">
              <div className="border-b border-gray-400 pb-2 mb-2 w-48 text-3xl font-bold text-emerald-600" style={{ fontFamily: 'cursive' }}>Anurag T.</div>
              <div className="text-gray-500 uppercase tracking-widest text-sm">Lead Instructor</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
