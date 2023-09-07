import { ProgressBar } from "@shopify/polaris";
import { convertHosts } from "~/helpers";

export default function TokenBar({ shop }) {
  function getColor(tokensUsedPercent) {
    if (tokensUsedPercent > 80) {
      return "critical";
    } else if (tokensUsedPercent > 50) {
      return "highlight";
    } else return "success";
  }
  const progress = 90;
  const hosts = convertHosts(shop);
  return <ProgressBar progress={progress} color={getColor(progress)} />;
}
