// src/routes/Router.tsx
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import POS from "@/pages/PosScreen";
import Kitchen from "@/pages/KitchenDisplay";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute"; 
import RegistroRestaurante from '@/pages/RegistroRestaurante';
const AppRouter = () => { 
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-restaurante" element={<RegistroRestaurante />} />

      {/* Rutas protegidas: Pasa el componente directamente como children */}
      <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
      <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;