import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Activity, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch admin stats');
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-deep-space flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-deep-space flex flex-col items-center justify-center text-red-500 transition-colors duration-500">
        <p className="text-xl font-bold mb-4">{error}</p>
        <Link to="/dashboard" className="text-neon-cyan hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  // Format Recharts data
  const roleData = stats?.usersByRole?.map(r => ({
    name: r._id.charAt(0).toUpperCase() + r._id.slice(1),
    count: r.count
  })) || [];

  // Mock enrollment growth data for the visual chart
  const growthData = [
    { month: 'Jan', enrollments: 12 },
    { month: 'Feb', enrollments: 25 },
    { month: 'Mar', enrollments: 45 },
    { month: 'Apr', enrollments: 68 },
    { month: 'May', enrollments: stats?.totalEnrollments || 85 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-deep-space text-gray-900 dark:text-white p-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 dark:text-white/50 hover:text-neon-cyan transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
        <p className="text-gray-500 dark:text-white/50 mb-12">High-level analytics and system administration.</p>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-neon-purple/10 text-neon-purple">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-gray-500 dark:text-white/50">Total Registered Users</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-neon-cyan/10 text-neon-cyan">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalCourses || 0}</div>
              <div className="text-sm text-gray-500 dark:text-white/50">Published Courses</div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 shadow-sm dark:shadow-none">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalEnrollments || 0}</div>
              <div className="text-sm text-gray-500 dark:text-white/50">Total Course Enrollments</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Chart */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Enrollment Growth</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 16, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area type="monotone" dataKey="enrollments" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorEnrollments)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Users By Role Chart */}
          <div className="bg-white dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-none">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">User Distribution</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                  <YAxis stroke="currentColor" className="text-gray-500 dark:text-white/50 text-xs" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(5, 5, 16, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
