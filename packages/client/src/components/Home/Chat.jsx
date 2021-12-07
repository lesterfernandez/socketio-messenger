import { Heading } from "@chakra-ui/layout";
import { TabPanel, TabPanels } from "@chakra-ui/tabs";
import { useContext } from "react";
import { FriendContext } from "./Home";

const Chat = () => {
  const { friendList } = useContext(FriendContext);
  return friendList.length > 0 ? (
    <TabPanels>
      {friendList.map((friend, idx) => (
        <TabPanel key={idx}>
          <pre>{JSON.stringify(friend, null, 2)}</pre>
        </TabPanel>
      ))}
    </TabPanels>
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
