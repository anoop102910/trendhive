import { Refine, Authenticated, useLogout } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { Button, ConfigProvider } from "antd";
import { authProvider } from "./providers/auth-provider";
import Login from "./auth/login";
import Register from "./auth/register";
import { RefineThemes, ThemedLayoutV2, useNotificationProvider } from "@refinedev/antd";
import { CategoryList } from "./pages/category/CategoryList";
import { CategoryCreate, CategoryEdit } from "./pages/category/CategoryForm";
import { ProductList } from "./pages/product/ProductList";
import { ProductCreate, ProductEdit } from "./pages/product/ProductForm";
import { dataProvider } from "./providers/data-provider";

export default function App() {
  const notificationProvider = useNotificationProvider();
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Orange}>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          routerProvider={routerProvider}
          notificationProvider={notificationProvider}
          resources={[
            {
              name: "categories",
              list: "/categories",
              create: "/categories/create",
              edit: "/categories/edit/:id",
            },
            {
              name: "products",
              list: "/products",
              create: "/products/create",
              edit: "/products/edit/:id",
            },
          ]}
        >
          <Routes>
            <Route
              element={
                <Authenticated key="authenticated-routes" redirectOnFail="/login">
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                </Authenticated>
              }
            >
              <Route index element={<Home />} />
              <Route path="/categories">
                <Route index element={<CategoryList />} />
                <Route path="create" element={<CategoryCreate />} />
                <Route path="edit/:id" element={<CategoryEdit />} />
              </Route>
              <Route path="/products">
                <Route index element={<ProductList />} />
                <Route path="create" element={<ProductCreate />} />
                <Route path="edit/:id" element={<ProductEdit />} />
              </Route>
            </Route>

            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  <Navigate to="/" />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const Home = () => {
  const { mutate: logout } = useLogout();
  return (
    <div>
      <h1>Welcome Home, Anoop Singh!</h1>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};
