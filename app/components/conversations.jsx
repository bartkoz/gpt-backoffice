import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, Page, Layout } from "@shopify/polaris";
import "react-chat-elements/dist/main.css";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

export const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationData, setConversationData] = useState(undefined);
  const [selectedConversation, setSelectedConversation] = useState(undefined);
  const shop = "zezwolenia.fishster.pl";
  const PlainButton = styled(Button)({
    background: "none",
    border: "none",
    padding: 0,
    textTransform: "none", // To prevent automatic uppercase
    width: "100%",
    marginTop: "5px",
    "&:hover": {
      background: "none",
      boxShadow: "none",
    },
  });

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
        <PlainButton
          onClick={() => {
            setSelectedConversation(conversation.messages);
            console.log(conversation.messages);
          }}
        >
          <Card key={conversation.id}>
            {`${conversation.messages[0].message.slice(0, 40)}...`}
          </Card>
        </PlainButton>
      );
    });
  };

  const conversationDetails = selectedConversation.map((message) => {
    return (
      <Card>
        <b>{message.role}</b>:{" "}
        <span dangerouslySetInnerHTML={{ __html: message.message }} />
      </Card>
    );
  });

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
            <p>{conversationDetails}</p>
          </Card>
        </Grid.Cell>
      </Grid>
    </Page>
  );
};
