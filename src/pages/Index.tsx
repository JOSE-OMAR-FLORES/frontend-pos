
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";



console.log("✅ Se montó Index.tsx");
const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto p-8">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Sistema POS FastFood Mall
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema completo de punto de venta para restaurantes de comida rápida en centros comerciales
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">🍔 Toma de Pedidos</CardTitle>
              <CardDescription>
                Interfaz intuitiva para procesamiento rápido de órdenes
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">👨‍🍳 Sistema de Cocina</CardTitle>
              <CardDescription>
                Pantalla KDS para gestión de pedidos en tiempo real
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">📈 Reportes y Analytics</CardTitle>
              <CardDescription>
                Análisis detallado de ventas y rendimiento
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/pos')}
            >
              🛒 Sistema POS
            </Button>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
              onClick={() => navigate('/kitchen')}
            >
              👨‍🍳 Pantalla Cocina
            </Button>

             <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate('/analytics')}
            >
              📊 Analytics
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            Diseñado específicamente para restaurantes de comida rápida en centros comerciales
          </div>

          
          <a href="/registro-restaurante" className="mt-4 text-blue-600 underline block text-center">
  ¿Eres un restaurante nuevo? Regístrate aquí
</a>







        </div>
      </div>
    </div>
  );
};

export default Index;
