import { Layout, Page } from "@shopify/polaris";
import { useState } from "react";
import { KBActions, KBFilesList } from "~/components/kb_tabs";
import { authenticate } from "~/shopify.server";
import { useLoaderData } from "@remix-run/react";

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

export default function KBUpload() {
  const shopData = useLoaderData();
  const [activeContent, setActiveContent] = useState(null);

  return (
    <Page>
      <Layout>
        <ui-title-bar title="Knowledge base" />
        <Layout.Section>
          <KBActions
            actionData={shopData}
            activeContent={activeContent}
            setActiveContent={setActiveContent}
          />
        </Layout.Section>
        <Layout.Section>
          {shopData && (
            <KBFilesList
              shop={shopData.primaryDomain.host}
              activeContent={activeContent}
            />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
