import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-center transition-colors duration-300">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-extrabold font-mono brand-gradient-text">404</h1>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Page Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The address or property listing you requested does not exist or has moved.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold hover:bg-[#584fed] transition shadow-md"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/properties"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] text-xs font-semibold hover:border-[#6C63FF]/50 transition shadow-sm"
          >
            <Compass className="w-4 h-4" />
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
