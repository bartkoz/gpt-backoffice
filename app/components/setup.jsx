import {
  Form,
  FormLayout,
  Select,
  TextField,
  Button,
  Card,
  VerticalStack,
  Loading,
  Frame,
  Toast,
  HorizontalStack,
} from "@shopify/polaris";
import { useEffect, useContext, useState, useCallback } from "react";
import axios from "axios";
import ChatSetupContext from "~/components/context";

export default function SetupForm({ shop }) {
  const [isLoading, setIsLoading] = useState(true);
  const {
    chatSetupBackend,
    setChatSetupBackend,
    chatSetupFrontend,
    setChatSetupFrontend,
  } = useContext(ChatSetupContext);
  const [isSaving, setIsSaving] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const handleSubmit = async () => {
    setIsSaving(true);
    await axios
      .post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/update-chat-conf/?store_name=${shop}`,
        {
          backend: chatSetupBackend,
          frontend: chatSetupFrontend,
        }
      )
      .then(() => {
        setIsSaving(false);
        toggleActive();
      });
  };

  const resetToDefault = () => {
    setChatSetupBackend({
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
      ask_a_question: "Ask a question...",
      write_an_answer: "Write an answer",
    });
    setChatSetupFrontend({
      language: "en",
      dynamic_context: "",
    });
  };
  useEffect(() => {
    const getSetup = async () => {
      try {
        const response = await axios.get(
          `https://backend-rvm4xlf6ba-ey.a.run.app/get-chat-conf/?store_name=${shop}`
        );
        if (response.data.backend) {
          setChatSetupBackend(response.data.backend);
        }
        if (response.data.frontend) {
          setChatSetupFrontend(response.data.frontend);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations data:", error);
      }
    };
    getSetup();
  }, []);
  const handleChatSetupBackendChange = (event) => {
    const { name, value } = event.target;
    setChatSetupBackend((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChatSetupFrontendChange = (event) => {
    const { name, value } = event.target;
    setChatSetupFrontend((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const options = [
    { label: "Arabic", value: "ar" },
    { label: "Bengali", value: "bn" },
    { label: "Bulgarian", value: "bg" },
    { label: "Chinese (Simplified)", value: "zh-CN" },
    { label: "Chinese (Traditional)", value: "zh-TW" },
    { label: "Czech", value: "cs" },
    { label: "Danish", value: "da" },
    { label: "Dutch", value: "nl" },
    { label: "English", value: "en" },
    { label: "Filipino", value: "tl" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Greek", value: "el" },
    { label: "Gujarati", value: "gu" },
    { label: "Hebrew", value: "he" },
    { label: "Hindi", value: "hi" },
    { label: "Hungarian", value: "hu" },
    { label: "Indonesian", value: "id" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Kannada", value: "kn" },
    { label: "Korean", value: "ko" },
    { label: "Malay", value: "ms" },
    { label: "Malayalam", value: "ml" },
    { label: "Marathi", value: "mr" },
    { label: "Norwegian", value: "no" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese", value: "pt" },
    { label: "Punjabi", value: "pa" },
    { label: "Romanian", value: "ro" },
    { label: "Russian", value: "ru" },
    { label: "Spanish", value: "es" },
    { label: "Swedish", value: "sv" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Thai", value: "th" },
    { label: "Turkish", value: "tr" },
    { label: "Ukrainian", value: "uk" },
    { label: "Urdu", value: "ur" },
    { label: "Vietnamese", value: "vi" },
  ];

  return (
    <Frame>
      {active && <Toast content="Saved!" onDismiss={toggleActive} />}
      {isLoading && <Loading />}
      <ui-title-bar title="Chat settings" />
      <HorizontalStack wrap={false} gap={1}>
        {" "}
        <Button
          onClick={handleSubmit}
          primarySuccess={true}
          disabled={isSaving || isLoading}
        >
          Save
        </Button>
        <Button onClick={resetToDefault} destructive={true}>
          Reset to default
        </Button>
      </HorizontalStack>
      <VerticalStack gap="1">
        <Form>
          <FormLayout>
            {/*<Card>*/}
            {/*  <Checkbox*/}
            {/*    label="Recommend products from the store"*/}
            {/*    disabled={isLoading}*/}
            {/*    checked={chatSetupBackend.recommendations ?? false}*/}
            {/*    onChange={(value) =>*/}
            {/*      handleChatSetupBackendChange({*/}
            {/*        target: { value: value, name: "recommendations" },*/}
            {/*      })*/}
            {/*    }*/}
            {/*  />*/}
            {/*</Card>*/}
            <Card>
              <Select
                label="Language"
                disabled={isLoading}
                options={options}
                onChange={(value) =>
                  handleChatSetupBackendChange({
                    target: { value: value ?? "en", name: "language" },
                  })
                }
                value={chatSetupBackend.language ?? "en"}
              />
              <TextField
                multiline={4}
                disabled={isLoading}
                value={chatSetupBackend.dynamic_context ?? ""}
                onChange={(value) =>
                  handleChatSetupBackendChange({
                    target: { value: value ?? "", name: "dynamic_context" },
                  })
                }
                label="System prompt"
                helpText={
                  <span>
                    Information that will help chatbot to understand what your
                    store is about. Based on the information and knowledge base
                    answers are constructed.
                  </span>
                }
              />
            </Card>
            <Card>
              <TextField
                value={chatSetupFrontend.background_color ?? "#00214d"}
                disabled={isLoading}
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "background_color" },
                  })
                }
                label="Chat stripe color"
                helpText={<span>Hex value (ex. #000000)</span>}
              />
              <TextField
                value={chatSetupFrontend.font_color ?? "#FFFFFF"}
                disabled={isLoading}
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "font_color" },
                  })
                }
                label="Chat font color"
                helpText={<span>Hex value (ex. #000000)</span>}
              />
            </Card>
            <Card>
              <TextField
                value={
                  chatSetupFrontend.bar_message ??
                  "👋  Glad to help you whenever I can!"
                }
                disabled={isLoading}
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "bar_message" },
                  })
                }
                label="Chat bar message"
              />
              <TextField
                multiline={2}
                disabled={isLoading}
                value={
                  chatSetupFrontend.welcome_message ??
                  "Hello I'm virtual assistant how may I help you?"
                }
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "welcome_message" },
                  })
                }
                label="Chat welcome message"
              />
              {/*<TextField*/}
              {/*  multiline={2}*/}
              {/*  disabled={isLoading}*/}
              {/*  value={*/}
              {/*    chatSetupFrontend.feedback_thank_you ??*/}
              {/*    "Thank you for your feedback."*/}
              {/*  }*/}
              {/*  onChange={(value) =>*/}
              {/*    handleChatSetupFrontendChange({*/}
              {/*      target: { value: value, name: "feedback_thank_you" },*/}
              {/*    })*/}
              {/*  }*/}
              {/*  label="Feedback thank you"*/}
              {/*/>*/}
              {/*<TextField*/}
              {/*  multiline={2}*/}
              {/*  disabled={isLoading}*/}
              {/*  value={chatSetupFrontend.feedback_positive ?? "Upvote"}*/}
              {/*  onChange={(value) =>*/}
              {/*    handleChatSetupFrontendChange({*/}
              {/*      target: { value: value, name: "feedback_positive" },*/}
              {/*    })*/}
              {/*  }*/}
              {/*  label="Feedback (positive)"*/}
              {/*/>*/}
              {/*<TextField*/}
              {/*  multiline={2}*/}
              {/*  disabled={isLoading}*/}
              {/*  value={chatSetupFrontend.feedback_negative ?? "Downvote"}*/}
              {/*  onChange={(value) =>*/}
              {/*    handleChatSetupFrontendChange({*/}
              {/*      target: { value: value, name: "feedback_negative" },*/}
              {/*    })*/}
              {/*  }*/}
              {/*  label="Feedback (negative)"*/}
              {/*/>*/}
              <TextField
                multiline={1}
                disabled={isLoading}
                value={chatSetupFrontend.ask_a_question ?? "Ask a question..."}
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "ask_a_question" },
                  })
                }
                label="Input label (empty state)"
              />
              <TextField
                multiline={1}
                disabled={isLoading}
                value={chatSetupFrontend.write_an_answer ?? "Write an answer"}
                onChange={(value) =>
                  handleChatSetupFrontendChange({
                    target: { value: value, name: "write_an_answer" },
                  })
                }
                label="Input label (conversation in progress)"
              />
              {/*  <TextField*/}
              {/*    multiline={2}*/}
              {/*    disabled={isLoading}*/}
              {/*    value={*/}
              {/*      chatSetupFrontend.recommendation_message ??*/}
              {/*      "Based on search I recommend"*/}
              {/*    }*/}
              {/*    onChange={(value) =>*/}
              {/*      handleChatSetupFrontendChange({*/}
              {/*        target: { value: value, name: "recommendation_message" },*/}
              {/*      })*/}
              {/*    }*/}
              {/*    label="Chat recommendation message"*/}
              {/*  />*/}
              {/*  <TextField*/}
              {/*    value={chatSetupFrontend.recommendation_button_text ?? "Check"}*/}
              {/*    disabled={isLoading}*/}
              {/*    onChange={(value) =>*/}
              {/*      handleChatSetupFrontendChange({*/}
              {/*        target: {*/}
              {/*          value: value,*/}
              {/*          name: "recommendation_button_text",*/}
              {/*        },*/}
              {/*      })*/}
              {/*    }*/}
              {/*    label="Chat recommendation button message"*/}
              {/*  />*/}
              {/*  <TextField*/}
              {/*    value={chatSetupFrontend.recommendation_currency ?? "$"}*/}
              {/*    disabled={isLoading}*/}
              {/*    onChange={(value) =>*/}
              {/*      handleChatSetupFrontendChange({*/}
              {/*        target: {*/}
              {/*          value: value,*/}
              {/*          name: "recommendation_currency",*/}
              {/*        },*/}
              {/*      })*/}
              {/*    }*/}
              {/*    label="Recommended product currency"*/}
              {/*  />*/}
            </Card>
          </FormLayout>
        </Form>
      </VerticalStack>
      <Button
        onClick={handleSubmit}
        primarySuccess={true}
        disabled={isSaving || isLoading}
      >
        Save
      </Button>
    </Frame>
  );
}
