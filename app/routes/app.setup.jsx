import { VerticalStack, Layout, Page } from "@shopify/polaris";
import SetupForm from "~/components/setup";

export default function Conversations() {
  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <SetupForm />
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
