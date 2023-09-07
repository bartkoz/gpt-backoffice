import { Layout, Page, Button } from "@shopify/polaris";
import { ConversationsList } from "~/components/conversations";
import { useActionData, useSubmit } from "@remix-run/react";
import { useEffect } from "react";
import { authenticate } from "~/shopify.server";

export async function action({ request }) {
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

  const responseJson = await response.json();
  return responseJson.data.shop;
}

export default function Conversations() {
  const actionData = useActionData();
  const submit = useSubmit();
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  useEffect(() => {
    queryGQL();
  }, []);

  return (
    <Page>
      <ui-title-bar title="Conversation history" />
      <Layout>
        {actionData && (
          <ConversationsList shop={actionData.primaryDomain.host} />
        )}
      </Layout>
    </Page>
  );
}
