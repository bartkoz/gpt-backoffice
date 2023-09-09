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
    welcome_message: "Hello I'm virtual assistant how may I help you?",
    bar_message: "👋  Glad to help you whenever I can!",
    recommendation_message: "Based on search I recommend",
    recommendation_button_text: "Check",
    recommendation_currency: "$",
    feedback_thank_you: "Thank you for you feedback",
    feedback_positive: "Upvote",
    feedback_negative: "Downvote",
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
