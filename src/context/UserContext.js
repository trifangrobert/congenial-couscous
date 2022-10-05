import React, { createContext, useContext, useMemo, useState } from "react";

export const UserContext = createContext({
  ingame: false,
  setIngame: () => {},
});
export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [ingame, setIngame] = useState(false);
  const value = useMemo(() => ({ ingame, setIngame }), [ingame]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
