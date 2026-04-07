import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import React from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import { ProductDetail } from "./pages/ProductDetail";

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
            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <div style={{ padding: "20px" }}>
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
