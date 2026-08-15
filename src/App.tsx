import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import React from "react";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Stamp } from "./components/Stamp/Stamp";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import { Orders } from "./pages/Orders/Orders";
import Checkout from "./pages/Checkout/Checkout";
import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
import "./App.css";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem("userRole");
  const isPrivileged = userRole === "master" || userRole === "admin";

  return isPrivileged ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <div className="admin-container">
                      <Stamp variant="tag" tone="papaya">
                        <ShieldCheck size={14} /> Painel administrativo
                      </Stamp>
                      <h1>Gestão de Usuários</h1>
                      <p>
                        Vital, aqui você vai listar os usuários do Xano em
                        breve.
                      </p>
                    </div>
                  </ProtectedAdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
