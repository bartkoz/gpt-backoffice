import {
  Page,
  Layout,
  VerticalStack,
  Card,
  HorizontalStack,
} from "@shopify/polaris";
import Chart from "~/components/chart";
import { authenticate } from "~/shopify.server";
import { useLoaderData } from "@remix-run/react";
import { DaysToEndOfMonth, TokenBar } from "~/components/tokenbar";

export async function loader({ request }) {
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
  const data = await response.json();
  return data.data.shop;
}

export default function Index() {
  const shopData = useLoaderData();

  const host =
    shopData && shopData.primaryDomain ? shopData.primaryDomain.host : null;

  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          {host && <Chart shop={host} />}
          <Layout.Section>
            <Card>
              <HorizontalStack wrap={false}>
                <DaysToEndOfMonth />
              </HorizontalStack>
              {host && <TokenBar shop={host} />}
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
