// /frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  if (checking) return <div style={{ padding: 24 }}>Loading…</div>;
  return user ? children : <Navigate to="/signup" replace />;
}
