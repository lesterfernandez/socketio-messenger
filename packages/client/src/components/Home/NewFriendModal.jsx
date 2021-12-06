import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import socket from "../../socket";
import TextField from "../shared/TextField";

const NewFriendModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter friend's username</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: "" }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required("Username required")
              .min(6, "Invalid username")
              .max(28, "Invalid username"),
          })}
          onSubmit={(values, actions) => {
            socket.emit("add friend", values.friendName);
            actions.resetForm();
          }}
        >
          <Form>
            <ModalBody>
              <TextField label="Username" name="friendName" />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" type="submit" onClick={onClose}>
                Start Chatting
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default NewFriendModal;
