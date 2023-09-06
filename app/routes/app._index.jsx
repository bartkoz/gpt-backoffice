import {
  Page,
  Layout,
  VerticalStack,
  Card,
  HorizontalStack,
  Text,
} from "@shopify/polaris";
import Chart from "~/components/chart";
import TokenBar from "~/components/tokenbar";
import Gql from "~/components/gql";
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
  return responseJson.data;
}

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
          <Gql />
        </Layout>
      </VerticalStack>
    </Page>
  );
}
