import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

const PrivateRouter = () => {
  const { session, loading } = UserAuth();

  if (loading) {
    return null;
  }

  return <>{session ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRouter;
