import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "./AccountContext";

export const useAuth = () => {
  const { userObject } = useContext(UserContext);
  return userObject && userObject.loggedIn === true;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
