import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Text,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import Chart from "~/components/chart";
import TokenBar from "~/components/tokenbar";
import HostSetup from "~/components/hosts";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
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
  console.log(responseJson);
  return json({
    product: responseJson.data,
  });
}

export default function Index() {
  const nav = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const queryProducts = () => submit({}, { replace: true, method: "POST" });
  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <VerticalStack gap="5">{/*<HostSetup />*/}</VerticalStack>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <HorizontalStack wrap={false}>
                <Text alignment={"center"}>
                  Tokens used <b>resets in X days</b>
                </Text>
              </HorizontalStack>
              {/*<HorizontalStack>*/}
              {/*  <Text alignment={"start"}>Tokens used</Text>*/}
              {/*  <Text align={"end"}>Tokens used</Text>*/}
              {/*</HorizontalStack>*/}
              <TokenBar />
              <Button loading={isLoading} primary onClick={queryProducts}>
                query prods
              </Button>
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
