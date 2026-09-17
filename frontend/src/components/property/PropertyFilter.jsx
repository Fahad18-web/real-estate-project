import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../../features/properties/propertySlice';
import { Search, RotateCcw, Filter } from 'lucide-react';

export default function PropertyFilter() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.property.filters);

  const handleInputChange = (field, value) => {
    dispatch(setFilter({ [field]: value }));
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm space-y-6 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
          <Filter className="w-5 h-5 text-[#6C63FF]" />
          <span>Filters & Search</span>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[#4ECDC4] transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Search by keyword */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search by title, location or keywords..."
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#6C63FF]"
        />
      </div>

      {/* Grid of filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* City */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            City
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="" className="bg-[var(--bg-surface)]">All Cities</option>
            <option value="Lahore" className="bg-[var(--bg-surface)]">Lahore</option>
            <option value="Karachi" className="bg-[var(--bg-surface)]">Karachi</option>
            <option value="Islamabad" className="bg-[var(--bg-surface)]">Islamabad</option>
          </select>
        </div>

        {/* Listing Type */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            Purpose
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="" className="bg-[var(--bg-surface)]">Any Purpose</option>
            <option value="sale" className="bg-[var(--bg-surface)]">For Sale</option>
            <option value="rent" className="bg-[var(--bg-surface)]">For Rent</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            Property Type
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleInputChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="" className="bg-[var(--bg-surface)]">All Types</option>
            <option value="house" className="bg-[var(--bg-surface)]">House</option>
            <option value="apartment" className="bg-[var(--bg-surface)]">Apartment</option>
            <option value="villa" className="bg-[var(--bg-surface)]">Villa</option>
            <option value="commercial" className="bg-[var(--bg-surface)]">Commercial</option>
            <option value="plot" className="bg-[var(--bg-surface)]">Plot</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            Min Price (PKR)
          </label>
          <input
            type="number"
            placeholder="e.g. 100000"
            value={filters.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            Max Price (PKR)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000000"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold mb-1">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="newest" className="bg-[var(--bg-surface)]">Newest First</option>
            <option value="oldest" className="bg-[var(--bg-surface)]">Oldest First</option>
            <option value="price-asc" className="bg-[var(--bg-surface)]">Price: Low to High</option>
            <option value="price-desc" className="bg-[var(--bg-surface)]">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
