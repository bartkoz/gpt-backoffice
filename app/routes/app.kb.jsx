import { Form, Layout, Page } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { KBActions, KBFilesList } from "~/components/kb_tabs";
import { authenticate } from "~/shopify.server";
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

export default function KBUpload() {
  const actionData = useActionData();
  const submit = useSubmit();
  const [activeContent, setActiveContent] = useState(null);
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  useEffect(() => {
    queryGQL();
  }, []);

  return (
    <Page>
      <Form>
        <Layout>
          <ui-title-bar title="Knowledge base" />
          <Layout.Section>
            <KBActions
              actionData={actionData}
              activeContent={activeContent}
              setActiveContent={setActiveContent}
            />
          </Layout.Section>
          <Layout.Section>
            {actionData && (
              <KBFilesList
                shop={actionData.primaryDomain.host}
                activeContent={activeContent}
              />
            )}
          </Layout.Section>
        </Layout>
      </Form>
    </Page>
  );
}
