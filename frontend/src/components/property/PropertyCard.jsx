import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, Star } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import {
  useSavePropertyMutation,
  useUnsavePropertyMutation,
} from '../../features/properties/propertyApi';
import toast from 'react-hot-toast';

export default function PropertyCard({ property, isSaved = false }) {
  const { isAuthenticated } = useAuth();
  const [saveProperty, { isLoading: isSaving }] = useSavePropertyMutation();
  const [unsaveProperty, { isLoading: isUnsaving }] = useUnsavePropertyMutation();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save properties to your favorites');
      return;
    }

    try {
      if (isSaved) {
        await unsaveProperty(property._id).unwrap();
        toast.success('Removed from saved properties');
      } else {
        await saveProperty(property._id).unwrap();
        toast.success('Added to saved properties');
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update saved property');
    }
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  const coverImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : defaultImage;

  return (
    <div className="group rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#6C63FF]/50 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6C63FF]/10">
      {/* Image with badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-surface)]">
        <img
          src={coverImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Status / Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg text-white uppercase tracking-wider shadow-md ${
              property.type === 'rent'
                ? 'bg-[#4ECDC4] text-black font-bold'
                : 'bg-[#6C63FF]'
            }`}
          >
            For {property.type}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-black/60 backdrop-blur-md text-white/90 capitalize border border-white/10">
            {property.propertyType}
          </span>
        </div>

        {/* Favorite heart button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isSaving || isUnsaving}
          className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md border transition ${
            isSaved
              ? 'bg-[#EF4444] text-white border-transparent'
              : 'bg-black/50 text-white/80 hover:text-white border-white/10 hover:bg-black/80'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* City badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-[#4ECDC4]" />
          <span>{property.location?.city || 'Pakistan'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <p className="font-mono text-xl font-extrabold text-[#4ECDC4] dark:text-[#4ECDC4]">
              {formatPrice(property.price, property.type)}
            </p>
            {property.avgRating > 0 && (
              <div className="flex items-center gap-1 text-xs font-semibold bg-[#F59E0B]/15 text-[#F59E0B] px-2 py-0.5 rounded-md border border-[#F59E0B]/30">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                <span>{property.avgRating}</span>
                <span className="text-[var(--text-muted)]">({property.totalReviews})</span>
              </div>
            )}
          </div>

          <Link to={`/properties/${property._id}`}>
            <h3 className="text-base font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[#6C63FF] transition">
              {property.title}
            </h3>
          </Link>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {property.description}
          </p>
        </div>

        {/* Feature specs */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 font-mono">
            <Square className="w-3.5 h-3.5 text-[#4ECDC4]" />
            <span>{property.area?.toLocaleString()} sqft</span>
          </div>
        </div>

        <Link
          to={`/properties/${property._id}`}
          className="w-full text-center py-2.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[#6C63FF] text-[var(--text-primary)] hover:text-white text-xs font-semibold border border-[var(--border-default)] hover:border-[#6C63FF] transition duration-200 shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
