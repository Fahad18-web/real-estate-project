import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../../features/properties/propertySlice';
import { useGetPropertiesQuery } from '../../features/properties/propertyApi';
import PropertyFilter from '../../components/property/PropertyFilter';
import PropertyGrid from '../../components/property/PropertyGrid';
import PropertyMap from '../../components/property/PropertyMap';
import { Map, Grid, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertyList() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.property.filters);
  const [showMap, setShowMap] = useState(false);

  const { data, isLoading, isFetching } = useGetPropertiesQuery(filters);

  const properties = data?.data?.properties || [];
  const pagination = data?.data?.pagination || { page: 1, pages: 1, total: 0 };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      dispatch(setPage(newPage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            Available Properties
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Showing {properties.length} of {pagination.total} listings matching your criteria.
          </p>
        </div>

        {/* View toggle (Grid vs Map view) */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] w-fit shadow-sm">
          <button
            onClick={() => setShowMap(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !showMap ? 'bg-[#6C63FF] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              showMap ? 'bg-[#6C63FF] text-white shadow' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>
      </div>

      {/* Filter Component */}
      <PropertyFilter />

      {/* Map display when toggled */}
      {showMap && properties.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--text-secondary)] uppercase font-bold tracking-wider">
            Geographic Location of First Result
          </p>
          <PropertyMap
            coordinates={properties[0]?.location?.coordinates}
            title={properties[0]?.title}
          />
        </div>
      )}

      {/* Grid of Results */}
      <PropertyGrid properties={properties} isLoading={isLoading || isFetching} />

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono text-[var(--text-secondary)]">
            Page <span className="font-bold text-[var(--text-primary)]">{pagination.page}</span> of{' '}
            <span className="font-bold text-[var(--text-primary)]">{pagination.pages}</span>
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
