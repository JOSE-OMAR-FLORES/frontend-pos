import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const roleMap = {
  "/pos": "pos",
  "/kitchen": "kitchen",
  "/analytics": "analytics",
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole, setRedirectPath } = useAuth();
  const location = useLocation();
  const expectedRole = roleMap[location.pathname];

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(location.pathname);
    }
  }, [isAuthenticated, location.pathname, setRedirectPath]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (expectedRole && userRole !== expectedRole) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-600 font-bold">
          Acceso denegado: no tienes permiso para esta sección
        </h1>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
