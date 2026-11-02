import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AppLayout from '../components/layout/AppLayout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Users';
import DocumentDetail from '../pages/NotFound';
import Upload from '../pages/Upload';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element=<PublicRoute><Login /></PublicRoute> />
      <Route path="/register" element=<PublicRoute><Register /></PublicRoute> />

      {/* Protégé */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element=<Dashboard /> />
        <Route path="/documents" element=<Documents /> />
        <Route path="/documents/:id" element=<DocumentDetail /> />
        <Route
          path="/upload"
          element={
            <ProtectedRoute roles={['user']}>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element=<Settings /> />
      </Route>

      {/* Redirections */}
      <Route path="/" element=<Navigate to="/dashboard" replace /> />
      <Route path="*" element=<NotFound /> />
    </Routes>
  );
}