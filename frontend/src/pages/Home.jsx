import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '../features/properties/propertySlice';
import { useGetPropertiesQuery } from '../features/properties/propertyApi';
import PropertyCard from '../components/property/PropertyCard';
import {
  Search,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('sale');
  const [activeTab, setActiveTab] = useState('all');

  const { data: featuredData, isLoading } = useGetPropertiesQuery({
    limit: 6,
    type: activeTab === 'all' ? '' : activeTab,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilter({ city: searchCity, type: searchType }));
    navigate('/properties');
  };

  const properties = featuredData?.data?.properties || [];

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* 1. HERO SECTION WITH ANIMATED GRADIENT MESH */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-112.5 bg-gradient-to-tr from-[#6C63FF]/25 via-[#4ECDC4]/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[#6C63FF]/30 text-xs font-semibold text-[var(--text-primary)] shadow-lg shadow-[#6C63FF]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#4ECDC4]" />
            <span>Next-Gen Premium Real Estate Marketplace</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
            Find Your Dream Home With{' '}
            <span className="brand-gradient-text">Zero Compromise</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Discover verified architectural villas, high-yield corporate spaces, and luxury coastal residences with real-time appointments and transparent community reviews.
          </p>

          {/* Search bar widget */}
          <div className="max-w-3xl mx-auto glass-panel p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-[var(--border-default)]">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              {/* City selector */}
              <div className="flex items-center gap-2 px-4 py-2.5 w-full sm:w-1/3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <MapPin className="w-4 h-4 text-[#6C63FF] shrink-0" />
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  aria-label="City"
                  className="bg-transparent text-sm text-[var(--text-primary)] w-full focus:outline-none"
                >
                  <option value="" className="bg-[var(--bg-surface)]">All Pakistan Cities</option>
                  <option value="Lahore" className="bg-[var(--bg-surface)]">Lahore</option>
                  <option value="Karachi" className="bg-[var(--bg-surface)]">Karachi</option>
                  <option value="Islamabad" className="bg-[var(--bg-surface)]">Islamabad</option>
                </select>
              </div>

              {/* Purpose Selector */}
              <div className="flex items-center gap-2 px-4 py-2.5 w-full sm:w-1/3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <TrendingUp className="w-4 h-4 text-[#4ECDC4] shrink-0" />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  aria-label="Property Purpose"
                  className="bg-transparent text-sm text-[var(--text-primary)] w-full focus:outline-none"
                >
                  <option value="sale" className="bg-[var(--bg-surface)]">For Sale</option>
                  <option value="rent" className="bg-[var(--bg-surface)]">For Rent</option>
                </select>
              </div>

              {/* Search submit button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] hover:opacity-95 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#6C63FF]/25 hover:scale-[1.02] transition-transform"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-[var(--border-default)] bg-[var(--bg-surface)]/60 backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold brand-gradient-text">
              1,250+
            </p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">
              Active Listings
            </p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold brand-gradient-text">
              3+
            </p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">
              Major Metros
            </p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold brand-gradient-text">
              99.4%
            </p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">
              Verified Ownership
            </p>
          </div>
          <div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold brand-gradient-text">
              4.9 / 5
            </p>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">
              Client Satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4ECDC4]">
              Exclusive Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mt-1">
              Featured Properties
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Hand-picked architectural properties verified by certified agents.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] w-fit">
            {['all', 'sale', 'rent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-[#6C63FF] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'all' ? 'All Properties' : `For ${tab}`}
              </button>
            ))}
          </div>
        </div>

        {/* 6-card grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-[var(--bg-elevated)] animate-pulse border border-[var(--border-subtle)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}

        <div className="text-center pt-6">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-semibold border border-[var(--border-default)] hover:border-[#6C63FF]/50 transition shadow-sm"
          >
            Explore All Listings
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. HOW IT WORKS (3-step process) */}
      <section className="bg-[var(--bg-surface)]/50 border-y border-[var(--border-default)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C63FF]">
              Effortless Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
              How EstatePulse Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              From browsing to keys in hand, we streamline the entire real estate journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[#6C63FF]/40 transition duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/15 text-[#6C63FF] flex items-center justify-center font-bold text-lg font-mono">
                01
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Smart Discovery</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Filter by verified coordinates, price brackets, architectural style, and bedroom counts with instant results.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[#4ECDC4]/40 transition duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/15 text-[#4ECDC4] flex items-center justify-center font-bold text-lg font-mono">
                02
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Book Viewings</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Schedule in-person inspection appointments with certified agents directly through our synchronized calendar slot system.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 rounded-3xl space-y-4 hover:border-[#6C63FF]/40 transition duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/15 text-[#6C63FF] flex items-center justify-center font-bold text-lg font-mono">
                03
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Transparent Deals</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Read authentic community reviews, inspect verified title documents, and finalize your purchase or rental securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER (Agent Signup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-[#6C63FF]/15 via-[#4ECDC4]/15 to-[var(--bg-elevated)] border border-[var(--border-default)] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#4ECDC4]/20 text-[#4ECDC4] text-xs font-bold uppercase tracking-wider">
              For Real Estate Agents & Brokers
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight">
              Scale Your Property Agency With Premium Exposure
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              List high-profile residential & commercial developments, manage client viewing schedules, and gain instant visibility across thousands of qualified buyers.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-semibold text-sm shadow-xl shadow-[#6C63FF]/20 hover:scale-105 transition-transform"
              >
                Register as Verified Agent
              </Link>
              <Link
                to="/properties"
                className="px-6 py-3.5 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold text-sm border border-[var(--border-default)] hover:border-[#6C63FF]/50 transition shadow-sm"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
