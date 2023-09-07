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
import { authenticate } from "~/shopify.server";
import { useEffect, useState } from "react";
import { useActionData, useSubmit } from "@remix-run/react";

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

export default function Index() {
  const actionData = useActionData();
  const submit = useSubmit();
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  useEffect(() => {
    queryGQL();
  }, []);

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
              {actionData && <TokenBar shop={actionData.domains} />}
            </Card>
          </Layout.Section>
          <Layout.Section>
            {actionData && <Chart shop={actionData.domains} />}
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
