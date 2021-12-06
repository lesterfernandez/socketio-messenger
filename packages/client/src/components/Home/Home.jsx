import { Grid, GridItem } from "@chakra-ui/layout";
import { createContext, useContext, useEffect, useState } from "react";
import socket from "../../socket";
import { UserContext } from "../AccountContext";
import Chat from "./Chat";
import ChatSideBar from "./ChatSideBar";

export const FriendContext = createContext();

const Home = () => {
  const { setUser } = useContext(UserContext);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    socket.on("connect", () => {
      console.log("connected to socketio server");
    });
    socket.on("friends", friends => {
      console.log("friends: ", friends);
      setFriendList(friends);
    });
    return () => {
      socket.off("connect_error");
      socket.off("connect");
      socket.off("friends");
    };
  }, [setUser]);

  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid templateColumns="repeat(10, 1fr)" width="100%" minH="100vh">
        <GridItem colSpan="3">
          <ChatSideBar />
        </GridItem>
        <GridItem gridColumn="4 / -1">
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
