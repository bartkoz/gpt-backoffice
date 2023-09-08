import { ChatPreview } from "~/components/preview";
import { authenticate } from "~/shopify.server";
import { useActionData, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { useEffect } from "react";

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

export default function ProductRecommendations() {
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
      {actionData && <ChatPreview shop={actionData.primaryDomain.host} />}
    </Page>
  );
}
