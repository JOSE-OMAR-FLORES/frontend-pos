import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from '../config';
import { ORDERS_API_URL } from '../config';
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { WeeklySalesChart } from "@/components/analytics/WeeklySalesChart";
import { TopProductsChart } from "@/components/analytics/TopProductsChart";

const Analytics = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

const handleDownloadSummary = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/analytics/monthly-summary`, {
      responseType: "blob",
    });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resumen_mensual.txt");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el resumen:", error);
      alert("No se pudo descargar el resumen mensual.");
    }
  };

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<{
    ventas_hoy: number;
    ordenes_hoy: number;
    ordenes_totales: number;
    clientes_unicos: number;
    tiempo_promedio: number;
    ventas_semanales: { dia: string; total: number }[];
    productos_mas_vendidos: { categoria: string; cantidad: number }[];
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "analytics") {
      navigate("/login");
      return;
    }

    const fetchMetrics = async () => {
      try {
  const res = await axios.get(`${BACKEND_URL}/analytics`);
        setMetrics(res.data);
      } catch (error) {
        console.error("Error al cargar métricas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isAuthenticated, userRole, navigate]);

  if (loading) {
    return <div className="p-6 text-gray-500">Cargando métricas...</div>;
  }

  if (!metrics) {
    return <div className="p-6 text-red-500">Error al cargar datos.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Analytics</h1>
            <p className="text-gray-600">Análisis detallado de ventas y rendimiento</p>
          </div>
          <button
            onClick={handleDownloadSummary}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded"
          >
            Descargar resumen mensual
          </button>
        </div>

        {/* Métricas principales */}
        <MetricsCards
          ventasHoy={metrics.ventas_hoy}
          ordenesHoy={metrics.ordenes_hoy}
          ordenesTotales={metrics.ordenes_totales}
          clientesUnicos={metrics.clientes_unicos}
          tiempoPromedio={metrics.tiempo_promedio}
        />

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <WeeklySalesChart data={metrics.ventas_semanales} />
          <TopProductsChart data={metrics.productos_mas_vendidos || []} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
