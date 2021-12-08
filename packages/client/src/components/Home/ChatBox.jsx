import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { HStack } from "@chakra-ui/layout";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import socket from "../../socket";
import { MessagesContext } from "./Home";

const ChatBox = ({ userID }) => {
  const { setMessages } = useContext(MessagesContext);
  return (
    <Formik
      initialValues={{ message: "" }}
      validationScheme={Yup.object({
        message: Yup.string().required().min(1).max(255),
      })}
      onSubmit={(values, actions) => {
        const message = { content: values.message, to: userID, from: null };
        socket.emit("private message", message, newMsg => {
          setMessages(c => [newMsg, ...c]);
        });
        actions.resetForm();
      }}
    >
      <HStack as={Form} pb="1.4rem" w="100%" px="1.4rem">
        <Input
          as={Field}
          name="message"
          placeholder="Type message here.."
          size="lg"
          autoComplete="off"
        />
        <Button type="submit" size="lg" colorScheme="teal">
          Send
        </Button>
      </HStack>
    </Formik>
  );
};

export default ChatBox;
