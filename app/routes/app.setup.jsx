import { VerticalStack, Layout, Page, Grid } from "@shopify/polaris";
import SetupForm from "~/components/setup";
import ChatPreview from "~/components/chatpreview";
import { ChatSetupProvider } from "~/components/context";
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
    <ChatSetupProvider>
      <Page>
        <VerticalStack gap="5">
          <Layout>
            <Layout.Section>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                  {actionData && <SetupForm shop={actionData.domains} />}
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 7, sm: 7, md: 7, lg: 7, xl: 7 }}>
                  <ChatPreview />
                </Grid.Cell>
              </Grid>
            </Layout.Section>
          </Layout>
        </VerticalStack>
      </Page>
    </ChatSetupProvider>
  );
}
