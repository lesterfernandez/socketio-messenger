import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../AccountContext";
import TextField from "../shared/TextField";

const SignUp = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [serverErrorMsg, setErrorMsg] = useState(null);
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

            if (data.loggedIn) {
              navigate("/home");
            } else if (!data.loggedIn && data.status) {
              setErrorMsg(data.status);
            }
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
        <Heading textAlign="center">Log In or Create Account</Heading>
        <Heading
          textAlign="center"
          size="md"
          color="red.500"
          display={serverErrorMsg ? "block" : "none"}
        >
          {serverErrorMsg}
        </Heading>

        <TextField
          name="username"
          size="lg"
          placeholder="enter username..."
          label="Username"
          autoComplete="off"
        />

        <TextField
          name="password"
          type="password"
          size="lg"
          placeholder="enter password..."
          label="Password"
          autoComplete="off"
        />
        <ButtonGroup>
          <Button type="submit" colorScheme="teal">
            Log in
          </Button>
          <Button colorScheme="teal" variant="outline" as={Link} to="/signup">
            Create Account
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
