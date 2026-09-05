import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authstore";
import LoadingOverlay from "./LoadingOverlay";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

const ProtectedRoute = ({ children }: {children: ReactNode} ) => {  // childern represnet reactnode type : here <Home> is that 
  const authstore = useAuthStore();

  if (authstore.isLoading) {
    return <><LoadingOverlay/></>;
  }

  if (!authstore.isAuthenticated) {
    return <Navigate to="/login" replace />;  // replace त्यामुळे Back दाबल्यावर /home वर जाणार नाही.
  }

  return children;    // render whatever was placed inside ProtectedRoute
};

export default ProtectedRoute;