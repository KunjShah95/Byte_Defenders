import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Core Pages
import LandingPage from '@/pages/Landing/LandingPage';
import HomePage from '@/pages/Home/HomePage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import ExplainabilityPage from '@/pages/Explainability/ExplainabilityPage';
import ResultPage from '@/pages/Result/ResultPage';
import SessionHistoryPage from '@/pages/SessionHistory/SessionHistoryPage';
import SessionDetailsPage from '@/pages/SessionDetails/SessionDetailsPage';

// Auth Pages
import LoginPage from '@/pages/Auth/LoginPage';
import SignupPage from '@/pages/Auth/SignupPage';
import ProfilePage from '@/pages/Profile/ProfilePage';

// Product Pages
import FeaturesPage from '@/pages/Features/FeaturesPage';
import PricingPage from '@/pages/Pricing/PricingPage';
import APIPage from '@/pages/API/APIPage';
import DocsPage from '@/pages/Docs/DocsPage';

// Company Pages
import AboutPage from '@/pages/About/AboutPage';
import BlogPage from '@/pages/Blog/BlogPage';
import CareersPage from '@/pages/Careers/CareersPage';
import ContactPage from '@/pages/Contact/ContactPage';

// Legal Pages
import PrivacyPage from '@/pages/Legal/PrivacyPage';
import TermsPage from '@/pages/Legal/TermsPage';
import SecurityPage from '@/pages/Legal/SecurityPage';
import ChangelogPage from '@/pages/Changelog/ChangelogPage';

// Settings Page
import SettingsPage from '@/pages/Settings/SettingsPage';

// Utility
import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Product Pages */}
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/api" element={<APIPage />} />
      <Route path="/docs" element={<DocsPage />} />

      {/* Company Pages */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Legal Pages */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />

      {/* Protected Routes */}
      <Route path="/create" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard/:sessionId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/explainability/:sessionId" element={<ProtectedRoute><ExplainabilityPage /></ProtectedRoute>} />
      <Route path="/result/:sessionId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><SessionHistoryPage /></ProtectedRoute>} />
      <Route path="/session/:sessionId" element={<ProtectedRoute><SessionDetailsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
