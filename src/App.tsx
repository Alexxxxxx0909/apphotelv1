import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import AdminDashboard from "@/components/AdminDashboard";
import CollaboratorDashboard from "@/components/CollaboratorDashboard";
import Index from "@/pages/Index";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  
  useEffect(() => {
    const handleNavigateToLogin = () => {
      setShowLogin(true);
    };
    
    window.addEventListener('navigate-to-login', handleNavigateToLogin);
    
    return () => {
      window.removeEventListener('navigate-to-login', handleNavigateToLogin);
    };
  }, []);
  
  if (isAuthenticated && user) {
    console.log('Usuario autenticado en App.tsx:', user);
    console.log('Rol del usuario en App.tsx:', user.role);
    // Enrutamiento basado en roles
    switch (user.role) {
      case 'administrador':
        console.log('Enviando a AdminDashboard');
        return <AdminDashboard />;
      case 'gerente':
        console.log('Enviando a Dashboard gerencial');
        return <Dashboard />;
      case 'colaborador':
        console.log('Enviando a CollaboratorDashboard');
        return <CollaboratorDashboard />;
      default:
        console.log('Rol no reconocido, enviando a Dashboard por defecto:', user.role);
        return <Dashboard />; // Fallback por defecto
    }
  }
  
  if (showLogin) {
    return <LoginPage />;
  }
  
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
