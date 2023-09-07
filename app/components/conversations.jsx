import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  Page,
  Layout,
  Loading,
  Link,
  Text,
  Frame,
  VerticalStack,
  LegacyStack,
  LegacyCard,
} from "@shopify/polaris";
import "react-chat-elements/dist/main.css";
import PaginationComponent from "~/components/pagination";
import moment from "moment";

export const ConversationsList = ({ shop }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState([]);
  const [paginatedPage, setPaginatedPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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

  function conversationList() {
    return conversations.map((conversation) => {
      return (
        <Link
          onClick={() => {
            setSelectedConversation(conversation.messages);
          }}
          monochrome={true}
          removeUnderline={true}
        >
          <LegacyCard key={conversation.id}>
            <LegacyCard.Section>
              <LegacyStack spacing="loose" vertical>
                <p>{`${conversation.messages[0].message.slice(0, 40)}`}...</p>
                <LegacyStack distribution="trailing">
                  <Text
                    variant="bodySm"
                    as="p"
                    style={{ display: "inline-block" }}
                  >
                    {moment(conversation.messages[0]).format("DD MMM")}
                  </Text>
                </LegacyStack>
              </LegacyStack>
            </LegacyCard.Section>
          </LegacyCard>
        </Link>
      );
    });
  }

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
      <Page fullWidth={true}>
        <Layout>
          {isLoading && <Loading />}
          <Grid>
            <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
              <Card>
                <Layout.Section fullWidth={true}>
                  <PaginationComponent
                    paginationPage={paginatedPage}
                    setPaginationPage={setPaginatedPage}
                    pages={pageCount}
                    isLoading={isLoading}
                  />
                </Layout.Section>
                <Layout.Section fullWidth={true}>
                  <VerticalStack gap={2}>{conversationList()}</VerticalStack>
                </Layout.Section>
                <Layout.Section>
                  <PaginationComponent
                    paginationPage={paginatedPage}
                    setPaginationPage={setPaginatedPage}
                    pages={pageCount}
                    isLoading={isLoading}
                  />
                </Layout.Section>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }}>
              <Card>
                <p>{conversationDetails}</p>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout>
      </Page>
    </Frame>
  );
};
