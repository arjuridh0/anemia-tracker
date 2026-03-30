import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  Key, 
  BarChart3, 
  Download, 
  RefreshCw, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#16a34a', '#ea580c', '#dc2626', '#9333ea'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [respondents, setRespondents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [generateCount, setGenerateCount] = useState(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const correctPassword = 'nelysa123';

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Password salah!');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Respondents
      const { data: resData, error: resError } = await supabase
        .from('respondents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (resError) throw resError;
      
      // Fetch Codes
      const { data: codeData, error: codeError } = await supabase
        .from('respondent_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (codeError) throw codeError;
      
      setRespondents(resData || []);
      setCodes(codeData || []);
    } catch (err) {
      console.error('Supabase Error:', err);
      setError(err.message || 'Gagal menarik data dari database.');
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    setLoading(true);
    setError(null);
    const newCodes = [];
    for (let i = 0; i < generateCount; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      newCodes.push({ code });
    }
    
    try {
      const { error: err } = await supabase.from('respondent_codes').insert(newCodes);
      if (err) throw err;
      await fetchData();
      alert(`${generateCount} kode berhasil dibuat!`);
    } catch (err) {
      console.error('Insert Error:', err);
      setError('Gagal membuat kode: ' + (err.message || 'Cek koneksi database.'));
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (respondents.length === 0) return alert('Tidak ada data');
    const headers = ['Nama', 'Kode', 'Pre-test', 'Post-test', 'Modul Selesai', 'Total TTD', 'Tanggal Daftar'];
    const rows = respondents.map(r => [
      r.nama, r.kode, r.pretest_score, r.posttest_score, 
      r.completed_modules?.length || 0, r.ttd_logs?.length || 0,
      new Date(r.created_at).toLocaleDateString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Responden_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  // Process data for charts
  const avgPre = respondents.reduce((acc, curr) => acc + (curr.pretest_score || 0), 0) / (respondents.length || 1);
  const avgPost = respondents.reduce((acc, curr) => acc + (curr.posttest_score || 0), 0) / (respondents.length || 1);
  const improvement = avgPost - avgPre;

  const chartData = [
    { name: 'Pre-Test', score: Math.round(avgPre) },
    { name: 'Post-Test', score: Math.round(avgPost) },
  ];

  const complianceData = [
    { name: 'Patuh (3+ TTD)', value: respondents.filter(r => (r.ttd_logs?.length || 0) >= 3).length, color: '#16a34a' },
    { name: 'Kurang (1-2 TTD)', value: respondents.filter(r => (r.ttd_logs?.length || 0) > 0 && (r.ttd_logs?.length || 0) < 3).length, color: '#ea580c' },
    { name: 'Tidak Pernah', value: respondents.filter(r => (r.ttd_logs?.length || 0) === 0).length, color: '#dc2626' },
  ];

  const filteredRespondents = respondents.filter(r => 
    r.nama?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-md border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-8 mx-auto">
            <LayoutDashboard className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-center mb-2 text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-center text-gray-400 font-medium mb-10">Silakan masukkan akses keamanan</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Secret Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all font-bold text-lg"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-5 rounded-2xl font-black text-white bg-green-600 hover:bg-green-700 transition-all shadow-xl shadow-green-500/20 active:scale-[0.98]"
            >
              Buka Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Ringkasan' },
    { id: 'respondents', icon: Users, label: 'Data Responden' },
    { id: 'codes', icon: Key, label: 'Manajemen Kode' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-101 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <span className="text-white font-black text-lg">C</span>
                  </div>
                  <p className="font-black text-gray-900 leading-tight">Admin Menu</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-gray-100 rounded-xl text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === item.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                  >
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <div>
              <p className="font-black text-gray-900 leading-tight">CA Admin</p>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Research Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeTab === item.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar Panel</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-8 py-5 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-black text-gray-800 tracking-tight capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={fetchData} className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all active:rotate-180 duration-500">
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <p className="text-sm font-bold text-gray-500 hidden sm:block">Update Terakhir: {new Date().toLocaleTimeString()}</p>
          </div>
        </header>

        <main className="p-8 pb-20">
          {error && (
            <motion.div 
              initial={{ opacity: 0, h: 0 }}
              animate={{ opacity: 1, h: 'auto' }}
              className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold shadow-sm"
            >
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-100 rounded-lg">
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* STATS GRID */}
                  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-green-500 font-black text-xs bg-green-50 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12%</span>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Responden</p>
                      <p className="text-3xl font-black text-gray-900">{respondents.length}</p>
                    </div>
                    {/* Mini Sparkline */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 10 }, () => ({ v: Math.random() * 10 }))}>
                          <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-green-500 font-black text-xs bg-green-50 px-2 py-1 rounded-lg">
                        <TrendingUp className="w-3 h-3" />
                        <span>↑ {Math.max(0, Math.round(improvement))}%</span>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Rata-rata Kenaikan</p>
                      <p className="text-3xl font-black text-gray-900">+{Math.round(improvement)} Poin</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 10 }, () => ({ v: Math.random() * 10 }))}>
                          <Area type="monotone" dataKey="v" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 font-black text-xs bg-orange-50 px-2 py-1 rounded-lg">
                        <span>Aktif</span>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Kepatuhan TTD</p>
                      <p className="text-3xl font-black text-gray-900">
                        {Math.round((respondents.filter(r => (r.ttd_logs?.length || 0) > 0).length / (respondents.length || 1)) * 100)}%
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 10 }, () => ({ v: Math.random() * 10 }))}>
                          <Area type="monotone" dataKey="v" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-br from-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                        <Key className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-purple-500 bg-purple-50 px-2 py-1 rounded-lg">Sisa Kode</p>
                    </div>
                    <div className="relative z-10">
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Kode Tersedia</p>
                      <p className="text-3xl font-black text-gray-900">{codes.filter(c => !c.is_used).length}</p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={Array.from({ length: 10 }, () => ({ v: Math.random() * 10 }))}>
                          <Area type="monotone" dataKey="v" stroke="#9333ea" fill="#9333ea" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                {/* CHARTS GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Performance Chart */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-10 -mt-10 opacity-50"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">Kenaikan Pengetahuan</h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mt-1">Perbandingan Pre vs Post</p>
                      </div>
                      <BarChart3 className="text-green-600 w-6 h-6" />
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} dy={10} />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                          />
                          <Bar dataKey="score" radius={[12, 12, 0, 0]} barSize={60}>
                            {chartData.map((entry, index) => (
                              <Cell key={index} fill={index === 0 ? '#cbd5e1' : '#16a34a'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Compliance Pie Chart */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black text-gray-800 tracking-tight">Status Minum TTD</h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wide mt-1">Segmentasi Responden</p>
                      </div>
                      <TrendingUp className="text-orange-600 w-6 h-6" />
                    </div>
                    <div className="h-72 w-full flex flex-col md:flex-row items-center justify-center gap-8">
                      <div className="flex-1 w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={complianceData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              {complianceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4 shrink-0">
                        {complianceData.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{item.name}</span>
                            <span className="text-sm font-black text-gray-800 ml-auto">{item.value} Org</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'respondents' && (
              <motion.div 
                key="respondents_list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mt-4">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-8">
                    <div className="relative w-full md:w-96 group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Cari Nama atau Kode..." 
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-green-500 focus:bg-white outline-none transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={exportToCSV}
                      className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-2xl font-black shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all active:scale-[0.98]"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download SPSS/CSV</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profil Responden</th>
                          <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Kode</th>
                          <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pre ⮕ Post</th>
                          <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Modul</th>
                          <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">TTD Log</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredRespondents.map((r, i) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            key={r.id} 
                            className="group hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                                  {r.avatar || '🦸‍♀️'}
                                </div>
                                <div>
                                  <p className="font-extrabold text-gray-900 group-hover:text-green-600 transition-colors">{r.nama}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Terdaftar: {new Date(r.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="font-mono font-black text-gray-400 group-hover:text-gray-900 transition-colors px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                {r.kode}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <span className="text-xs font-black text-gray-400">{r.pretest_score ?? '-'}</span>
                                <ChevronRight className="w-3 h-3 text-gray-300" />
                                <span className={`text-sm font-black ${ improvement >= 0 ? 'text-green-600' : 'text-red-500' }`}>
                                  {r.posttest_score ?? '-'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="inline-flex items-center justify-center w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500" 
                                  style={{ width: `${((r.completed_modules?.length || 0) / 6) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-[10px] font-black text-gray-400 mt-1">{r.completed_modules?.length || 0}/6</p>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${ (r.ttd_logs?.length || 0) >= 3 ? 'bg-green-100 text-green-700' : (r.ttd_logs?.length || 0) > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                {(r.ttd_logs?.length || 0) >= 3 ? <CheckCircle2 className="w-3 h-3" /> : (r.ttd_logs?.length || 0) > 0 ? <Clock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {(r.ttd_logs?.length || 0)} kali
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'codes' && (
              <motion.div 
                key="codes_man"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl space-y-8"
              >
                {/* CODE GENERATOR CARD */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Buat Kode Baru</h3>
                    <p className="text-gray-400 font-medium mb-8">Generated codes will be added to the authorized list for respondents.</p>
                    
                    <div className="flex flex-col sm:flex-row items-end gap-6">
                      <div className="w-full sm:w-48">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Jumlah Kode</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="100"
                          className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all font-black text-lg"
                          value={generateCount}
                          onChange={(e) => setGenerateCount(parseInt(e.target.value))}
                        />
                      </div>
                      <button 
                        onClick={generateCodes}
                        disabled={loading}
                        className="flex-1 w-full py-4 bg-purple-600 text-white rounded-2xl font-black shadow-xl shadow-purple-500/20 hover:bg-purple-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        <span>Buat {generateCount} Kode Sekarang</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* CODES LIST */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                      <h3 className="text-xl font-black text-gray-800 tracking-tight">Daftar Kode Sah</h3>
                      <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-black text-gray-500 uppercase tracking-widest">
                        {codes.filter(c => !c.is_used).length} Sisa / {codes.length} Total
                      </span>
                   </div>
                   <div className="max-h-125 overflow-y-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-8">
                        {codes.map((c) => (
                          <div 
                            key={c.code}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${c.is_used ? 'bg-gray-50 border-gray-100 opacity-50' : 'bg-white border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 cursor-pointer'}`}
                          >
                            <span className="font-mono text-lg font-black tracking-widest group-hover:text-green-600 transition-colors uppercase">{c.code}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${c.is_used ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                              {c.is_used ? 'Terpakai' : 'Siap Pakai'}
                            </span>
                          </div>
                        ))}
                      </div>
                      {codes.length === 0 && (
                        <div className="p-20 text-center text-gray-400 font-medium italic">
                          Belum ada kode yang dibuat. Silakan gunakan generator di atas.
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
