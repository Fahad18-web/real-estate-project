import { Link } from 'react-router-dom';
import { Building2, Globe, Share2, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-default)] pt-16 pb-12 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-default)]">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Estate<span className="brand-gradient-text">Pulse</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Next-generation real estate marketplace engineered for modern property discovery, verified agent listings, interactive appointment scheduling, and transparent reviews.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[#6C63FF] border border-[var(--border-default)] transition">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[#6C63FF] border border-[var(--border-default)] transition">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[#6C63FF] border border-[var(--border-default)] transition">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li><Link to="/properties?type=sale" className="hover:text-[var(--text-primary)] transition">Homes for Sale</Link></li>
              <li><Link to="/properties?type=rent" className="hover:text-[var(--text-primary)] transition">Rental Properties</Link></li>
              <li><Link to="/properties?propertyType=commercial" className="hover:text-[var(--text-primary)] transition">Commercial Spaces</Link></li>
              <li><Link to="/properties?propertyType=villa" className="hover:text-[var(--text-primary)] transition">Luxury Villas</Link></li>
              <li><Link to="/properties?propertyType=plot" className="hover:text-[var(--text-primary)] transition">Residential Plots</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li><Link to="/register" className="hover:text-[var(--text-primary)] transition">Join as Agent</Link></li>
              <li><Link to="/dashboard" className="hover:text-[var(--text-primary)] transition">Client Portal</Link></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Market Insights</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)] transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6C63FF]" />
                Main Gulberg, Lahore, PK
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4ECDC4]" />
                +92 (300) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#6C63FF]" />
                support@estatepulse.io
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} EstatePulse Inc. Built for high performance real estate teams.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[var(--text-secondary)] transition">Terms</a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition">Privacy</a>
            <a href="#" className="hover:text-[var(--text-secondary)] transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
