import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function SignInPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserData = currentUser?.data;

  return currentUserData ? <Navigate to="/profile" /> : <Outlet />;
}
