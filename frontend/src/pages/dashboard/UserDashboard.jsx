import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import axiosInstance from '../../utils/axios';
import { updateUser } from '../../features/auth/authSlice';
import {
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} from '../../features/bookings/bookingApi';
import {
  useGetSavedPropertiesQuery,
  useUnsavePropertyMutation,
} from '../../features/properties/propertyApi';
import PropertyCard from '../../components/property/PropertyCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatPrice } from '../../utils/helpers';
import {
  Calendar,
  Heart,
  User,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const { data: bookingsData, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const { data: savedData, isLoading: isSavedLoading } = useGetSavedPropertiesQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [unsaveProperty] = useUnsavePropertyMutation();

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setAvatarPreview(user?.avatar || '');
    setAvatarFile(null);
  }, [user]);

  const bookings = bookingsData?.data || [];
  const savedProperties = savedData?.data || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: `My Bookings (${bookings.length})`, icon: Calendar },
    { id: 'saved', label: `Saved Favorites (${savedProperties.length})`, icon: Heart },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this viewing appointment?')) {
      try {
        await cancelBooking(id).unwrap();
        toast.success('Viewing appointment cancelled');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSavingProfile(true);

      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('phone', profileForm.phone || '');
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await axiosInstance.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      dispatch(updateUser(response.data.data));
      setAvatarFile(null);
      setAvatarPreview(response.data.data.avatar || '');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full border border-[#10B981]/30">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/15 px-2.5 py-0.5 rounded-full border border-[#F59E0B]/30">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/15 px-2.5 py-0.5 rounded-full border border-[#EF4444]/30">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9090B0] bg-white/5 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 transition-colors duration-300">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <ProfileAvatar
            src={user?.avatar}
            alt={user?.name}
            name={user?.name}
            className="w-20 h-20 rounded-2xl ring-4 ring-[#6C63FF]/30 text-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{user?.name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#6C63FF]">
                {user?.role}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user?.email}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              Member since {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>

        <Link
          to="/properties"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white text-xs font-semibold shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition"
        >
          Explore More Properties
        </Link>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20'
                  : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Total Appointments</p>
              <p className="text-3xl font-extrabold font-mono text-[#6C63FF]">
                {bookings.length}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Saved Listings</p>
              <p className="text-3xl font-extrabold font-mono text-[#4ECDC4]">
                {savedProperties.length}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Confirmed Tours</p>
              <p className="text-3xl font-extrabold font-mono text-[#10B981]">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </p>
            </div>
          </div>

          {/* Recent Appointments table */}
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Upcoming Viewing Appointments</h3>
              <button
                onClick={() => setSearchParams({ tab: 'bookings' })}
                className="text-xs text-[#6C63FF] hover:underline"
              >
                View all
              </button>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-[#9090B0] py-4">No appointments scheduled yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#9090B0]">
                  <thead className="text-[11px] uppercase tracking-wider text-white border-b border-white/10">
                    <tr>
                      <th className="pb-3">Property</th>
                      <th className="pb-3">Date & Slot</th>
                      <th className="pb-3">Agent</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.slice(0, 3).map((b) => (
                      <tr key={b._id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 pr-3 text-white font-medium">
                          {b.property?.title}
                        </td>
                        <td className="py-3.5 pr-3 font-mono">
                          {formatDate(b.date)} &bull; {b.timeSlot}
                        </td>
                        <td className="py-3.5 pr-3">{b.agent?.name}</td>
                        <td className="py-3.5 pr-3">{statusBadge(b.status)}</td>
                        <td className="py-3.5">
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              className="text-[11px] text-[#EF4444] hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">All Viewing Appointments</h3>
          {isBookingsLoading ? (
            <LoadingSpinner size="md" />
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
              You haven't booked any property tours yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/properties/${booking.property?._id}`}
                        className="font-bold text-sm text-[var(--text-primary)] hover:text-[#6C63FF] line-clamp-1"
                      >
                        {booking.property?.title}
                      </Link>
                      <p className="text-xs text-[#4ECDC4] font-mono mt-0.5">
                        {formatPrice(booking.property?.price)}
                      </p>
                    </div>
                    {statusBadge(booking.status)}
                  </div>

                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#6C63FF]" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#4ECDC4]" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Agent: {booking.agent?.name} ({booking.agent?.phone || 'Verified'})</span>
                    </div>
                    {booking.note && (
                      <p className="text-[11px] italic bg-[var(--bg-surface)] p-2 rounded-lg text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        "{booking.note}"
                      </p>
                    )}
                  </div>

                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="w-full py-2 rounded-xl bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-xs font-semibold transition"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED FAVORITES TAB */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Your Saved Favorites</h3>
          {isSavedLoading ? (
            <LoadingSpinner size="md" />
          ) : savedProperties.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
              No saved properties yet. Click the heart icon on any listing to save it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} isSaved={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <ProfileAvatar
                src={avatarPreview}
                alt={user?.name}
                name={user?.name}
                className="w-24 h-24 rounded-3xl ring-4 ring-[#6C63FF]/30 text-lg shrink-0"
              />

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Profile Settings</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Update your avatar, display name, and phone number.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs font-semibold text-[var(--text-primary)] cursor-pointer hover:border-[#6C63FF]/50 transition">
                  <span>Choose Avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white text-xs font-semibold shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
