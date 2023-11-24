import { Page, Card, Text } from "@shopify/polaris";
export default function Setup() {
  return (
    <Page>
      <Card>
        <Text>Steps to turn on website</Text>
        <img
          src="https://storage.googleapis.com/kip-cdn/howto.png"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Card>
    </Page>
  );
}
