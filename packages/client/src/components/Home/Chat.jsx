import { Heading, Text, VStack } from "@chakra-ui/layout";
import { TabPanel, TabPanels } from "@chakra-ui/tabs";
import { useContext } from "react";
import ChatBox from "./ChatBox";
import { FriendContext, MessagesContext } from "./Home";

const Chat = ({ friendIndex }) => {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);

  return friendList.length > 0 ? (
    <VStack justify="end" maxH="100vh" h="100%">
      <TabPanels>
        {friendList.map(friend => (
          <VStack
            flexDir="column-reverse"
            as={TabPanel}
            key={"chat: " + friend.userID}
            w="100%"
            overflowY="scroll"
          >
            {messages
              .filter(
                msg => msg.to === friend.userID || msg.from === friend.userID
              )
              .map((msg, idx) => {
                return (
                  <Text
                    key={"chat:" + friend.userID + idx}
                    fontSize="lg"
                    m={
                      msg.to === friend.userID
                        ? "1rem 0 0 auto !important"
                        : "1rem auto 0 0 !important"
                    }
                    color={msg.to === friend.userID ? "gray.800" : "gray.800"}
                    bg={msg.to === friend.userID ? "blue.100" : "gray.100"}
                    borderRadius="10px"
                    p="0.5rem 1rem"
                  >
                    {msg.content}
                  </Text>
                );
              })}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userID={friendList[friendIndex].userID} />
    </VStack>
  ) : (
    <TabPanels>
      <TabPanel>
        <Heading textAlign="center" size="md" pt="4rem">
          No friends... click on the chat icon to add a friend!
        </Heading>
      </TabPanel>
    </TabPanels>
  );
};

export default Chat;
