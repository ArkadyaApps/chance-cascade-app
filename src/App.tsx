import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { BottomNav } from "@/components/layout/BottomNav";
import { DynamicBackground } from "@/components/layout/DynamicBackground";
import { PageTransition } from "@/components/layout/PageTransition";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Wallet from "./pages/Wallet";
import PaymentHistory from "./pages/PaymentHistory";
import MyEntries from "./pages/MyEntries";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Winners from "./pages/Winners";
import Contact from "./pages/Contact";
import DailyWheel from "./pages/DailyWheel";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEntries from "./pages/admin/AdminEntries";
import AdminDraws from "./pages/admin/AdminDraws";
import AdminAboutUs from "./pages/admin/AdminAboutUs";
import ProductForm from "./pages/admin/ProductForm";
import { AdminLayout } from "./components/admin/AdminLayout";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DynamicBackground />
          <PageTransition>
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
              path="/wheel"
              element={
                <div className="min-h-screen bg-background">
                  <ProtectedRoute>
                    <DailyWheel />
                  </ProtectedRoute>
                </div>
              }
            />
            <Route
              path="/payment-history"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <ProtectedRoute>
                    <PaymentHistory />
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <Contact />
                </div>
              }
            />
            <Route
              path="/about"
              element={
                <div className="min-h-screen bg-background pb-20">
                  <AboutUs />
                </div>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminProducts />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/entries"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminEntries />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/draws"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDraws />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductForm />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductForm />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/about-us"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminAboutUs />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PageTransition>
          <BottomNav />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
