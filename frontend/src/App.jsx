import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load all pages for optimal code splitting
const Home = lazy(() => import('./pages/Home'));
const PropertyList = lazy(() => import('./pages/properties/PropertyList'));
const PropertyDetail = lazy(() => import('./pages/properties/PropertyDetail'));
const CreateProperty = lazy(() => import('./pages/properties/CreateProperty'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const AgentDashboard = lazy(() => import('./pages/dashboard/AgentDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppShell() {
  const location = useLocation();
  const showFooter = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            fontSize: '13px',
            boxShadow: 'var(--shadow-card)',
          },
        }}
      />

      <Navbar />

      <main className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-[70vh] flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading view..." />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/agent"
                element={
                  <ProtectedRoute roleRequired="agent">
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/properties/create"
                element={
                  <ProtectedRoute roleRequired="agent">
                    <CreateProperty />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
