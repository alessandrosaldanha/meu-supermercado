import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import React from "react";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Signup from "./pages/Signup/Signup";
import Profile from "./pages/Profile/Profile";
import { Orders } from "./pages/Orders/Orders";
import Checkout from "./components/Checkout/Checkout";
import { ProductDetail } from "./pages/ProductDetail/ProductDetail";
import "./App.css";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem("userRole");
  const isPrivileged = userRole === "master" || userRole === "admin";

  return isPrivileged ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Ajustado para /orders para bater com o Link do Navbar */}
            <Route path="/orders" element={<Orders />} />

            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <div className="admin-container">
                    <h1>Gestão de Usuários</h1>
                    <p>
                      Vital, aqui você vai listar os usuários do Xano em breve.
                    </p>
                  </div>
                </ProtectedAdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
