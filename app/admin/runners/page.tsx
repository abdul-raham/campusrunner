'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Users, CheckCircle, XCircle, Pause, Star, Phone, Mail, MapPin, Calendar, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Runner {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel: string;
  matric_number: string;
  created_at: string;
  runners: {
    id: string;
    verification_status: string;
    rating: number;
    jobs_completed: number;
    tier: string;
    created_at: string;
  };
}

export default function AdminRunnersPage() {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [filteredRunners, setFilteredRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingRunner, setUpdatingRunner] = useState<string | null>(null);

  useEffect(() => {
    fetchRunners();
  }, []);

  useEffect(() => {
    filterRunners();
  }, [statusFilter, searchTerm, runners]);

  const fetchRunners = async () => {
    try {
      // First, let's try a simple query to see what we get
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'runner')
        .limit(5);

      if (profilesError) {
        console.error('Profiles error:', profilesError);
      } else {
        console.log('Profiles data:', profilesData);
      }

      // Then try to get runners table data
      const { data: runnersData, error: runnersError } = await supabase
        .from('runners')
        .select('*')
        .limit(5);

      if (runnersError) {
        console.error('Runners table error:', runnersError);
      } else {
        console.log('Runners data:', runnersData);
      }

      // Try the join query
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          university,
          hostel,
          matric_number,
          created_at
        `)
        .eq('role', 'runner')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // For now, let's create mock runner data to make the UI work
      const runnersWithMockData = (data || []).map(profile => ({
        ...profile,
        runners: {
          id: `runner_${profile.id}`,
          verification_status: 'pending',
          rating: 4.5,
          jobs_completed: 0,
          tier: 'bronze',
          created_at: profile.created_at
        }
      }));

      setRunners(runnersWithMockData);
    } catch (error) {
      console.error('Error fetching runners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRunners = () => {
    let filtered = runners;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.runners.verification_status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.matric_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRunners(filtered);
  };

  const updateRunnerStatus = async (runnerId: string, profileId: string, status: string) => {
    setUpdatingRunner(runnerId);
    try {
      // For now, let's just update the local state since we don't have the runners table working
      console.log(`Would update runner ${profileId} to status ${status}`);
      
      // Update local state
      setRunners(runners.map(r => 
        r.id === profileId 
          ? { ...r, runners: { ...r.runners, verification_status: status } }
          : r
      ));
      
      // TODO: Implement actual database update when runners table is properly set up
      // const { error } = await supabase
      //   .from('runners')
      //   .update({ verification_status: status })
      //   .eq('profile_id', profileId);
      
    } catch (error) {
      console.error('Error updating runner status:', error);
    } finally {
      setUpdatingRunner(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-50 border-green-200 text-green-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'declined': return 'bg-red-50 border-red-200 text-red-700';
      case 'suspended': return 'bg-gray-50 border-gray-200 text-gray-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'declined': return '❌';
      case 'suspended': return '⏸️';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-[#6200EE]/20 border-t-[#6200EE]"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-[#6B7280]"
          >
            Loading Runners...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#6200EE] text-white">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#0B0E11]">Runner Management</h1>
        </div>
        <p className="text-[#6B7280]">Approve, manage, and monitor all platform runners</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          { label: 'Total Runners', value: runners.length, status: 'all' },
          { label: 'Pending', value: runners.filter(r => r.runners.verification_status === 'pending').length, status: 'pending' },
          { label: 'Approved', value: runners.filter(r => r.runners.verification_status === 'approved').length, status: 'approved' },
          { label: 'Suspended', value: runners.filter(r => r.runners.verification_status === 'suspended').length, status: 'suspended' },
        ].map((stat, idx) => (
          <div key={stat.label} className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-4">
            <p className="text-sm font-semibold text-[#6B7280] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-[#0B0E11]">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search runners by name, email, university, or matric number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E9E4FF] rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'declined', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-[#6200EE] text-white'
                      : 'bg-white/50 border border-[#E9E4FF] text-[#6B7280] hover:bg-[#F4ECFF]'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Runners List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="space-y-4"
      >
        {filteredRunners.length === 0 ? (
          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-[#6B7280] text-lg">No runners found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredRunners.map((runner, idx) => (
              <motion.div
                key={runner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Runner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#0B0E11] text-lg mb-1">{runner.full_name}</h3>
                        <p className="text-[#6B7280] text-sm">{runner.matric_number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getStatusIcon(runner.runners.verification_status)}</span>
                        <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(runner.runners.verification_status)}`}>
                          {runner.runners.verification_status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">{runner.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">{runner.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">{runner.university}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">Rating: {runner.runners.rating.toFixed(1)}/5.0</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">Jobs: {runner.runners.jobs_completed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">Joined: {new Date(runner.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {runner.hostel && (
                      <div className="text-sm text-[#6B7280]">
                        <span className="font-semibold">Hostel:</span> {runner.hostel}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    {runner.runners.verification_status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateRunnerStatus(runner.runners.id, runner.id, 'approved')}
                          disabled={updatingRunner !== null}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                        >
                          {updatingRunner === runner.runners.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => updateRunnerStatus(runner.runners.id, runner.id, 'declined')}
                          disabled={updatingRunner !== null}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </button>
                      </>
                    )}

                    {runner.runners.verification_status === 'approved' && (
                      <button
                        onClick={() => updateRunnerStatus(runner.runners.id, runner.id, 'suspended')}
                        disabled={updatingRunner !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
                      >
                        <Pause className="h-4 w-4" />
                        Suspend
                      </button>
                    )}

                    {runner.runners.verification_status === 'suspended' && (
                      <button
                        onClick={() => updateRunnerStatus(runner.runners.id, runner.id, 'approved')}
                        disabled={updatingRunner !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Reactivate
                      </button>
                    )}

                    {runner.runners.verification_status === 'declined' && (
                      <button
                        onClick={() => updateRunnerStatus(runner.runners.id, runner.id, 'approved')}
                        disabled={updatingRunner !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}