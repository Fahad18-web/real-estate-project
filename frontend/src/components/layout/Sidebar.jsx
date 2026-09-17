import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../common/ProfileAvatar';
import {
  LayoutDashboard,
  Building,
  Calendar,
  Heart,
  User,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar() {
  const { user, isAgent, isAdmin } = useAuth();

  const userNavItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/dashboard?tab=bookings', icon: Calendar },
    { name: 'Saved Properties', path: '/dashboard?tab=saved', icon: Heart },
    { name: 'My Profile', path: '/dashboard?tab=profile', icon: User },
  ];

  const agentNavItems = [
    { name: 'Agent Dashboard', path: '/dashboard/agent', icon: LayoutDashboard },
    { name: 'My Listings', path: '/dashboard/agent?tab=listings', icon: Building },
    { name: 'Client Appointments', path: '/dashboard/agent?tab=appointments', icon: Calendar },
    { name: 'Add New Property', path: '/properties/create', icon: PlusCircle },
  ];

  const items = isAgent ? agentNavItems : userNavItems;

  return (
    <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-default)] min-h-[calc(100vh-80px)] p-6 flex flex-col justify-between hidden md:flex transition-colors duration-300">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-[var(--border-default)]">
          <ProfileAvatar
            src={user?.avatar}
            alt={user?.name}
            name={user?.name}
            className="w-12 h-12 rounded-xl ring-2 ring-[#6C63FF]/40 text-xs"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate">{user?.name}</h4>
            <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#6C63FF]/20 text-[#6C63FF]">
              {user?.role}
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30 font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {isAgent && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-transparent border border-[#6C63FF]/30 text-xs">
          <p className="font-semibold text-[var(--text-primary)] mb-1">Agent Priority Mode</p>
          <p className="text-[var(--text-secondary)]">
            You have permissions to create listings, update availability, and confirm viewing appointments.
          </p>
        </div>
      )}
    </aside>
  );
}
