import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../common/ProfileAvatar';
import ThemeToggle from '../common/ThemeToggle';
import {
  Building2,
  Menu,
  X,
  Compass,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  User,
  Heart,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAgent } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg-surface)]/85 backdrop-blur-md border-b border-[var(--border-default)] shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center shadow-lg shadow-[#6C63FF]/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Estate<span className="brand-gradient-text">Pulse</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/properties"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore Properties
          </Link>
          {isAuthenticated && isAgent && (
            <Link
              to="/properties/create"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4ECDC4] hover:text-[#4ECDC4]/80 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              List Property
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to={isAgent ? '/dashboard/agent' : '/dashboard'}
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Buttons / Profile Menu & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[#6C63FF]/50 transition"
              >
                <ProfileAvatar
                  src={user?.avatar}
                  alt={user?.name}
                  name={user?.name}
                  className="w-7 h-7 rounded-full ring-1 ring-[#6C63FF] text-[10px]"
                />
                <span className="text-xs font-semibold text-[var(--text-primary)] max-w-[120px] truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#6C63FF]/20 text-[#6C63FF]">
                  {user?.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[#EF4444]/20 text-[var(--text-secondary)] hover:text-[#EF4444] border border-[var(--border-default)] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white text-sm font-semibold shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls: Theme Toggle & Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border-b border-[var(--border-default)] px-6 py-6 space-y-4 shadow-xl">
          <Link
            to="/properties"
            className="flex items-center gap-2 text-base font-medium text-[var(--text-primary)] py-2"
          >
            <Compass className="w-5 h-5 text-[#6C63FF]" />
            Explore Properties
          </Link>
          {isAuthenticated && isAgent && (
            <Link
              to="/properties/create"
              className="flex items-center gap-2 text-base font-medium text-[#4ECDC4] py-2"
            >
              <PlusCircle className="w-5 h-5 text-[#4ECDC4]" />
              List New Property
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to={isAgent ? '/dashboard/agent' : '/dashboard'}
              className="flex items-center gap-2 text-base font-medium text-[var(--text-primary)] py-2"
            >
              <LayoutDashboard className="w-5 h-5 text-[#6C63FF]" />
              Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-[var(--border-default)] flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <ProfileAvatar
                    src={user?.avatar}
                    alt={user?.name}
                    name={user?.name}
                    className="w-10 h-10 rounded-full text-[11px]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                    <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#EF4444]/10 text-[#EF4444] font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-[var(--border-default)] text-[var(--text-primary)] font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
