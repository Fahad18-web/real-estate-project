import PropertyCard from './PropertyCard';
import { useGetSavedPropertiesQuery } from '../../features/properties/propertyApi';
import { useAuth } from '../../hooks/useAuth';

export default function PropertyGrid({ properties = [], isLoading = false }) {
  const { isAuthenticated } = useAuth();
  const { data: savedData } = useGetSavedPropertiesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const savedIds = (savedData?.data || []).map((p) => p._id);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden animate-pulse flex flex-col h-[400px]"
          >
            <div className="aspect-video bg-[var(--bg-overlay)] w-full" />
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-6 bg-[var(--bg-overlay)] rounded-md w-1/3" />
                <div className="h-4 bg-[var(--bg-overlay)] rounded-md w-3/4" />
                <div className="h-3 bg-[var(--bg-overlay)] rounded-md w-full" />
              </div>
              <div className="h-8 bg-[var(--bg-overlay)] rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm">
        <p className="text-lg font-semibold text-[var(--text-primary)]">No properties found</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
          Try loosening your filter constraints or searching in another city.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isSaved={savedIds.includes(property._id)}
        />
      ))}
    </div>
  );
}
