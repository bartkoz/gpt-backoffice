import React, { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { AppProvider as PolarisAppProvider, Form } from "@shopify/polaris";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix";

import { authenticate } from "../shopify.server";
import axios from "axios";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export async function loader({ request }) {
  await authenticate.admin(request);
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
  const dataShop = await responseShop.json();
  return json({
    polarisTranslations: require("@shopify/polaris/locales/en.json"),
    apiKey: process.env.SHOPIFY_API_KEY,
    host: dataShop.data.shop.primaryDomain.host,
  });
}

export default function App() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { apiKey, polarisTranslations, host } = useLoaderData();
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://backend-rvm4xlf6ba-ey.a.run.app/subscription-exists/?shop=${host}`
      );
      setSubscriptionData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, [host]);

  return (
    <>
      <script
        src="https://cdn.shopify.com/shopifycloud/app-bridge.js"
        data-api-key={apiKey}
      />
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {!isLoading && subscriptionData.exists && (
          <>
            <Link to="/app/conversations">Chat history</Link>
            <Link to="/app/kb">Knowledge base</Link>
            <Link to="/app/settings">Chat settings</Link>
            <Link to="/app/preview">Chat preview</Link>
            <Link to="/app/contact">Contact</Link>
          </>
        )}
      </ui-nav-menu>
      <PolarisAppProvider
        i18n={polarisTranslations}
        linkComponent={RemixPolarisLink}
      >
        <Outlet />
      </PolarisAppProvider>
    </>
  );
}

/** @type {any} */
const RemixPolarisLink = React.forwardRef((/** @type {any} */ props, ref) => (
  <Link {...props} to={props.url ?? props.to} ref={ref}>
    {props.children}
  </Link>
));

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
