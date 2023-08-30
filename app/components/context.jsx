import React, { useState } from "react";

const ChatSetupContext = React.createContext();

export default ChatSetupContext;

export const ChatSetupProvider = ({ children }) => {
  const [chatSetupBackend, setChatSetupBackend] = useState({});
  const [chatSetupFrontend, setChatSetupFrontend] = useState({});

  return (
    <ChatSetupContext.Provider
      value={{
        chatSetupBackend,
        setChatSetupBackend,
        chatSetupFrontend,
        setChatSetupFrontend,
      }}
    >
      {children}
    </ChatSetupContext.Provider>
  );
};
