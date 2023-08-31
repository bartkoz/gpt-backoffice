import { ProgressBar } from "@shopify/polaris";
import { Typography } from "@mui/material";

export default function TokenBar() {
  function getColor(tokensUsedPercent) {
    if (tokensUsedPercent > 80) {
      return "critical";
    } else if (tokensUsedPercent > 50) {
      return "highlight";
    } else return "success";
  }
  const progress = 90;
  return (
    <>
      <Typography style={{ float: "left" }}>Tokens consumed:</Typography>
      <ProgressBar progress={progress} color={getColor(progress)} />
    </>
  );
}
