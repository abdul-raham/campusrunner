'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Student {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeThisMonth: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, university, created_at')
        .eq('role', 'student');

      if (profileError) throw profileError;

      // Get order stats for each student
      const studentsWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('final_amount, created_at')
            .eq('student_id', profile.id);

          const orderCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            university: profile.university,
            created_at: profile.created_at,
            order_count: orderCount,
            total_spent: totalSpent
          };
        })
      );

      setStudents(studentsWithStats);

      // Calculate stats
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const activeThisMonth = studentsWithStats.filter(s => {
        const createdDate = new Date(s.created_at);
        return createdDate >= thisMonthStart;
      }).length;

      const totalSpent = studentsWithStats.reduce((sum, s) => sum + s.total_spent, 0);

      setStats({
        totalStudents: studentsWithStats.length,
        activeThisMonth,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-[#6200EE] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-black text-[#0B0E11]">Student Management</h1>
        <p className="text-[#6B7280] mt-2">View and manage all students</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#6B7280] font-semibold">Total Students</p>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0B0E11]">{stats.totalStudents}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#6B7280] font-semibold">Active This Month</p>
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0B0E11]">{stats.activeThisMonth}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#6B7280] font-semibold">Total Spent</p>
            <div className="p-2 rounded-lg bg-purple-100">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-[#0B0E11]">₦{(stats.totalSpent || 0).toLocaleString()}</p>
        </motion.div>
      </motion.div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {students.length === 0 ? (
          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-12 text-center">
            <p className="text-[#6B7280]">No students found</p>
          </div>
        ) : (
          students.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Student Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0B0E11] text-lg mb-1">{student.full_name}</h3>
                  <div className="space-y-1 text-sm text-[#6B7280]">
                    <p>📧 {student.email}</p>
                    <p>📱 {student.phone}</p>
                    <p>🎓 {student.university}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 lg:gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#0B0E11]">{student.order_count}</p>
                    <p className="text-xs font-semibold text-[#6B7280]">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#0B0E11]">₦{(student.total_spent || 0).toLocaleString()}</p>
                    <p className="text-xs font-semibold text-[#6B7280]">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[#6B7280]">Joined</p>
                    <p className="text-sm font-semibold text-[#0B0E11]">{new Date(student.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
