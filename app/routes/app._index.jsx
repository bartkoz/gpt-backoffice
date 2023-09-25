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
import axios from "axios";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  let dataBilling = {};

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
  const dataShop = await responseShop.json();
  const subscription_exists = await axios.get(
    `https://backend-rvm4xlf6ba-ey.a.run.app/subscription-exists/?shop=${dataShop.data.shop.primaryDomain.host}`
  );
  if (!subscription_exists.data.exists) {
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
    dataBilling = await responseBilling.json();
  }

  // const responsePolicies = await admin.graphql(
  //   `#graphql
  //   query {
  // shop {
  //   name
  //   description
  //   shopPolicies {
  //     body
  //   }
  // }
  //   }`
  // );

  // const dataPolicies = await responsePolicies.json();
  // console.log(dataPolicies.data.shop.shopPolicies[2]);
  let data = {
    shop: dataShop.data.shop.primaryDomain.host,
  };
  if (Object.keys(dataBilling).length > 0) {
    console.log(dataBilling);
    data["billing"] = dataBilling.data.appSubscriptionCreate.confirmationUrl;
  } else {
    data["billing"] = null;
  }
  return data;
}

export default function Index() {
  const shopData = useLoaderData();
  const host = shopData && shopData.shop ? shopData.shop : null;
  const billingUrl = shopData && shopData.billing ? shopData.billing : null;
  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {billingUrl && <BillingBanner billingLink={billingUrl} />}
          </Layout.Section>
          {!billingUrl && host && <Chart shop={host} />}
          <Layout.Section>
            <Card>
              <HorizontalStack wrap={false}>
                <DaysToEndOfMonth />
              </HorizontalStack>
              {!billingUrl && host && <TokenBar shop={host} />}
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
