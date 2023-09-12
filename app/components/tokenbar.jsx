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
      setTokensUsed(Math.round((response.data / 100000) * 100));
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
      <Text alignment={"center"}>
        Tokens used {tokensUsed}
        /100 (<b>resets in {days} days</b>)
      </Text>
    )
  );
}
