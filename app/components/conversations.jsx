import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, Page, Layout } from "@shopify/polaris";
import "react-chat-elements/dist/main.css";
import { useLoaderData } from "@remix-run/react";

export const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationData, setConversationData] = useState(undefined);
  const [selectedConversation, setSelectedConversation] = useState(undefined);
  // const { shop } = useLoaderData();
  const shop = "test";

  useEffect(() => {
    const getConversationsData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chat-history/?store_name=${shop}&page=1&size=10`
        );
        setConversations(response.data.items);
        setConversationData(response.data);
      } catch (error) {
        console.error("Failed to fetch conversations data:", error);
      }
    };

    getConversationsData();
  }, []);

  const conversationList = () => {
    return conversations.map((conversation) => {
      return (
        <Card
          key={conversation.id}
          onClick={() => {
            setSelectedConversation(conversation.id);
            console.log(conversation.id);
          }}
        >
          {conversation.id}
        </Card>
      );
    });
  };
  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
          <Card>
            <Layout>
              <Layout.Section>{conversationList()}</Layout.Section>
            </Layout>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }}>
          <Card padding="32">
            <p>View a summary of your online store’s orders.</p>
          </Card>
        </Grid.Cell>
      </Grid>
    </Page>
  );
};
