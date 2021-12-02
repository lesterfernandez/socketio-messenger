import { Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { UserContext } from "./AccountContext";
import PrivateRoutes from "./PrivateRoutes";
import SignUp from "./SignUp/SignUp";

const Views = () => {
  const { userObject } = useContext(UserContext);
  return userObject.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Text>"home"</Text>} />
      </Route>
      <Route path="*" element={<SignUp />} />
    </Routes>
  );
};

export default Views;
