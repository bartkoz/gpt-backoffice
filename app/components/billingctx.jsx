import React, { useState } from "react";

const GlobalDataContext = React.createContext();
export default GlobalDataContext;

export const GlobalDataProvider = ({ children }) => {
  const [Test, setTest] = useState({
    test: "test",
  });

  return (
    <GlobalDataContext.Provider
      value={{
        Test,
        setTest,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};
