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
import { useEffect, useState } from "react";
import Onboarding from "~/components/onboarding";

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
          name: "Kip monthly subscription",
          returnUrl: "https://backend-rvm4xlf6ba-ey.a.run.app/subscription-activation/?shop=${dataShop.data.shop.primaryDomain.host}&key=02lqTKccKrOFTo6ATSDwnwhgLl3OgEh33z4g7MRFgQdezJzQtgOAovpYHkJe",
          trialDays: 7,
          test: true,
          lineItems: [{
          plan: {
            appRecurringPricingDetails: {
              price: { amount: 19.99, currencyCode: USD }
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
  let data = {
    shop: dataShop.data.shop.primaryDomain.host,
  };
  if (Object.keys(dataBilling).length > 0) {
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
  const [tokensUsed, setTokensUsed] = useState(undefined);
  const [appStartDate, setAppStartDate] = useState(undefined);
  const [isTrial, setIsTrial] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `https://backend-rvm4xlf6ba-ey.a.run.app/client-tokens/${host}`
      );
      setTokensUsed(Math.round((response.data["val"] / 90000) * 100));
      setAppStartDate(response.data["started_at"]);
    };
    getData();
  }, []);
  useEffect(() => {
    const TrialDaysLeft = () => {
      let givenDate = new Date(appStartDate);
      let currentDate = new Date();
      let diffInMilliseconds = currentDate - givenDate;
      let diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      if (diffInDays < 0) {
        setTrialDaysLeft(7);
      } else {
        setTrialDaysLeft(7 - diffInDays);
      }
      if (diffInDays < 7) {
        setIsTrial(true);
      }
    };
    TrialDaysLeft();
  }, [appStartDate]);

  return (
    <Page>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Onboarding />
          </Layout.Section>
          {isTrial && (
            <Layout.Section>
              <Card>
                <p>
                  You are currently running on <b>free</b> trial. You have{" "}
                  <b>{trialDaysLeft}</b> days left.
                </p>
              </Card>
            </Layout.Section>
          )}
          <Layout.Section>
            {billingUrl && <BillingBanner billingLink={billingUrl} />}
          </Layout.Section>
          {!billingUrl && host && <Chart shop={host} />}
          <Layout.Section>
            {!billingUrl && (
              <Card>
                <HorizontalStack wrap={false}>
                  <DaysToEndOfMonth />
                </HorizontalStack>
                {host && <TokenBar tokensUsed={tokensUsed} />}
              </Card>
            )}
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
