import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '@/pages/Landing/LandingPage';
import HomePage from '@/pages/Home/HomePage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import ExplainabilityPage from '@/pages/Explainability/ExplainabilityPage';
import ResultPage from '@/pages/Result/ResultPage';
import SessionHistoryPage from '@/pages/SessionHistory/SessionHistoryPage';
import SessionDetailsPage from '@/pages/SessionDetails/SessionDetailsPage';

import LoginPage from '@/pages/Auth/LoginPage';
import SignupPage from '@/pages/Auth/SignupPage';
import ProfilePage from '@/pages/Profile/ProfilePage';

import FeaturesPage from '@/pages/Features/FeaturesPage';
import PricingPage from '@/pages/Pricing/PricingPage';
import APIPage from '@/pages/API/APIPage';
import DocsPage from '@/pages/Docs/DocsPage';

import AboutPage from '@/pages/About/AboutPage';
import BlogPage from '@/pages/Blog/BlogPage';
import CareersPage from '@/pages/Careers/CareersPage';
import ContactPage from '@/pages/Contact/ContactPage';

import PrivacyPage from '@/pages/Legal/PrivacyPage';
import TermsPage from '@/pages/Legal/TermsPage';
import SecurityPage from '@/pages/Legal/SecurityPage';
import ChangelogPage from '@/pages/Changelog/ChangelogPage';

import SettingsPage from '@/pages/Settings/SettingsPage';
import AuditDashboardPage from '@/pages/AuditDashboard/AuditDashboardPage';

import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/api" element={<APIPage />} />
      <Route path="/docs" element={<DocsPage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />

      <Route path="/create" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard/:sessionId" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/explainability/:sessionId" element={<ProtectedRoute><ExplainabilityPage /></ProtectedRoute>} />
      <Route path="/result/:sessionId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><SessionHistoryPage /></ProtectedRoute>} />
      <Route path="/session/:sessionId" element={<ProtectedRoute><SessionDetailsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/audit" element={<ProtectedRoute><AuditDashboardPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
