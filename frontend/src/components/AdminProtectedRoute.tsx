import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authstore";
import LoadingOverlay from "./LoadingOverlay";

// interface AdminProtectedRouteProps {
//   children: ReactNode;
// }

const AdminProtectedRoute = ({ children }: {children : ReactNode}) => {
  const authstore = useAuthStore();

  if (authstore.isLoading) {
    return <LoadingOverlay />;
  }

  if (!authstore.isAuthenticated) {
    return <Navigate to="/login" replace />;        // replace - removes URL history
  }

  if (authstore.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminProtectedRoute;