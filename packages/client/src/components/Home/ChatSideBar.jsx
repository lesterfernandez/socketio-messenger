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
import { useContext } from "react";
import { FriendContext } from "./Home";
import NewFriendModal from "./NewFriendModal";

const ChatSideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { friendList } = useContext(FriendContext);
  return (
    <>
      <VStack borderRight="1px solid gray" h="100%" py="1rem">
        <HStack justify="space-evenly" w="100%">
          <Heading as="p" size="sm">
            Add Friend
          </Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        {friendList.length > 0 &&
          friendList.map((friendObject, idx) => (
            <HStack>
              <Circle
                bg={friendObject.connected ? "green" : "red.300"}
                height="20px"
                width="20px"
              />
              <Text key={idx}>{friendObject.username}</Text>
            </HStack>
          ))}
      </VStack>
      <NewFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ChatSideBar;
