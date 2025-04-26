
import React from 'react';
import { PricePoint } from '@/types';
import { formatCurrency } from '@/lib/mockData';
import { ChartArea } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceHistoryChartProps {
  priceHistory: PricePoint[];
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ priceHistory }) => {
  // Don't render the chart if we have less than 2 price points
  if (priceHistory.length < 2) {
    return (
      <Card className="w-full bg-secondary">
        <CardHeader className="py-3">
          <CardTitle className="text-base flex justify-between items-center">
            <span>Price History</span>
            <ChartArea className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-sm text-center py-6 text-muted-foreground">
            Not enough price data to display a chart.
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = priceHistory.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    price: point.price
  }));

  // Calculate the minimum price for the chart domain
  const minPrice = Math.min(...priceHistory.map(p => p.price)) * 0.95;
  const maxPrice = Math.max(...priceHistory.map(p => p.price)) * 1.05;

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Price History</span>
          <ChartArea className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryChart;
