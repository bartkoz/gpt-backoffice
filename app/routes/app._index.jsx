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
import BillingBanner from "~/components/billing";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const responseShop = await admin.graphql(
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

  const responseBilling = await admin.graphql(
    `#graphql
    mutation {
      appSubscriptionCreate(
        name: "Your Subscription Name",
        returnUrl: "https://google.com/",
        trialDays: 7,
        test: true,
        lineItems: [{
        plan: {
          appRecurringPricingDetails: {
            price: { amount: 9.99, currencyCode: USD }
          }
        }
      }]
    ) {
        appSubscription {
          id
        }
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }`
  );

  const dataShop = await responseShop.json();
  const dataBilling = await responseBilling.json();

  return {
    shop: dataShop.data.shop,
    billing: dataBilling.data.appSubscriptionCreate,
  };
}

export default function Index() {
  const shopData = useLoaderData();
  const host =
    shopData && shopData.shop.primaryDomain
      ? shopData.shop.primaryDomain.host
      : null;
  const billingUrl =
    shopData && shopData.billing.confirmationUrl
      ? shopData.billing.confirmationUrl
      : null;

  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {billingUrl && <BillingBanner billingLink={billingUrl} />}
          </Layout.Section>
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
