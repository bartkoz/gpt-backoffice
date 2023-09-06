import {
  Page,
  Layout,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Text,
  Box,
} from "@shopify/polaris";
import Chart from "~/components/chart";
import TokenBar from "~/components/tokenbar";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useActionData, useSubmit } from "@remix-run/react";
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({ shop: session });
};
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
  return json({
    product: responseJson.data,
  });
}

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();
  const generateProduct = () => submit({}, { replace: true, method: "POST" });
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
          <Layout.Section>
            <Card>
              <VerticalStack gap="5">
                <HorizontalStack gap="3" align="end">
                  <Button onClick={generateProduct}>Generate a product</Button>
                </HorizontalStack>
                {actionData && (
                  <Box
                    padding="4"
                    background="bg-subdued"
                    borderColor="border"
                    borderWidth="1"
                    borderRadius="2"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>
                        {JSON.stringify(
                          actionData.product.shop.domains,
                          null,
                          2
                        )}
                      </code>
                    </pre>
                  </Box>
                )}
              </VerticalStack>
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
