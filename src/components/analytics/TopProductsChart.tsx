import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

type Props = {
  data: {
    categoria: string;
    cantidad: number;
  }[];
};

const chartConfig = {
  value: {
    label: "Porcentaje"
  }
};

const COLORS = ["#FF6B35", "#FFA726", "#FFEB3B", "#F48FB1", "#FFB74D", "#90CAF9"];

export const TopProductsChart = ({ data }: Props) => {
  const totalCantidad = data.reduce((acc, curr) => acc + (curr.cantidad || 0), 0);

  // Evitar división entre 0
  const formattedData =
    totalCantidad > 0
      ? data.map((item, index) => ({
          name: item.categoria,
          value: parseFloat(((item.cantidad / totalCantidad) * 100).toFixed(1)),
          color: COLORS[index % COLORS.length]
        }))
      : [];

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Productos Más Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formattedData.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay datos disponibles para mostrar.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, "Porcentaje"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => `${value} ${entry.payload.value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
