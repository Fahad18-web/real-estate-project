import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useLoginMutation } from '../../features/auth/authApi';
import { Building2, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      const { user, accessToken } = res.data;
      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'agent') {
        navigate('/dashboard/agent');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 pt-24 pb-12 transition-colors duration-300">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#6C63FF] to-[#4ECDC4]" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center mx-auto shadow-lg shadow-[#6C63FF]/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-(--text-primary)">Sign In to EstatePulse</h2>
          <p className="text-xs text-(--text-secondary)">
            Access your saved favorites, appointment bookings, and analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-(--text-muted)" />
              <input
                type="email"
                {...register('email')}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-(--bg-elevated) border text-xs text-(--text-primary) focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-(--border-default) focus:ring-[#6C63FF]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-(--text-muted)" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-(--bg-elevated) border text-xs text-(--text-primary) focus:outline-none focus:ring-1 ${
                  errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-(--border-default) focus:ring-[#6C63FF]'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-bold text-xs shadow-lg shadow-[#6C63FF]/20 hover:opacity-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-(--text-secondary)">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#4ECDC4] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
