import { Refine, Authenticated } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { authProvider } from "./providers/auth-provider";
import Login from "./auth/login";
import Register from "./auth/register";
import { dataProvider } from "./providers/data-provider";
import LandingPage from "./pages/home";
import Layout from "./components/layout";
import ShopPage from "./pages/shop";
import { shadcnNotificationProvider } from "./providers/notification-provider";
import { CartPage } from "./pages/cart";
import { CheckoutPage } from "./pages/checkout";

export default function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        authProvider={authProvider}
        routerProvider={routerProvider}
        notificationProvider={shadcnNotificationProvider}
      >
        <Routes>
          <Route
            element={
              <Authenticated key="authenticated-routes" redirectOnFail="/login">
                <Outlet />
              </Authenticated>
            }
          >
            <Route element={<Layout />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/shop" element={<ShopPage />} />
          </Route>

          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Outlet />}>
                <Navigate to="/" />
              </Authenticated>
            }
          >
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
