import { ProgressBar, Text, HorizontalStack } from "@shopify/polaris";

export default function TokenBar() {
  function getColor(tokensUsedPercent) {
    if (tokensUsedPercent > 80) {
      return "critical";
    } else if (tokensUsedPercent > 50) {
      return "highlight";
    } else return "success";
  }
  const progress = 90;
  return <ProgressBar progress={progress} color={getColor(progress)} />;
}
