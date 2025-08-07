import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import {
  BrowserRouter
} from "react-router-dom"; 
import AppRouter from "./routes/Router"; 
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import {
  Toaster
} from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> {/* Este es el Router principal */}
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter /> {/*  Router con todas tus rutas */}
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;