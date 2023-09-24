import { ChatPreview } from "~/components/preview";
import { authenticate } from "~/shopify.server";
import { useLoaderData } from "@remix-run/react";
import { Page } from "@shopify/polaris";

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

export default function ProductRecommendations() {
  const shopData = useLoaderData();
  return <Page>{shopData && <ChatPreview data={shopData} />}</Page>;
}
