import { VerticalStack, Layout, Page, Grid } from "@shopify/polaris";
import SetupForm from "~/components/setup";
import ChatPreview from "~/components/chatpreview";
import { ChatSetupProvider } from "~/components/context";
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
    <ChatSetupProvider>
      <Page>
        <VerticalStack gap="5">
          <Layout>
            <Layout.Section>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                  {shopData && <SetupForm shop={shopData.primaryDomain.host} />}
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
