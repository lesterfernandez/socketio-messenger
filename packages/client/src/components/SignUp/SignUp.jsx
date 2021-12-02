import { Button, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../AccountContext";
import TextField from "./TextField";

const SignUp = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username is required")
          .min(6, "Username must be at least 6 characters"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      })}
      onSubmit={(values, actions) => {
        fetch(`http://localhost:4000/auth/login`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(r => r.json())
          .then(data => {
            console.log("response from server after login: ", { ...data });
            setUser({ ...data });
            navigate("/home");
          });
        actions.resetForm();
      }}
    >
      <VStack
        as={Form}
        h="100vh"
        justifyContent="center"
        spacing="1rem"
        w={{ base: "90%", md: "500px" }}
        m="auto"
      >
        <Heading textAlign="center">Sign in or Create Account</Heading>

        <TextField
          name="username"
          size="lg"
          placeholder="enter username..."
          label="Username"
        />

        <TextField
          name="password"
          type="password"
          size="lg"
          placeholder="enter password..."
          label="Password"
        />

        <Button type="submit" colorScheme="teal">
          Log in
        </Button>
      </VStack>
    </Formik>
  );
};

export default SignUp;
