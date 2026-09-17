import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../../components/common/ProfileAvatar';
import {
  useGetAgentPropertiesQuery,
  useDeletePropertyMutation,
} from '../../features/properties/propertyApi';
import {
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation,
} from '../../features/bookings/bookingApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/helpers';
import {
  Building2,
  Calendar,
  PlusCircle,
  TrendingUp,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const { data: listingsData, isLoading: isListingsLoading } = useGetAgentPropertiesQuery();
  const { data: bookingsData, isLoading: isBookingsLoading } = useGetMyBookingsQuery();
  const [deleteProperty] = useDeletePropertyMutation();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const listings = listingsData?.data || [];
  const bookings = bookingsData?.data || [];

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to delete this property listing?')) {
      try {
        await deleteProperty(id).unwrap();
        toast.success('Property listing deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete listing');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBookingStatus({ id, status }).unwrap();
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8 transition-colors duration-300">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            src={user?.avatar}
            alt={user?.name}
            name={user?.name}
            className="w-16 h-16 rounded-2xl ring-2 ring-[#4ECDC4] text-sm"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              Agent Portal: {user?.name}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Verified Agency & Portfolio Operations Hub
            </p>
          </div>
        </div>

        <Link
          to="/properties/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-bold text-xs shadow-lg shadow-[#6C63FF]/20 hover:scale-105 transition"
        >
          <PlusCircle className="w-4 h-4" />
          List New Property
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4 overflow-x-auto">
        {[
          { id: 'overview', label: 'Portfolio Overview', icon: TrendingUp },
          { id: 'listings', label: `My Listings (${listings.length})`, icon: Building2 },
          { id: 'appointments', label: `Client Bookings (${bookings.length})`, icon: Calendar },
        ].map((tab) => {
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Active Listings</p>
              <p className="text-3xl font-extrabold font-mono text-[#6C63FF]">{listings.length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Total Client Inquiries</p>
              <p className="text-3xl font-extrabold font-mono text-[#4ECDC4]">{bookings.length}</p>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Pending Confirmations</p>
              <p className="text-3xl font-extrabold font-mono text-[#F59E0B]">
                {bookings.filter((b) => b.status === 'pending').length}
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-1 shadow-sm">
              <p className="text-xs font-bold uppercase text-[var(--text-secondary)]">Portfolio Value (PKR)</p>
              <p className="text-2xl font-extrabold font-mono text-[#10B981] truncate">
                {listings
                  .reduce((acc, curr) => acc + (curr.price || 0), 0)
                  .toLocaleString('en-PK')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Your Published Properties</h3>
            <Link
              to="/properties/create"
              className="text-xs text-[#4ECDC4] hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add New
            </Link>
          </div>

          {isListingsLoading ? (
            <LoadingSpinner size="md" />
          ) : listings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
              You haven't listed any properties yet. Click above to add your first property.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-sm">
              <table className="w-full text-left text-xs text-[var(--text-secondary)]">
                <thead className="text-[11px] uppercase tracking-wider text-[var(--text-primary)] border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
                  <tr>
                    <th className="p-4">Property</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {listings.map((prop) => (
                    <tr key={prop._id} className="hover:bg-white/[0.04]">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'}
                          alt={prop.title}
                          className="w-12 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-[var(--text-primary)] line-clamp-1">{prop.title}</p>
                          <span className="text-[10px] uppercase font-bold text-[#6C63FF]">
                            For {prop.type} &bull; {prop.propertyType}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">{prop.location?.city}</td>
                      <td className="p-4 font-mono font-bold text-[#4ECDC4]">
                        {formatPrice(prop.price, prop.type)}
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-bold text-[10px]">
                          {prop.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/properties/${prop._id}`}
                            className="p-1.5 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:text-[#6C63FF] border border-[var(--border-default)]"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(prop._id)}
                            className="p-1.5 rounded-lg bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/30"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Client Viewing Requests</h3>

          {isBookingsLoading ? (
            <LoadingSpinner size="md" />
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)]">
              No clients have booked viewing appointments on your listings yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{b.property?.title}</p>
                      <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                        {formatDate(b.date)} &bull; {b.timeSlot}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.status === 'confirmed'
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : b.status === 'pending'
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                          : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Client details */}
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1 text-xs">
                    <p className="text-[var(--text-primary)] font-semibold">Client: {b.user?.name}</p>
                    <p className="text-[var(--text-secondary)]">Email: {b.user?.email}</p>
                    {b.user?.phone && <p className="text-[var(--text-secondary)]">Phone: {b.user.phone}</p>}
                    {b.note && <p className="italic text-[var(--text-muted)]">Note: "{b.note}"</p>}
                  </div>

                  {/* Status actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'confirmed')}
                        className="flex-1 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#0ea372] text-white font-semibold text-xs"
                      >
                        Accept Appointment
                      </button>
                    )}
                    {b.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'completed')}
                        className="flex-1 py-1.5 rounded-lg bg-[#6C63FF] hover:bg-[#584fed] text-white font-semibold text-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'cancelled')}
                        className="px-3 py-1.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] font-semibold text-xs"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
