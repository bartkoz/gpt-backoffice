import {
  VerticalStack,
  Layout,
  Page, Card,
} from "@shopify/polaris";
import SetupForm from "~/components/setup";

export default function Conversations() {
  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Card>
              <SetupForm />
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
