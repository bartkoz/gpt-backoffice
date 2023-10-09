import {
  Layout,
  BlockStack,
  Card,
  Button,
  InlineStack,
  Box,
} from "@shopify/polaris";
import { useActionData, useSubmit } from "@remix-run/react";

export default function Gql() {
  const actionData = useActionData();
  const submit = useSubmit();
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  return (
    <Layout.Section>
      <Card>
        <BlockStack gap="5">
          <InlineStack gap="3" align="end">
            <Button onClick={queryGQL}>Query GQL</Button>
          </InlineStack>
          {actionData && (
            <Box
              padding="4"
              background="bg-subdued"
              borderColor="border"
              borderWidth="1"
              borderRadius="2"
              overflowX="scroll"
            >
              <pre style={{ margin: 0 }}>
                <code>{JSON.stringify(actionData.shop.domains, null, 2)}</code>
              </pre>
            </Box>
          )}
        </BlockStack>
      </Card>
    </Layout.Section>
  );
}
