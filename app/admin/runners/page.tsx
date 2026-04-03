'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Pause, Star, Phone, Mail, MapPin, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Runner {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  hostel_location: string | null;
  matric_number: string | null;
  created_at: string;
  runners: {
    id: string;
    verification_status: string;
    rating: number;
    total_jobs: number;
    runner_tier: string;
    student_id_number: string | null;
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
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null);

  useEffect(() => {
    fetchRunners();
  }, []);

  useEffect(() => {
    filterRunners();
  }, [statusFilter, searchTerm, runners]);

  const fetchRunners = async () => {
    try {
      const res = await fetch('/api/admin/runners');
      if (!res.ok) throw new Error('Failed to load runners');
      const data = await res.json();
      setRunners(data.runners || []);
    } catch (error) {
      console.error('Error fetching runners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRunners = () => {
    let filtered = runners;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.runners?.verification_status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.full_name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.university.toLowerCase().includes(term) ||
        (r.matric_number || '').toLowerCase().includes(term) ||
        (r.runners?.student_id_number || '').toLowerCase().includes(term)
      );
    }

    setFilteredRunners(filtered);
  };

  const updateRunnerStatus = async (runnerId: string, profileId: string, status: string) => {
    setUpdatingRunner(runnerId);
    try {
      const res = await fetch('/api/admin/runners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, status }),
      });

      if (!res.ok) throw new Error('Failed to update runner status');

      const normalizedStatus = status === 'declined' ? 'rejected' : status;
      setRunners(runners.map(r =>
        r.id === profileId
          ? { ...r, runners: { ...r.runners, verification_status: normalizedStatus } }
          : r
      ));
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
      case 'declined':
      case 'rejected': return 'bg-red-50 border-red-200 text-red-700';
      case 'suspended': return 'bg-gray-50 border-gray-200 text-gray-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-500"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-slate-500"
          >
            Loading Runners...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500 text-white">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Runner Management</h1>
        </div>
        <p className="text-slate-500">Approve, manage, and monitor all platform runners</p>
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
          { label: 'Pending', value: runners.filter(r => r.runners?.verification_status === 'pending').length, status: 'pending' },
          { label: 'Approved', value: runners.filter(r => r.runners?.verification_status === 'approved').length, status: 'approved' },
          { label: 'Suspended', value: runners.filter(r => r.runners?.verification_status === 'suspended').length, status: 'suspended' },
        ].map((stat, idx) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
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
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search runners by name, email, university, or matric number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'declined', 'rejected', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-amber-500 text-white'
                      : 'bg-white/50 border border-slate-200/80 text-slate-500 hover:bg-white'
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
          <div className="glass-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-slate-500 text-lg">No runners found</p>
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
                className="glass-card p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Runner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{runner.full_name}</h3>
                        <p className="text-slate-500 text-sm">{runner.matric_number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(runner.runners.verification_status)}`}>
                          {runner.runners.verification_status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">{runner.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">{runner.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">{runner.university}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">Rating: {(runner.runners.rating  0).toFixed(1)}/5.0</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">Jobs: {runner.runners.total_jobs}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">Joined: {new Date(runner.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {runner.hostel_location && (
                      <div className="text-sm text-slate-500">
                        <span className="font-semibold">Hostel:</span> {runner.hostel_location}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => setSelectedRunner(runner)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200/80 text-slate-900 rounded-xl font-semibold hover:bg-white transition-all"
                    >
                      View Credentials
                    </button>
                    {runner.runners.verification_status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateRunnerStatus(runner.runners.id || runner.id, runner.id, 'approved')}
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
                          onClick={() => updateRunnerStatus(runner.runners.id || runner.id, runner.id, 'declined')}
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
                        onClick={() => updateRunnerStatus(runner.runners.id || runner.id, runner.id, 'suspended')}
                        disabled={updatingRunner !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all disabled:opacity-50"
                      >
                        <Pause className="h-4 w-4" />
                        Suspend
                      </button>
                    )}

                    {runner.runners.verification_status === 'suspended' && (
                      <button
                        onClick={() => updateRunnerStatus(runner.runners.id || runner.id, runner.id, 'approved')}
                        disabled={updatingRunner !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Reactivate
                      </button>
                    )}

                    {(runner.runners.verification_status === 'declined' || runner.runners.verification_status === 'rejected') && (
                      <button
                        onClick={() => updateRunnerStatus(runner.runners.id || runner.id, runner.id, 'approved')}
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

      {/* Credentials Modal */}
      <AnimatePresence>
        {selectedRunner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRunner(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-6 max-w-lg w-full"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-black text-slate-900">Runner Credentials</h3>
                <p className="text-slate-500 text-sm">Review details before approval</p>
              </div>

              <div className="space-y-3 text-sm">
                <div><span className="font-semibold">Name:</span> {selectedRunner.full_name}</div>
                <div><span className="font-semibold">Email:</span> {selectedRunner.email}</div>
                <div><span className="font-semibold">Phone:</span> {selectedRunner.phone}</div>
                <div><span className="font-semibold">University:</span> {selectedRunner.university}</div>
                <div><span className="font-semibold">Hostel/Location:</span> {selectedRunner.hostel_location || 'N/A'}</div>
                <div><span className="font-semibold">Matric Number:</span> {selectedRunner.matric_number || 'N/A'}</div>
                <div><span className="font-semibold">Student ID:</span> {selectedRunner.runners.student_id_number || 'N/A'}</div>
                <div><span className="font-semibold">Status:</span> {selectedRunner.runners.verification_status}</div>
                <div><span className="font-semibold">Joined:</span> {new Date(selectedRunner.created_at).toLocaleDateString()}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedRunner(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {selectedRunner.runners.verification_status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        updateRunnerStatus(selectedRunner.runners.id || selectedRunner.id, selectedRunner.id, 'approved');
                        setSelectedRunner(null);
                      }}
                      disabled={updatingRunner !== null}
                      className="flex-1 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        updateRunnerStatus(selectedRunner.runners.id || selectedRunner.id, selectedRunner.id, 'declined');
                        setSelectedRunner(null);
                      }}
                      disabled={updatingRunner !== null}
                      className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
