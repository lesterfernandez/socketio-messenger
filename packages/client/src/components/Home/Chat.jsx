import { Heading } from "@chakra-ui/layout";
import { useContext } from "react";
import { FriendContext } from "./Home";

const Chat = () => {
  const { friendList } = useContext(FriendContext);
  return friendList.length > 0 ? (
    <pre>{JSON.stringify(friendList, null, 2)}</pre>
  ) : (
    <Heading textAlign="center" size="md">
      No friends... click on the chat icon to add a friend!
    </Heading>
  );
};

export default Chat;
