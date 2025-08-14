import { Refine, Authenticated } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { authProvider } from "./providers/auth-provider";
import { dataProvider } from "./providers/data-provider";

import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Gifts from "./pages/Gifts";
import Product from "./pages/Product";
import Shop from "./pages/Shop";
import OrderDetails from "./pages/OrderDetails";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { shadcnNotificationProvider } from "./providers/notification-provider";

const App = () => (
  <HelmetProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerProvider}
        notificationProvider={shadcnNotificationProvider}
      >
        <Routes>
          {/* Authenticated routes */}
          <Route
            element={
              <Authenticated key="authenticated-routes" redirectOnFail="/login">
                <Outlet />
              </Authenticated>
            }
          >
            <Route element={<Layout />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/shop" element={<Shop />} />
            </Route>
          </Route>

          {/* Public / auth pages */}
          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Layout />}>
                <Navigate to="/" />
              </Authenticated>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/shop" element={<Shop />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
