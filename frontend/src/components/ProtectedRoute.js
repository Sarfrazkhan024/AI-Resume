import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]" data-testid="loading-screen">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FDE047] animate-bounce" style={{animationDelay: "0s"}} />
        <div className="w-3 h-3 rounded-full bg-[#A7F3D0] animate-bounce" style={{animationDelay: "0.15s"}} />
        <div className="w-3 h-3 rounded-full bg-[#C4B5FD] animate-bounce" style={{animationDelay: "0.3s"}} />
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
