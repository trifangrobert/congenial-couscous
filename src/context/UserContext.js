import React from "react";
import { createContext } from "react";

export const UserContext = createContext({draggable: false});

const UserProvider = (props) => {
  return (
    <UserContext.Provider value={props.value}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
