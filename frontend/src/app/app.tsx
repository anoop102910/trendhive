import { Refine, Authenticated, useLogout } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { Button, ConfigProvider } from "antd";
import { authProvider } from "./providers/auth-provider";
import Login from "./auth/login";
import Register from "./auth/register";
import { ThemedLayoutV2, useNotificationProvider, RefineThemes } from "@refinedev/antd";
import { CategoryList } from "./pages/category/CategoryList";
import { CategoryCreate, CategoryEdit } from "./pages/category/CategoryForm";
import { ProductList } from "./pages/product/ProductList";
import { ProductCreate, ProductEdit } from "./pages/product/ProductForm";
import { CollectionList } from "./pages/collection/CollectionList";
import { CollectionCreate, CollectionEdit } from "./pages/collection/CollectionForm";
import { dataProvider } from "./providers/data-provider";
import { AttributeList } from "./pages/attribute/AttributeList";
import { AttributeForm } from "./pages/attribute/AttributeForm";
import { CouponList } from "./pages/coupon/CouponList";
import { CouponForm } from "./pages/coupon/CouponForm";
import { DiscountList } from "./pages/discount/DiscountList";
import { DiscountForm } from "./pages/discount/DiscountForm";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  TagsOutlined,
  CoffeeOutlined,
  GiftOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { UserList } from "./pages/user/UserList";

export default function App() {
  const notificationProvider = useNotificationProvider();
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Green}>
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
              icon: <AppstoreOutlined />,
            },
            {
              name: "products",
              list: "/products",
              create: "/products/create",
              edit: "/products/edit/:id",
              icon: <ShoppingOutlined />,
            },
            {
              name: "collections",
              list: "/collections",
              create: "/collections/create",
              edit: "/collections/edit/:id",
              icon: <TagsOutlined />,
            },
            {
              name: "attributes",
              list: "/attributes",
              create: "/attributes/create",
              edit: "/attributes/edit/:id",
              icon: <CoffeeOutlined />,
            },
            {
              name: "coupons",
              list: "/coupons",
              create: "/coupons/create",
              edit: "/coupons/edit/:id",
              icon: <GiftOutlined />,
            },
            {
              name: "discount",
              list: "/discount",
              create: "/discount/create",
              edit: "/discount/edit/:id",
              icon: <GiftOutlined />,
            },
            {
              name: "users",
              list: "/users",
              icon: <UserAddOutlined />,
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
              <Route path="/collections">
                <Route index element={<CollectionList />} />
                <Route path="create" element={<CollectionCreate />} />
                <Route path="edit/:id" element={<CollectionEdit />} />
              </Route>
              <Route path="/attributes">
                <Route index element={<AttributeList />} />
                <Route path="create" element={<AttributeForm />} />
                <Route path="edit/:id" element={<AttributeForm />} />
              </Route>
              <Route path="/coupons">
                <Route index element={<CouponList />} />
                <Route path="create" element={<CouponForm />} />
                <Route path="edit/:id" element={<CouponForm />} />
              </Route>
              <Route path="/discount">
                <Route index element={<DiscountList />} />
                <Route path="create" element={<DiscountForm />} />
                <Route path="edit/:id" element={<DiscountForm />} />
              </Route>
              <Route path="/users">
                <Route index element={<UserList />} />
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
