import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";

import Project from "./pages/Project";
import Search from "./pages/Search";
import Agents from "./pages/Agents";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ContractTemplate from "@/pages/ContractTemplate";
import LoanCalculator from "@/pages/tools/LoanCalculator";
import CollateralEstimator from "@/pages/tools/CollateralEstimator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/mua" element={<Buy />} />
            <Route path="/thue" element={<Rent />} />
            <Route path="/ban" element={<Sell />} />
            <Route path="/du-an" element={<Project />} />
            <Route path="/listings/new" element={<Sell />} />
            <Route path="/search" element={<Search />} />
            <Route path="/moi-gioi" element={<Agents />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/hop-dong-mua-ban" element={<ContractTemplate />} />
            <Route path="/tools/loan" element={<LoanCalculator />} />
            <Route path="/tools/collateral" element={<CollateralEstimator />} />
            {/* Protected Dashboard Routes */}
            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/transactions" element={<Wallet />} />
              <Route path="/hop-dong-mua-ban" element={<ContractTemplate />} />
            </Route>
            <Route element={<DashboardLayout />}></Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;




