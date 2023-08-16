import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";
import {HorizontalGrid, Text} from '@shopify/polaris';
const Chart = () => {
  const [chartData, setChartData] = useState(null);

  const InfoBox = ({data, color = undefined, height = 'auto', width = 'auto'}) => {

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
          width: width,
        }}
      >
        <Text as="p" variant="heading4xl" fontWeight={'regular'} color={color}>{data.value}</Text>
        <Text as="p" variant="headingMd" fontWeight={'regular'} color={color}>{data.label}</Text>
      </div>
    );
  }

  useEffect(() => {
    const getChartData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chat-stats/?store_name=zezwolenia.fishster.pl');
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
      <Text as="p" variant="heading3xl" fontWeight={'regular'}>Chat statistics:</Text>
      <HorizontalGrid columns={4}>
        <InfoBox height="100px" data={{"label": "conversations", "value": chartData.conversations}}/>
        <InfoBox height="100px" data={{"label": "messages", "value": chartData.messages}}/>
        <InfoBox height="100px" data={{"label": "downvotes", "value": chartData.downvotes}} color={"critical"}/>
        <InfoBox height="100px" data={{"label": "upvotes", "value": chartData.upvotes}} color={"success"}/>
      </HorizontalGrid>
    <ResponsiveContainer width={"100%"} aspect={2}>
      <AreaChart
        width={500}
        height={400}
        // @ts-ignore
        data={chartData.charts_data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dt" interval={3}/>
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="conversations" stroke="#8884d8" fill="#00214d" />
      </AreaChart>
    </ResponsiveContainer>
      </>
  );
}

export default Chart;
