import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { UserContext } from "./AccountContext";

const useAuth = () => {
  const { userObject } = useContext(UserContext);
  return userObject && userObject.loggedIn === true;
};

const PrivateRoutes = () => {
  const location = useLocation();
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" state={{ from: location }} />;
};

export default PrivateRoutes;
