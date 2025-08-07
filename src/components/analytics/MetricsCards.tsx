import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  ventasHoy: number;
  ordenesHoy: number;
  ordenesTotales: number;
  clientesUnicos: number;
  tiempoPromedio: string;
};

export const MetricsCards = ({
  ventasHoy,
  ordenesHoy,
  ordenesTotales,
  clientesUnicos,
  tiempoPromedio,
}: Props) => {
  const metrics = [
    {
      title: "Ventas de Hoy",
      value: `$${ventasHoy.toLocaleString()}`,
      color: "text-green-600",
    },
    {
      title: "Órdenes de Hoy",
      value: ordenesHoy.toLocaleString(),
      color: "text-blue-600",
    },
    {
      title: "Órdenes Totales",
      value: ordenesTotales.toLocaleString(),
      color: "text-indigo-600",
    },
    {
      title: "Clientes Únicos",
      value: clientesUnicos.toLocaleString(),
      color: "text-purple-600",
    },
    {
      title: "Tiempo Promedio (min)",
      value: tiempoPromedio,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white shadow rounded-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
