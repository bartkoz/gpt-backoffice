import React, { useState } from "react";

const ChatSetupContext = React.createContext();

export default ChatSetupContext;

export const ChatSetupProvider = ({ children }) => {
  const [chatSetupBackend, setChatSetupBackend] = useState({
    language: "en",
    dynamic_context: "",
  });
  const [chatSetupFrontend, setChatSetupFrontend] = useState({
    background_color: "#00214d",
    font_color: "#FFFFFF",
    bar_message: "Hello I'm virtual assistant how may I help you?",
    welcome_message: "👋  Glad to help you whenever I can!",
    recommendation_message: "Based on search I recommend",
    recommendation_button_text: "Check",
    recommendation_currency: "$",
  });

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
