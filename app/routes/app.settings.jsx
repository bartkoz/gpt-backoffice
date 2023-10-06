import {
  VerticalStack,
  Layout,
  Page,
  Grid,
  Toast,
  Frame,
  ButtonGroup,
  Button,
  PageActions,
} from "@shopify/polaris";
import SetupForm from "~/components/setup";
import ChatPreview from "~/components/chatpreview";
import { ChatSetupProvider } from "~/components/context";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { useCallback, useState } from "react";
import axios from "axios";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      shop {
        primaryDomain {
          url
          host
        }
        domains {
          url
          host
        }
      }
    }`
  );
  const data = await response.json();
  return data.data.shop;
}

export default function Conversations() {
  const shopData = useLoaderData();

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
    ask_a_question: "Ask a question...",
    write_an_answer: "Write an answer",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);

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

  const handleSubmit = async () => {
    setIsSaving(true);
    await axios
      .post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/update-chat-conf/?store_name=${shopData.primaryDomain.host}`,
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

  return (
    <Page>
      <Frame>
        {active && <Toast content="Saved!" onDismiss={toggleActive} />}
        <PageActions
          primaryAction={{
            content: "Save",
            onAction: () => {
              handleSubmit();
            },
            disabled: isSaving || isLoading,
          }}
          secondaryActions={[
            {
              content: "Reset to default",
              destructive: true,
              onAction: () => {
                resetToDefault();
              },
            },
          ]}
        />
        <VerticalStack gap="5">
          <Layout>
            <Layout.Section>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 5, xl: 5 }}>
                  {shopData && (
                    <SetupForm
                      shop={shopData.primaryDomain.host}
                      chatSetupBackend={chatSetupBackend}
                      setChatSetupBackend={setChatSetupBackend}
                      chatSetupFrontend={chatSetupFrontend}
                      setChatSetupFrontend={setChatSetupFrontend}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  )}
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 7, xl: 7 }}>
                  <ChatPreview chatSetupFrontend={chatSetupFrontend} />
                </Grid.Cell>
              </Grid>
            </Layout.Section>
          </Layout>
        </VerticalStack>
      </Frame>
    </Page>
  );
}
