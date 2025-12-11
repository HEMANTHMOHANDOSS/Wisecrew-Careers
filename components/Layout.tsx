
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Instagram, Linkedin, Twitter, Globe, Search, Heart, Briefcase, FileText, Send, ShieldAlert, GraduationCap, UserCircle } from 'lucide-react';
import { Button, ThemeToggle } from './GlassUI';
import { useData } from '../context/DataContext';

// --- Navbar ---
export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Open Positions', path: '/jobs' },
    { name: 'Internships', path: '/internships' },
    { name: 'Assessments', path: '/assessments' },
    { name: 'Culture', path: '/culture' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
        ${isScrolled || isMobileMenuOpen ? 'backdrop-blur-lg' : 'bg-transparent border-transparent'}
      `}
      style={isScrolled || isMobileMenuOpen ? { 
        backgroundColor: 'var(--bg-surface)', 
        borderColor: 'var(--border-subtle)' 
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/50 transition-all">
              W
            </div>
            <span className="font-bold text-xl tracking-tight transition-colors" style={{ color: 'var(--text-primary)' }}>
              Wisecrew <span className="font-light" style={{ color: 'var(--text-secondary)' }}>Careers</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path}
                className={({ isActive }) => `
                  text-sm font-medium transition-colors hover:text-blue-400
                  ${isActive ? 'text-blue-400' : 'text-[var(--text-secondary)]'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Admin Link (Dev Only) */}
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `
                text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border transition-all
                ${isActive ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'text-[var(--text-muted)] border-transparent hover:text-red-400 hover:bg-[var(--bg-surface)]'}
              `}
            >
              Admin
            </NavLink>

            <div className="h-6 w-px" style={{ backgroundColor: 'var(--border-subtle)' }}></div>

            <ThemeToggle />
            
            {currentUser ? (
              <div className="flex items-center gap-3">
                 <NavLink to="/dashboard">
                   <Button size="sm" variant="primary">
                      Dashboard
                   </Button>
                 </NavLink>
                 <Button size="sm" variant="ghost" onClick={handleLogout} className="text-red-400">
                    Log Out
                 </Button>
              </div>
            ) : (
              <NavLink to="/login">
                <Button size="sm" variant="secondary">
                  Candidate Login <UserCircle size={14} className="ml-1" />
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-surface)]"
              style={{ color: 'var(--text-primary)' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden backdrop-blur-xl border-b" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  block px-3 py-3 rounded-lg text-base font-medium
                  ${isActive ? 'bg-blue-500/10 text-blue-400' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
            
            <NavLink
              to="/admin"
              className={({ isActive }) => `
                block px-3 py-3 rounded-lg text-sm font-bold uppercase tracking-wider
                ${isActive ? 'bg-red-500/10 text-red-500' : 'text-[var(--text-muted)] hover:text-red-400'}
              `}
            >
              Admin
            </NavLink>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              {currentUser ? (
                 <>
                  <NavLink to="/dashboard" className="block w-full text-center py-3 bg-blue-600 rounded-xl text-white font-medium mb-2">My Dashboard</NavLink>
                  <button onClick={handleLogout} className="block w-full text-center py-3 text-red-400">Log Out</button>
                 </>
              ) : (
                 <NavLink to="/login" className="block w-full text-center py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium">Candidate Login</NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// --- Mobile Bottom Nav ---
export const MobileBottomNav: React.FC = () => {
  const { currentUser } = useData();
  return (
    <div 
      className="md:hidden fixed bottom-4 left-4 right-4 z-[90] backdrop-blur-xl border rounded-2xl shadow-xl p-2 flex justify-around items-center"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)'
      }}
    >
       <NavLink to="/jobs" className={({ isActive }) => `p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
          <Search size={20} />
          <span className="text-[10px] font-medium">Browse</span>
       </NavLink>
       <NavLink to="/assessments" className={({ isActive }) => `p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
          <GraduationCap size={20} />
          <span className="text-[10px] font-medium">Test</span>
       </NavLink>
       {currentUser ? (
         <NavLink to="/dashboard" className={({ isActive }) => `p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
            <UserCircle size={20} />
            <span className="text-[10px] font-medium">Profile</span>
         </NavLink>
       ) : (
         <NavLink to="/login" className={({ isActive }) => `p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-blue-400 bg-blue-500/10' : 'text-[var(--text-muted)]'}`}>
            <UserCircle size={20} />
            <span className="text-[10px] font-medium">Login</span>
         </NavLink>
       )}
    </div>
  );
};

// --- Loading Screen ---
export const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--bg-main)' }}>
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 animate-pulse flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_40px_rgba(37,99,235,0.5)]">
        W
      </div>
      <div className="absolute inset-0 border-4 border-blue-400/30 rounded-2xl animate-spin-slow" />
    </div>
    <h2 className="text-xl font-bold mb-2 tracking-wide animate-pulse" style={{ color: 'var(--text-primary)' }}>Loading Your Future...</h2>
  </div>
);

// --- Footer ---
export const Footer: React.FC = () => {
  return (
    <footer className="border-t pt-16 pb-24 md:pb-8" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">W</div>
               <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Wisecrew</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Building digital experiences that matter. Join us in shaping the future of technology.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Linkedin size={20} /></a>
              <a href="#" className="hover:text-pink-500 transition-colors" style={{ color: 'var(--text-muted)' }}><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors" style={{ color: 'var(--text-muted)' }}><Globe size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Explore</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li><NavLink to="/" className="hover:text-blue-400">Careers Home</NavLink></li>
              <li><NavLink to="/jobs" className="hover:text-blue-400">Open Positions</NavLink></li>
              <li><NavLink to="/internships" className="hover:text-blue-400">Internships</NavLink></li>
              <li><NavLink to="/assessments" className="hover:text-blue-400">Assessments</NavLink></li>
              <li><NavLink to="/track" className="hover:text-blue-400">Track Application</NavLink></li>
            </ul>
          </div>

          <div>
             <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Stay Updated</h4>
             <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Get the latest job alerts.</p>
             <div className="flex">
               <input 
                 type="email" 
                 placeholder="Enter email" 
                 className="border rounded-l-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500"
                 style={{
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)'
                 }}
               />
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-r-lg transition-colors">
                 <Send size={16} />
               </button>
             </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
              <li><NavLink to="/admin" className="hover:text-red-400 text-red-400/70">Admin Login</NavLink></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Wisecrew Solutions. All rights reserved.</p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Made with <span className="text-red-500">♥</span> by the Engineering Team
          </p>
        </div>
      </div>
    </footer>
  );
};
