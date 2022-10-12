import React, { createContext, useContext, useMemo, useState } from "react";

export const UserContext = createContext({
  showCode: false,
  setShowCode: () => {},
});
export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const [showCode, setShowCode] = useState(false);
  const value = useMemo(() => ({ showCode, setShowCode }), [showCode]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
