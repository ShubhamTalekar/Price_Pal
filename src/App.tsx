
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext"; // Added useApp import here
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainLayout from "@/components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Wishlist from "./pages/wishlist/Wishlist";
import AddProduct from "./pages/wishlist/AddProduct";
import ProductDetail from "./pages/wishlist/ProductDetail";
import Wallet from "./pages/wallet/Wallet";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Route that redirects authenticated users
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Component to conditionally render Landing or Dashboard
const LandingOrDashboard: React.FC = () => {
  const { isAuthenticated } = useApp();
  
  if (isAuthenticated) {
    return (
      <Navigate to="/dashboard" replace />
    );
  }
  
  return <Landing />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        } />
        
        {/* Root route with conditional rendering */}
        <Route path="/" element={<LandingOrDashboard />} />
        
        {/* Dashboard route */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <MainLayout>
              <Wishlist />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wishlist/add" element={
          <ProtectedRoute>
            <MainLayout>
              <AddProduct />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wishlist/:productId" element={
          <ProtectedRoute>
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/wallet" element={
          <ProtectedRoute>
            <MainLayout>
              <Wallet />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
