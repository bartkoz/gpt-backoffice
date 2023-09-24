import { Banner } from "@shopify/polaris";

const BillingBanner = ({ billingLink }) => {
  const handleBillingApproval = () => {
    window.open(billingLink, "_blank");
  };

  return (
    <Banner
      title="Billing Approval Required"
      action={{
        content: "Approve Now",
        onAction: handleBillingApproval,
      }}
      status="warning"
    >
      <p>
        To continue using this app, please approve the billing. Click the button
        below to proceed.
      </p>
    </Banner>
  );
};

export default BillingBanner;
