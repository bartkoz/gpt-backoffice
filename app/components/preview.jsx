import { Page, Card, Layout, Text, TextField, Grid } from "@shopify/polaris";
import { useCallback, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

export function ChatPreview() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  const handleSubmit = () => {
    if (value !== "") {
      console.log("submitted");
      setMessages((prevState) => [...prevState, value]);
      setValue("");
    }
  };

  const MessagesList = () => {
    return messages.map((message) => (
      <Card key={message}>
        <Text as="h2" variant="bodyMd">
          {message}
        </Text>
      </Card>
    ));
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <MessagesList />
        </Layout.Section>
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }}>
              <TextField
                value={value}
                placeholder={"Type message..."}
                onChange={handleChange}
                autoComplete="off"
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}>
              <SendIcon onClick={handleSubmit} />
            </Grid.Cell>
          </Grid>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
