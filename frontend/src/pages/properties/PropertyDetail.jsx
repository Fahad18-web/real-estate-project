import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetPropertyByIdQuery,
  useSavePropertyMutation,
  useUnsavePropertyMutation,
  useGetSavedPropertiesQuery,
} from '../../features/properties/propertyApi';
import {
  useGetPropertyReviewsQuery,
  useAddReviewMutation,
} from '../../features/reviews/reviewApi';
import { useCreateBookingMutation } from '../../features/bookings/bookingApi';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import PropertyImageGallery from '../../components/property/PropertyImageGallery';
import PropertyMap from '../../components/property/PropertyMap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Clock,
  Send,
  Heart,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data: propertyData, isLoading, error } = useGetPropertyByIdQuery(id);
  const { data: reviewsData, refetch: refetchReviews } = useGetPropertyReviewsQuery(id);
  const { data: savedData } = useGetSavedPropertiesQuery(undefined, { skip: !isAuthenticated });

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();
  const [addReview, { isLoading: isAddingReview }] = useAddReviewMutation();
  const [saveProperty] = useSavePropertyMutation();
  const [unsaveProperty] = useUnsavePropertyMutation();

  // Booking Form State
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('10:00 AM - 11:00 AM');
  const [bookingNote, setBookingNote] = useState('');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const property = propertyData?.data;
  const reviews = reviewsData?.data || [];
  const isSaved = (savedData?.data || []).some((p) => p._id === id);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to book a viewing appointment');
      return;
    }
    if (!appointmentDate) {
      toast.error('Please select an appointment date');
      return;
    }

    try {
      await createBooking({
        propertyId: id,
        date: appointmentDate,
        timeSlot: appointmentTime,
        note: bookingNote,
      }).unwrap();

      toast.success('Appointment booked successfully! The agent will confirm soon.');
      setBookingNote('');
      setAppointmentDate('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to book appointment');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post a review');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please provide a review comment');
      return;
    }

    try {
      await addReview({
        propertyId: id,
        rating: reviewRating,
        comment: reviewComment,
      }).unwrap();

      toast.success('Thank you! Review submitted successfully');
      setReviewComment('');
      refetchReviews();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit review');
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save properties');
      return;
    }
    try {
      if (isSaved) {
        await unsaveProperty(id).unwrap();
        toast.success('Removed from saved properties');
      } else {
        await saveProperty(id).unwrap();
        toast.success('Added to saved properties');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update saved status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading property details..." />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto pt-36 pb-20 text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-2">Property Not Found</h2>
        <p className="text-[#9090B0] text-sm mb-6">
          The property listing you are looking for might have been sold, rented, or removed.
        </p>
        <Link
          to="/properties"
          className="px-6 py-2.5 rounded-xl bg-[#6C63FF] text-white text-sm font-semibold"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10 transition-colors duration-300">
      {/* Title & Quick Info Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md text-white uppercase tracking-wider ${
                property.type === 'rent' ? 'bg-[#4ECDC4] text-black font-bold' : 'bg-[#6C63FF]'
              }`}
            >
              For {property.type}
            </span>
            <span className="text-xs uppercase font-medium text-[var(--text-secondary)] px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              {property.propertyType}
            </span>
            <span className="text-xs font-semibold text-[#10B981] px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 capitalize">
              {property.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
            {property.title}
          </h1>

          <p className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mt-1.5">
            <MapPin className="w-4 h-4 text-[#4ECDC4]" />
            {property.location?.address
              ? `${property.location.address}, ${property.location.city}`
              : property.location?.city}
          </p>
        </div>

        {/* Price and Save CTA */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)] tracking-wider block">
              Listing Price
            </span>
            <span className="font-mono text-3xl font-extrabold text-[#4ECDC4]">
              {formatPrice(property.price, property.type)}
            </span>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`p-3 rounded-2xl border transition ${
              isSaved
                ? 'bg-[#EF4444] text-white border-[#EF4444]'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-default)]'
            }`}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left content (Gallery + Specs + Map), Right (Sticky Booking + Agent) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <PropertyImageGallery images={property.images} title={property.title} />

          {/* Key specs badge row */}
          <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-center shadow-sm">
            {property.bedrooms > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-[#6C63FF]">
                  <Bed className="w-5 h-5" />
                  <span className="font-bold text-lg text-[var(--text-primary)]">{property.bedrooms}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Bedrooms</p>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1 text-[#6C63FF]">
                  <Bath className="w-5 h-5" />
                  <span className="font-bold text-lg text-[var(--text-primary)]">{property.bathrooms}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Bathrooms</p>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-[#4ECDC4]">
                <Square className="w-5 h-5" />
                <span className="font-bold text-lg text-[var(--text-primary)] font-mono">
                  {property.area?.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Square Feet</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">About this Property</h3>
            <p className="text-sm sm:text-base text-[#9090B0] leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Amenities & Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-[#4ECDC4] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Location Map</h3>
            <PropertyMap
              coordinates={property.location?.coordinates}
              title={property.title}
            />
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-[var(--border-default)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Community Reviews</span>
                <span className="text-xs font-normal text-[var(--text-secondary)]">
                  ({reviews.length} reviews)
                </span>
              </h3>
              {property.avgRating > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-sm border border-[#F59E0B]/30">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{property.avgRating} / 5</span>
                </div>
              )}
            </div>

            {/* Post review form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-sm">
              <h4 className="text-sm font-semibold text-[var(--text-primary)]">Leave a Review</h4>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)]">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-[#F59E0B]"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating ? 'fill-[#F59E0B]' : 'text-[var(--text-muted)]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={3}
                placeholder="Share your experience regarding the property or viewing..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#6C63FF]"
              />
              <button
                type="submit"
                disabled={isAddingReview}
                className="px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#584fed] text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isAddingReview ? 'Posting...' : 'Submit Review'}
              </button>
            </form>

            {/* Review list */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">No reviews yet. Be the first to leave one!</p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <ProfileAvatar
                          src={rev.user?.avatar}
                          alt={rev.user?.name}
                          name={rev.user?.name}
                          className="w-7 h-7 rounded-full text-[10px]"
                        />
                        <span className="text-xs font-bold text-[var(--text-primary)]">{rev.user?.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-mono font-bold">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">{rev.comment}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{formatDate(rev.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card + Agent Profile */}
        <div className="space-y-6">
          {/* Agent Card */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6C63FF]">
              Listed By Agent
            </span>
            <div className="flex items-center gap-3">
              <ProfileAvatar
                src={property.agent?.avatar}
                alt={property.agent?.name}
                name={property.agent?.name}
                className="w-14 h-14 rounded-2xl ring-2 ring-[#6C63FF]/30 text-xs"
              />
              <div className="overflow-hidden">
                <h4 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5 truncate">
                  {property.agent?.name}
                  <UserCheck className="w-4 h-4 text-[#4ECDC4]" />
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">Certified Partner</p>
                <div className="flex items-center gap-1 text-[11px] text-[#4ECDC4] mt-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Identity Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              {property.agent?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#6C63FF]" />
                  <span>{property.agent.phone}</span>
                </div>
              )}
              {property.agent?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#4ECDC4]" />
                  <span className="truncate">{property.agent.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Booking Form */}
          <div className="sticky top-24 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-5 shadow-2xl">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Book a Private Viewing</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Schedule an in-person walkthrough with the property specialist.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Time Slot
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
                >
                  <option value="10:00 AM - 11:00 AM" className="bg-[var(--bg-surface)]">10:00 AM - 11:00 AM</option>
                  <option value="11:30 AM - 12:30 PM" className="bg-[var(--bg-surface)]">11:30 AM - 12:30 PM</option>
                  <option value="02:00 PM - 03:00 PM" className="bg-[var(--bg-surface)]">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM - 05:00 PM" className="bg-[var(--bg-surface)]">04:00 PM - 05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Optional Questions or Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inquiring about negotiable price or parking..."
                  value={bookingNote}
                  onChange={(e) => setBookingNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-bold text-xs shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                {isBooking ? 'Scheduling Appointment...' : 'Confirm Appointment Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
