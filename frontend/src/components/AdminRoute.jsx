import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function AdminRoute() {
  const { user, isLoggedIn } = useAuth();

  const location = useLocation();

  // User is not logged in
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // User is logged in but is not an admin
  if (user?.role !== "ADMIN") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // User is an admin
  return <Outlet />;
}

export default AdminRoute;