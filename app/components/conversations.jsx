import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Page,
  Grid,
  Loading,
  Link,
  Text,
  Frame,
  VerticalStack,
  LegacyStack,
  LegacyCard,
} from "@shopify/polaris";
import PaginationComponent from "~/components/pagination";
import moment from "moment";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";

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
          `https://backend-rvm4xlf6ba-ey.a.run.app/chat-history/?store_name=${shop}&page=${paginatedPage}&size=10`
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

  async function matchConversationAsRead(conversation_id) {
    await axios.post(
      `https://backend-rvm4xlf6ba-ey.a.run.app/mark-conversation-read/?store_name=${shop}&conv_id=${conversation_id}`
    );
  }

  function conversationList() {
    return conversations.map((conversation) => {
      return (
        <Link
          onClick={() => {
            setSelectedConversation(conversation.messages);
            if (!conversation.read) {
              matchConversationAsRead(conversation.id);
            }
          }}
          monochrome={true}
          removeUnderline={true}
        >
          <LegacyCard key={conversation.id}>
            <LegacyCard.Section>
              <LegacyStack spacing="loose" vertical>
                <Text fontWeight={conversation.read ? "regular" : "bold"}>
                  {`${conversation.messages[0].message.slice(0, 40)}`}...
                </Text>
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

  function Message({ message }) {
    const boxStyleSystem = {
      backgroundColor: message.role === "chat" ? "#f0f0f0" : "#E5F1FF",
      color: "#202124",
      borderRadius: "16px",
      marginLeft: "15px",
      marginTop: "8px",
      display: "inline-block",
      "& a": {
        color: "inherit",
        textDecoration: "underline",
      },
    };
    return (
      <Box padding={"8px"} sx={{ ...boxStyleSystem }}>
        <Typography
          component="div"
          variant="body2"
          style={{ wordWrap: "break-word" }}
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 999,
            WebkitBoxOrient: "vertical",
          }}
          dangerouslySetInnerHTML={{ __html: message.message }}
        ></Typography>
        <Text
          variant="bodySm"
          as="p"
          style={{
            display: "inline-block",
          }}
        >
          {moment(message.timestamp).format("DD MMM")}
        </Text>
      </Box>
    );
  }

  const conversationDetails = selectedConversation.map((message) => {
    return (
      <>
        <Message message={message} />
        <br />
      </>
    );
  });
  return (
    <Frame>
      <Page fullWidth={true}>
        {isLoading && <Loading />}
        <Grid>
          <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <VerticalStack gap={2}>{conversationList()}</VerticalStack>
              <PaginationComponent
                paginationPage={paginatedPage}
                setPaginationPage={setPaginatedPage}
                pages={pageCount}
                isLoading={isLoading}
              />
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 9, sm: 3, md: 3, lg: 9, xl: 9 }}>
            <Card>{conversationDetails}</Card>
          </Grid.Cell>
        </Grid>
      </Page>
    </Frame>
  );
};
