import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import Modules from './pages/Modules';
import Quiz from './pages/Quiz';
import Pretest from './pages/Pretest';
import Profile from './pages/Profile';

import Admin from './pages/Admin';

// Guard: jika belum login → login, jika belum pretest → pretest
function RequirePretest({ children }) {
  const user = localStorage.getItem('user');
  const pretestDone = localStorage.getItem('pretestDone');
  if (!user) return <Navigate to="/login" replace />;
  if (!pretestDone) return <Navigate to="/pretest" replace />;
  return children;
}

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem('user');
      const pretestDone = localStorage.getItem('pretestDone');
      if (user && pretestDone) {
        navigate('/dashboard');
      } else if (user) {
        navigate('/pretest');
      } else {
        navigate('/login');
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary-50 p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-[-10%] w-64 h-64 bg-primary-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-[-10%] w-72 h-72 bg-secondary-200/30 rounded-full blur-3xl"></div>
      
      <div className="w-24 h-24 bg-primary-500 rounded-full animate-bounce mb-6 flex items-center justify-center shadow-xl shadow-primary-500/40 z-10">
         <span className="text-white text-3xl font-bold">CA!</span>
      </div>
      <h1 className="text-3xl text-primary-700 font-bold mb-2 text-center z-10 tracking-tight">Cegah Anemia Yuk!</h1>
      <p className="text-gray-500 text-center mt-2 z-10 font-medium tracking-wide">Bersama Remaja Sehat Bukittinggi</p>
      
      <div className="mt-12 flex space-x-2 z-10 absolute bottom-20">
        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-pulse"></div>
        <div className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></div>
        <div className="w-2.5 h-2.5 bg-primary-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Admin Mandiri (Full Screen) */}
        <Route path="/admin" element={<Admin />} />

        {/* Route Aplikasi (Phone Wrapper) */}
        <Route
          path="*"
          element={
            <div
              className="min-h-screen w-full flex items-start justify-center"
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #047857 60%, #c2410c 100%)',
              }}
            >
              {/* Desktop decorative elements */}
              <div className="hidden md:flex fixed top-8 left-8 flex-col gap-2 z-10">
                <p className="text-white/60 text-sm font-bold tracking-widest uppercase">Cegah Anemia Yuk!</p>
                <p className="text-white/40 text-xs font-medium">Edukasi Remaja Bukittinggi</p>
              </div>
              <div className="hidden md:block fixed bottom-8 left-8 text-white/20 text-xs font-medium z-10">
                ⚠️ Aplikasi ini dioptimasi untuk perangkat mobile
              </div>

              {/* App container */}
              <div
                className="w-full md:w-97.5 md:my-0 min-h-screen md:min-h-screen bg-white relative overflow-x-hidden font-sans md:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_80px_rgba(0,0,0,0.5)]"
                style={{ maxWidth: '430px' }}
              >
                <Routes>
                  <Route path="/" element={<Splash />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/pretest" element={<Pretest />} />
                  <Route path="/dashboard" element={<RequirePretest><Dashboard /></RequirePretest>} />
                  <Route path="/modules" element={<RequirePretest><Modules /></RequirePretest>} />
                  <Route path="/module/:id" element={<RequirePretest><ModuleDetail /></RequirePretest>} />
                  <Route path="/quiz" element={<RequirePretest><Quiz /></RequirePretest>} />
                  <Route path="/profile" element={<RequirePretest><Profile /></RequirePretest>} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
