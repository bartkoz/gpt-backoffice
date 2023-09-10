import { ProgressBar, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import axios from "axios";

export function TokenBar({ shop }) {
  const [tokensUsed, setTokensUsed] = useState(undefined);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `https://backend-rvm4xlf6ba-ey.a.run.app/client-tokens/${shop}`
      );
      setTokensUsed((response.data / 100000) * 100);
    };
    getData();
  }, []);

  function getColor(tokensUsedPercent) {
    if (tokensUsedPercent > 80) {
      return "critical";
    } else if (tokensUsedPercent > 50) {
      return "highlight";
    } else return "success";
  }
  return <ProgressBar progress={tokensUsed} color={getColor(tokensUsed)} />;
}

export function DaysToEndOfMonth() {
  const daysUntilEndOfMonth = () => {
    let today = new Date();
    let endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endOfMonth.getDate() - today.getDate();
  };

  return (
    <Text alignment={"center"}>
      Tokens used (<b>resets in {daysUntilEndOfMonth()} days</b>)
    </Text>
  );
}
