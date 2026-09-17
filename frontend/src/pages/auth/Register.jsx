import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useRegisterMutation } from '../../features/auth/authApi';
import { Building2, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['user', 'agent']),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data).unwrap();
      const { user, accessToken } = res.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success('Account created successfully!');

      if (user.role === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 pt-28 pb-12 transition-colors duration-300">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4]" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center mx-auto shadow-lg shadow-[#6C63FF]/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Create an Account</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Join thousands finding & listing prime real estate properties.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                {...register('name')}
                placeholder="Hamza Farooq"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border text-xs text-[var(--text-primary)] focus:outline-none ${
                  errors.name ? 'border-[#EF4444]' : 'border-[var(--border-default)] focus:border-[#6C63FF]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                {...register('email')}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border text-xs text-[var(--text-primary)] focus:outline-none ${
                  errors.email ? 'border-[#EF4444]' : 'border-[var(--border-default)] focus:border-[#6C63FF]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                {...register('phone')}
                placeholder="+92 300 1234567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="password"
                {...register('password')}
                placeholder="At least 6 characters"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border text-xs text-[var(--text-primary)] focus:outline-none ${
                  errors.password ? 'border-[#EF4444]' : 'border-[var(--border-default)] focus:border-[#6C63FF]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] cursor-pointer hover:border-[#6C63FF]">
                <input
                  type="radio"
                  value="user"
                  {...register('role')}
                  className="accent-[#6C63FF]"
                />
                <span className="text-xs text-[var(--text-primary)] font-medium">Buyer / Tenant</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] cursor-pointer hover:border-[#4ECDC4]">
                <input
                  type="radio"
                  value="agent"
                  {...register('role')}
                  className="accent-[#4ECDC4]"
                />
                <span className="text-xs text-[var(--text-primary)] font-medium">Agent / Broker</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-bold text-xs shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Get Started'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4ECDC4] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
