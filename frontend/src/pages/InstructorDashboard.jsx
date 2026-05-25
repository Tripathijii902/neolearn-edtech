import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Video, Image as ImageIcon, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const InstructorDashboard = () => {
  const { createCourse, loading } = useCourseStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    difficulty: 'beginner',
    thumbnailUrl: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createCourse(formData);
    if (success) {
      toast.success("Course created successfully!");
      navigate('/dashboard');
    } else {
      toast.error("Failed to create course.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-neon-cyan transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-white/50 mb-12">Build your curriculum and share your knowledge with the world.</p>

        <form onSubmit={handleSubmit} className="space-y-8 bg-[#111] p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Course Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Advanced Next.js Architecture"
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-purple transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="What will students learn?"
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-purple transition-colors resize-none" 
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-purple transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Difficulty</label>
                  <select 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none"
                  >
                    <option value="beginner" className="bg-deep-space">Beginner</option>
                    <option value="intermediate" className="bg-deep-space">Intermediate</option>
                    <option value="advanced" className="bg-deep-space">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Course Thumbnail URL</label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-cyan transition-colors" 
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">
                  *Cloudinary direct upload integration coming in next update. For now, provide a direct image URL.
                </p>
              </div>

              {formData.thumbnailUrl && (
                 <div className="w-full h-48 rounded-xl bg-black border border-white/10 overflow-hidden relative">
                    <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                 </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
             <button 
               type="submit" 
               disabled={loading}
               className="px-8 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               Publish Course
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default InstructorDashboard;
