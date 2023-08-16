import {
  Card,
  Layout,
  Page,
} from "@shopify/polaris";
import {ConversationsList} from "~/components/conversations";

export default function Conversations() {
  return (
    <Page>
      <ui-title-bar title="Conversation history" />
      <Layout>
        <ConversationsList />
      </Layout>
    </Page>
  );
}
