import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { BottomNav } from "@/components/layout/BottomNav";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Wallet from "./pages/Wallet";
import MyEntries from "./pages/MyEntries";
import Profile from "./pages/Profile";
import Winners from "./pages/Winners";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductForm from "./pages/admin/ProductForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/product/:id"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/wallet"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/entries"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <MyEntries />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/winners"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <Winners />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </div>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <ProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <ProductForm />
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
