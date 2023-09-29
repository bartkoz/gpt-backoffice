import {
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Layout, Card, Grid, Text, VerticalStack } from "@shopify/polaris";
const Chart = ({ shop }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await axios.get(
          `https://backend-rvm4xlf6ba-ey.a.run.app/chat-stats/?store_name=${shop}`
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    getChartData();
  }, []);

  const [windowWidth, setWindowWidth] = useState(1500);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let xAxisInterval;
  if (windowWidth < 1280) {
    xAxisInterval = 2;
  } else {
    xAxisInterval = 0;
  }

  if (!chartData) {
    return null;
  }

  return (
    <>
      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6">
                  Conversations
                </Text>
                <Text variant="headingXl" as="h4">
                  {chartData.conversations}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6">
                  Messages
                </Text>
                <Text variant="headingXl" as="h4">
                  {chartData.messages}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <ResponsiveContainer width={"100%"} height={275}>
            <LineChart
              width={500}
              height={250}
              data={chartData.charts_data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dt" interval={xAxisInterval} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                strokeWidth={3}
                type="monotone"
                dataKey="conversations"
                stroke="rgb(19,156,217)"
                fill="#00214d"
              />
              <Line
                strokeWidth={3}
                type="monotone"
                dataKey="messages"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Layout.Section>
    </>
  );
};

export default Chart;
