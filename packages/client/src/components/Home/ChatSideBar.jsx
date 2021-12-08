import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import {
  Circle,
  Divider,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Tab, TabList } from "@chakra-ui/tabs";
import { useContext } from "react";
import socket from "../../socket";
import { UserContext } from "../AccountContext";
import { FriendContext } from "./Home";
import NewFriendModal from "./NewFriendModal";

const ChatSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { friendList } = useContext(FriendContext);
  const { userObject, setUser } = useContext(UserContext);
  return (
    <>
      <VStack borderRight="1px solid gray" h="100vh" py="1rem">
        <HStack justify="space-evenly" w="100%">
          <Heading as="p" size="sm">
            Add Friend
          </Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList.length > 0 &&
            friendList.map((friendObject, idx) => (
              <HStack as={Tab} key={"label:" + idx}>
                <Circle
                  bg={friendObject.connected === "true" ? "green" : "red.300"}
                  height="20px"
                  width="20px"
                />
                <Text>{friendObject.username}</Text>
              </HStack>
            ))}
        </VStack>
        <HStack mt="auto" pos="absolute" bottom="0" left="0" p="1rem">
          <Button
            size="sm"
            onClick={() => {
              socket.emit("logout");
              setUser({ loggedIn: false });
            }}
          >
            Log Out
          </Button>
          <Heading size="xs">Signed In as {userObject.username}</Heading>
        </HStack>
      </VStack>
      <NewFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ChatSideBar;
