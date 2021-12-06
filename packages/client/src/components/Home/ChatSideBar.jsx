import { Button } from "@chakra-ui/button";
import { ChatIcon } from "@chakra-ui/icons";
import { Divider, Heading, HStack, VStack } from "@chakra-ui/layout";

const ChatSideBar = () => {
  return (
    <VStack borderRight="1px solid gray" h="100%" py="1rem">
      <HStack justify="space-evenly" w="100%">
        <Heading as="p" size="sm">
          Add Friend
        </Heading>
        <Button>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
    </VStack>
  );
};

export default ChatSideBar;
