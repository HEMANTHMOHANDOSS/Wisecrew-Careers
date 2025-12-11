import React, { useState, createContext, useContext, useEffect } from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Clock, PlayCircle, CheckCircle, Info, AlertCircle, XCircle } from 'lucide-react';
import { Assessment } from '../types';

// --- Theme Context ---
export const ThemeContext = createContext<{ theme: 'dark' | 'light'; toggleTheme: () => void }>({ theme: 'dark', toggleTheme: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('wisecrew_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('wisecrew_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- Toast Context ---
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

const ToastContext = createContext<{ showToast: (msg: string, type?: 'success' | 'info' | 'error') => void }>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <Info size={18} />
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 md:bottom-8 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`
                pointer-events-auto pl-3 pr-5 py-3 rounded-xl backdrop-blur-xl shadow-lg border flex items-center gap-3 min-w-[300px] max-w-sm
                ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : ''}
                ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : ''}
                ${toast.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' : ''}
              `}
              style={
                  !['success','error','info'].includes(toast.type) ? {
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-primary)'
                  } : {}
              }
            >
              <div className={`
                 p-1.5 rounded-full flex-shrink-0
                 ${toast.type === 'success' ? 'bg-green-500/10' : ''}
                 ${toast.type === 'error' ? 'bg-red-500/10' : ''}
                 ${toast.type === 'info' ? 'bg-blue-500/10' : ''}
              `}>
                  {icons[toast.type]}
              </div>
              <span className="text-sm font-medium leading-tight">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// --- Card ---
export interface GlassCardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, style, ...props }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        backdrop-blur-xl 
        border
        rounded-2xl
        transition-all duration-300
        ${hoverEffect ? 'hover:bg-[var(--border-subtle)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--card-shadow)',
        color: 'var(--text-primary)',
        ...(style as React.CSSProperties)
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// --- Assessment Card ---
export const AssessmentCard: React.FC<{ assessment: Assessment; onClick: () => void }> = ({ assessment, onClick }) => {
  const Icon = assessment.icon;
  return (
    <GlassCard hoverEffect className="p-6 h-full flex flex-col" onClick={onClick}>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-400 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{assessment.title}</h3>
      <p className="text-sm mb-6 flex-grow" style={{ color: 'var(--text-secondary)' }}>{assessment.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        {assessment.duration && (
          <div className="flex items-center text-xs" style={{ color: 'var(--text-muted)' }}>
            <Clock size={14} className="mr-1" /> {assessment.duration}
          </div>
        )}
        <button className="text-sm font-medium text-blue-400 flex items-center hover:text-blue-300 transition-colors">
          Start Now <PlayCircle size={16} className="ml-1" />
        </button>
      </div>
    </GlassCard>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  onClick,
  ...props 
}) => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500);
    } else {
      setIsRippling(false);
    }
  }, [coords]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    onClick && onClick(e);
  };

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-main)] group select-none";
  
  // Dynamic class construction based on variant
  let variantStyles = "";
  if (variant === 'primary') {
    variantStyles = "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 focus:ring-blue-500 border border-transparent";
  } else if (variant === 'secondary') {
    variantStyles = "focus:ring-white/50 hover:bg-[var(--border-subtle)]";
  } else if (variant === 'outline') {
    variantStyles = "bg-transparent focus:ring-white/50 hover:bg-[var(--bg-surface)]";
  } else if (variant === 'ghost') {
    variantStyles = "bg-transparent hover:bg-[var(--bg-surface)] focus:ring-gray-500";
  } else if (variant === 'danger') {
    variantStyles = "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20";
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${sizes[size]} ${className}`}
      onClick={handleClick}
      style={
        variant === 'secondary' ? {
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-subtle)',
          borderWidth: '1px'
        } : variant === 'outline' ? {
          color: 'var(--text-primary)',
          borderColor: 'var(--border-strong)',
          borderWidth: '1px'
        } : variant === 'ghost' ? {
          color: 'var(--text-secondary)'
        } : {}
      }
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      
      {/* Shimmer Effect */}
      {variant !== 'ghost' && (
        <span className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
      )}

      {/* Ripple Effect */}
      {isRippling && (
        <span 
          className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
          style={{
            left: coords.x,
            top: coords.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10
          }}
        />
      )}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
    <input 
      className={`
        w-full rounded-xl px-4 py-2.5 
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 
        transition-all
        ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--input-bg)',
        borderColor: error ? '#ef4444' : 'var(--input-border)',
        borderWidth: '1px',
        color: 'var(--text-primary)',
      }}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// --- TextArea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
    <textarea 
      className={`
        w-full rounded-xl px-4 py-2.5 
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 
        transition-all
        ${className}
      `}
      style={{
        backgroundColor: 'var(--input-bg)',
        borderColor: 'var(--input-border)',
        borderWidth: '1px',
        color: 'var(--text-primary)',
      }}
      {...props}
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  placeholder?: string;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>}
    <div className="relative">
      <select 
        className={`
          w-full rounded-xl px-4 py-2.5 
          appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
          ${className}
        `}
        style={{
          backgroundColor: 'var(--input-bg)',
          borderColor: error ? '#ef4444' : 'var(--input-border)',
          borderWidth: '1px',
          color: 'var(--text-primary)',
        }}
        {...props}
      >
        <option value="" style={{ backgroundColor: 'var(--bg-elevated)' }}>{placeholder || 'Select...'}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} style={{ backgroundColor: 'var(--bg-elevated)' }}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green' | 'default' | 'red' | 'yellow' | 'orange';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: "bg-gray-500/10 text-gray-500 dark:text-gray-300 border-gray-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Theme Toggle ---
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

// --- Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md ${className}`} style={{ backgroundColor: 'var(--border-subtle)' }} />
);

// --- JobCardSkeleton ---
export const JobCardSkeleton: React.FC = () => (
  <GlassCard className="p-6 md:p-8 flex flex-col items-start h-full min-h-[300px]">
    <div className="w-14 flex justify-between items-start mb-4">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
    
    <Skeleton className="h-8 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-6" />
    
    <div className="flex flex-wrap gap-4 mb-8 w-full">
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-5 w-24 rounded-full" />
      <Skeleton className="h-5 w-24 rounded-full" />
    </div>

    <div className="mt-auto w-full flex gap-4">
      <Skeleton className="h-10 flex-1 rounded-xl" />
      <Skeleton className="h-10 flex-1 rounded-xl" />
    </div>
  </GlassCard>
);

// --- TableSkeleton ---
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full">
    <Skeleton className="h-12 w-full mb-4 rounded-xl" />
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  </div>
);

// --- Modal Wrapper ---
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--text-primary)'
        }}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-xl font-bold">{title || 'Modal'}</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};