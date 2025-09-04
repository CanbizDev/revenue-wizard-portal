import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import LoginPage from "./components/Auth/LoginPage";
import SellerDashboard from "./components/Dashboard/SellerDashboard";
import ClientDashboard from "./components/Dashboard/ClientDashboard";
import { apiService } from "./services/api";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setIsAuthenticated(true);
      setCurrentUserType(user.user_type);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userType: string) => {
    setIsAuthenticated(true);
    setCurrentUserType(userType);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setCurrentUserType('');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    // Render dashboard based on user type
    switch (currentUserType) {
      case 'seller':
      case 'admin':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold">SaaS Dashboard</h1>
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">
              <SellerDashboard />
            </main>
          </div>
        );
      
      case 'client':
        return (
          <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Client Portal</h1>
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            </header>
            <main className="container mx-auto px-4 py-6">
              <ClientDashboard />
            </main>
          </div>
        );
      
      default:
        return <div>Invalid user type</div>;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderContent()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
