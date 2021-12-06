import { Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import socket from "../../socket";
import { UserContext } from "../AccountContext";

const Home = () => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    socket.connect();
    socket.on("connect_error", () => {
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setUser]);

  return <Text>Welcome Home...</Text>;
};

export default Home;
