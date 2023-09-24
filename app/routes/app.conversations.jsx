import { Layout, Page } from "@shopify/polaris";
import { ConversationsList } from "~/components/conversations";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

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

  return (
    <Page>
      <ui-title-bar title="Conversation history" />
      <Layout>
        {shopData && <ConversationsList shop={shopData.primaryDomain.host} />}
      </Layout>
    </Page>
  );
}
