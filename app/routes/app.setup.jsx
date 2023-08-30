import { VerticalStack, Layout, Page, Grid } from "@shopify/polaris";
import SetupForm from "~/components/setup";
import ChatPreview from "~/components/chatpreview";
import { ChatSetupProvider } from "~/components/context";
export default function Conversations() {
  return (
    <ChatSetupProvider>
      <Page>
        <VerticalStack gap="5">
          <Layout>
            <Layout.Section>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 5, sm: 5, md: 5, lg: 5, xl: 5 }}>
                  <SetupForm />
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
