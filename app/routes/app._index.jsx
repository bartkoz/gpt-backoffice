import {
  Page,
  Layout,
  VerticalStack,
  Card,
  HorizontalStack,
  Text,
} from "@shopify/polaris";
import Chart from "~/components/chart";
import { authenticate } from "~/shopify.server";
import { useEffect, useState } from "react";
import { useActionData, useSubmit } from "@remix-run/react";
import { DaysToEndOfMonth, TokenBar } from "~/components/tokenbar";

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
                <DaysToEndOfMonth />
              </HorizontalStack>
              {actionData && <TokenBar shop={actionData.primaryDomain.host} />}
            </Card>
          </Layout.Section>
          <Layout.Section>
            {actionData && <Chart shop={actionData.primaryDomain.host} />}
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
