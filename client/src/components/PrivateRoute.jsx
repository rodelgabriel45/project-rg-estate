import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const currentUserData = currentUser?.data;

  return currentUserData ? <Outlet /> : <Navigate to="/sign-in" />;
}
