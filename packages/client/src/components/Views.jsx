import { Text } from "@chakra-ui/layout";
import { Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import SignUp from "./SignUp/SignUp";

const Views = () => {
  return (
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
