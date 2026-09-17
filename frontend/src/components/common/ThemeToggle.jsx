import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2 rounded-xl border transition-all duration-300 flex items-center justify-center group ${
        isDark
          ? 'bg-[#1A1A24] text-[#F0F0FF] border-white/10 hover:border-[#6C63FF]/60 hover:shadow-lg hover:shadow-[#6C63FF]/15'
          : 'bg-white text-[#0F172A] border-slate-200 hover:border-[#6C63FF]/60 shadow-sm hover:shadow-md'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 transform ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none absolute'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`w-4 h-4 text-[#4ECDC4] transition-all duration-300 transform ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none absolute'
          }`}
        />
      </div>
    </button>
  );
}
