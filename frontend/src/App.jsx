import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Navbar />

        <main className="app-content">

          <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================== */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            </Route>

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =========================
                USER PROTECTED ROUTES
            ========================== */}

            <Route element={<ProtectedRoute />}>

              <Route
                path="/orders"
                element={<Orders />}
              />

            </Route>


            {/* =========================
                ADMIN PROTECTED ROUTES
            ========================== */}

            <Route element={<AdminRoute />}>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/products"
                element={<AdminProducts />}
              />

              <Route
                path="/admin/orders"
                element={<AdminOrders />}
              />

            </Route>

          </Routes>

        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;