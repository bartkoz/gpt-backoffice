import { CalloutCard } from "@shopify/polaris";

export default function HostSetup() {
  return (
    <CalloutCard
      title="Set up your domains."
      illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
      primaryAction={{
        content: "Set domains",
        url: "#",
      }}
    >
      <p>
        <b>Important: </b>Set up domains hosts your store uses.
      </p>
    </CalloutCard>
  );
}
