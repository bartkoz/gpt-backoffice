import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, Page, Layout, Loading, Frame } from "@shopify/polaris";
import "react-chat-elements/dist/main.css";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import PaginationComponent from "~/components/pagination";
import moment from "moment";

export const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [paginatedPage, setPaginatedPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
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
    const getConversationsData = async (paginatedPage) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/chat-history/?store_name=${shop}&page=${paginatedPage}&size=10`
        );
        setConversations(response.data.items);
        setPageCount(response.data.pages);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch conversations data:", error);
      }
    };

    getConversationsData(paginatedPage);
  }, [paginatedPage]);

  const conversationList = () => {
    return conversations.map((conversation) => {
      return (
        <PlainButton
          key={conversation.id}
          onClick={() => {
            setSelectedConversation(conversation.messages);
          }}
        >
          <Card key={conversation.id}>
            {`${conversation.messages[0].message.slice(0, 40)}... ${moment(
              conversation.messages[0].timestamp
            ).format("YYYY/MM/DD")}`}
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
    <Frame>
      <Page fullWidth>
        {isLoading && <Loading />}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <Card>
              <Layout>
                <Layout.Section>
                  <PaginationComponent
                    paginationPage={paginatedPage}
                    setPaginationPage={setPaginatedPage}
                    pages={pageCount}
                    isLoading={isLoading}
                  />
                </Layout.Section>
                <Layout.Section>{conversationList()}</Layout.Section>
                <Layout.Section>
                  <PaginationComponent
                    paginationPage={paginatedPage}
                    setPaginationPage={setPaginatedPage}
                    pages={pageCount}
                    isLoading={isLoading}
                  />
                </Layout.Section>
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
    </Frame>
  );
};
