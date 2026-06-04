import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-poppins font-bold text-primary mb-2">Access Restricted</h1>
        <p className="font-open-sans text-gray-600 max-w-md">
          Your account does not have admin access. Please contact the site administrator to be granted access.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
