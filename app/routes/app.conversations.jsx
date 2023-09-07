import { Layout, Page } from "@shopify/polaris";
import { ConversationsList } from "~/components/conversations";
import { useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
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
  const [shop, setShop] = useState(undefined);
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  useEffect(() => {
    queryGQL();
    if (actionData.domains) {
      console.log(actionData.domains);
      const domains = actionData.domains.map((obj) => obj.host).join(", ");
      setShop(domains);
    }
  }, []);

  return (
    <Page>
      <ui-title-bar title="Conversation history" />
      <Layout>
        <ConversationsList shop={shop} />
      </Layout>
    </Page>
  );
}
