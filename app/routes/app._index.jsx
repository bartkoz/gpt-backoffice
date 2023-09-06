import {
  Page,
  Layout,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Text,
} from "@shopify/polaris";

import Chart from "~/components/chart";
import TokenBar from "~/components/tokenbar";

export default function Index() {
  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Card>
              <HorizontalStack wrap={false}>
                <Text alignment={"center"}>
                  Tokens used <b>resets in X days</b>
                </Text>
              </HorizontalStack>
              <TokenBar />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Chart />
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
