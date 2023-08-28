import {useEffect} from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import Chart from "~/components/chart";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
query {
  products(first: 10) {
    # You can adjust the number as needed; remember Shopify may have pagination limits.
    edges {
      node {
        id
        title
        description
      }
    }
  }
}`,

  );

  const responseJson = await response.json();
  console.log(responseJson)
  return json({
    product: responseJson.data,
  });
}

export default function Index() {
  const nav = useNavigation();
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const queryProducts = () => submit({}, { replace: true, method: "POST" });

  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Card>
              <VerticalStack gap="5">
                <HorizontalStack gap="3" align="end">
                  <Button loading={isLoading} primary onClick={queryProducts}>
                    query prods
                  </Button>
                </HorizontalStack>
              </VerticalStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <Chart />
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
