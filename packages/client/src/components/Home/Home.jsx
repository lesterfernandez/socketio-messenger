import { Grid, GridItem } from "@chakra-ui/layout";
import { Tabs } from "@chakra-ui/tabs";
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../../socket";
import { UserContext } from "../AccountContext";
import Chat from "./Chat";
import ChatSideBar from "./ChatSideBar";

export const FriendContext = createContext();
export const MessagesContext = createContext();

// const initialMessages ={}

// const msgReducer = (messages, action) => {
//   switch (action.type) {
//     case "messages":
//       Object.keys(messages).map(chatUsername => {

//       })
//       return messages;
//     case "private message":
//       return messages;
//     default:
//       return messages;
//   }
// };

const Home = () => {
  const { setUser } = useContext(UserContext);
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendIndex, setFriendIndex] = useState(0);

  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    socket.on("connect", () => {
      // console.log("connected to socketio server");
    });
    socket.on("friends", friends => {
      // console.log("friends: ", friends);
      setFriendList(friends);
    });
    socket.on("offline", username => {
      console.log("friend offline: ", username);
      setFriendList(c =>
        c.map(friend => {
          return friend.username === username
            ? { ...friend, connected: "false" }
            : friend;
        })
      );
    });
    socket.on("online", username => {
      setFriendList(c =>
        c.map(friend => {
          return friend.username === username
            ? { ...friend, connected: "true" }
            : friend;
        })
      );
    });
    socket.on("private message", newMsg => {
      setMessages(c => [newMsg, ...c]);
    });
    socket.on("messages", messages => {
      setMessages(messages);
    });
    return () => {
      socket.off("connect_error");
      socket.off("connect");
      socket.off("friends");
      socket.off("offline");
      socket.off("online");
      socket.off("private message");
      socket.off("messages");
    };
  }, [setUser]);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid
        templateColumns="repeat(10, 1fr)"
        width="100%"
        as={Tabs}
        onChange={index => setFriendIndex(index)}
        maxH="100vh"
        pos="relative"
      >
        <GridItem colSpan="3">
          <ChatSideBar />
        </GridItem>
        <GridItem gridColumn="4 / -1" bottom="0" top="0" maxH="100vh">
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <Chat friendIndex={friendIndex} />
          </MessagesContext.Provider>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
