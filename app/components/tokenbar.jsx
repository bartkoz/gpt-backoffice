import { ProgressBar, Text } from "@shopify/polaris";
import { Tooltip } from "@mui/material";

export function TokenBar({ tokensUsed }) {
  function getColor(tokensUsedPercent) {
    if (tokensUsedPercent > 80) {
      return "critical";
    } else if (tokensUsedPercent > 50) {
      return "highlight";
    } else return "success";
  }

  return (
    <>
      <ProgressBar progress={tokensUsed} color={getColor(tokensUsed)} />
      <DaysToEndOfMonth tokensUsed={tokensUsed} />
    </>
  );
}

export function DaysToEndOfMonth({ tokensUsed }) {
  let today = new Date();
  let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  let days = endOfMonth.getDate() - today.getDate();

  return (
    tokensUsed !== undefined &&
    tokensUsed !== null && (
      <Tooltip
        active
        content="Quota resets at midnight of first day of next month UTC timezone."
      >
        <Text alignment={"center"}>
          Tokens used {tokensUsed}
          /100 (<b>resets in {days} days</b>)
        </Text>
      </Tooltip>
    )
  );
}
