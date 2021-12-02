import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const UserContext = createContext();

const AccountContext = ({ children }) => {
  const [userObject, setUser] = useState({ loggedIn: null });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/auth/login`, {
      credentials: "include",
    })
      .catch(() => {
        setUser({ loggedIn: false });
        return;
      })
      .then(r => {
        if (!r || r.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return r.json();
      })
      .then(data => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        console.log("account data: ", { ...data });
        setUser({ ...data });
        navigate("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ userObject, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default AccountContext;
