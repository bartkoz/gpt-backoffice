import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Card, Grid, Text, VerticalStack } from "@shopify/polaris";
import { convertHosts } from "~/helpers";
const Chart = ({ shop }) => {
  const [chartData, setChartData] = useState(null);
  const domains = convertHosts(shop);

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/chat-stats/?store_name=${domains}`
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    getChartData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Layout.Section>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6">
                  Conversations:
                </Text>
                <Text variant="headingXl" as="h4">
                  {chartData.conversations}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6">
                  Messages:
                </Text>
                <Text variant="headingXl" as="h4">
                  {chartData.messages}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6" color={"critical"}>
                  Downvotes:
                </Text>
                <Text variant="headingXl" as="h4" color={"critical"}>
                  {chartData.downvotes}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <VerticalStack gap="3">
                <Text variant="headingMd" as="h6" color={"success"}>
                  Upvotes:
                </Text>
                <Text variant="headingXl" as="h4" color={"success"}>
                  {chartData.upvotes}
                </Text>
              </VerticalStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <ResponsiveContainer width={"100%"} aspect={2}>
            <LineChart
              width={500}
              height={400}
              data={chartData.charts_data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dt" interval={0} />
              <YAxis />
              <Tooltip />
              <Line
                strokeWidth={3}
                type="monotone"
                dataKey="conversations"
                stroke="rgb(19,156,217)"
                fill="#00214d"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Layout.Section>
    </>
  );
};

export default Chart;
