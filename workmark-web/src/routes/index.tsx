import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { UserRole } from '../types';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Public Pages
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import Contact from '../pages/Contact';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { JobsPage } from '../pages/jobs/JobsPage';
import { JobDetailsPage } from '../pages/jobs/JobDetailsPage';
import { CompaniesPage } from '../pages/companies/CompaniesPage';
import CompanyDetailsPage from '../pages/companies/CompanyDetailsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import NotificationsPage from '../pages/NotificationsPage';

// Job Seeker Pages
import { SeekerDashboard } from '../pages/seeker/SeekerDashboard';
import { ApplicationsPage } from '../pages/seeker/ApplicationsPage';
import { SavedJobsPage } from '../pages/seeker/SavedJobsPage';
import { ProfilePage } from '../pages/seeker/ProfilePage';
import EditProfilePage from '../pages/seeker/EditProfilePage';

// Employer Pages
import { EmployerDashboard } from '../pages/employer/EmployerDashboard';
import JobsManagementPage from '../pages/employer/JobsManagementPage';
import CreateJobPage from '../pages/employer/CreateJobPage';
import EditJobPage from '../pages/employer/EditJobPage';
import CreateCompanyPage from '../pages/employer/CreateCompanyPage';
import EditCompanyPage from '../pages/employer/EditCompanyPage';
import ApplicantsPage from '../pages/employer/ApplicantsPage';
import CandidateDetailsPage from '../pages/employer/CandidateDetailsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import CompaniesManagement from '../pages/admin/CompaniesManagement';
import JobsManagement from '../pages/admin/JobsManagement';
import ReportsPage from '../pages/admin/ReportsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('ProtectedRoute must be used within AuthProvider');
  }

  const { isAuthenticated, isLoading, user } = authContext;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:id" element={<CompanyDetailsPage />} />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Job Seeker Routes */}
        <Route
          path="seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="seeker/applications"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seeker/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <SavedJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seeker/profile"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="seeker/profile/edit"
          element={
            <ProtectedRoute allowedRoles={['job_seeker']}>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Employer Routes */}
        <Route
          path="employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/jobs"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <JobsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/jobs/create"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <CreateJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EditJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/jobs/:id/applicants"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/applicants/:id"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <CandidateDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/company/create"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <CreateCompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/company"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EditCompanyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employer/company/edit"
          element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EditCompanyPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/companies"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CompaniesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <JobsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
