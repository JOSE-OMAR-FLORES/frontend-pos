import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type Props = {
  data: {
    dia: string;
    total: number;
  }[];
};

const chartConfig = {
  sales: {
    label: "Ventas",
    color: "#FF6B35"
  }
};

export const WeeklySalesChart = ({ data }: Props) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Ventas Semanales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <XAxis dataKey="dia" axisLine={false} tickLine={false} className="text-gray-500" />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-gray-500"
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => [`$${value}`, "Ventas"]}
            />
            <Bar dataKey="total" fill="#FF6B35" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
