import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { DataProvider } from "@refinedev/nestjs-query";
import { useNotificationProvider } from "@refinedev/antd";
import { Layout } from "./components/layout";
import { CouponList } from "./pages/coupon/CouponList";
import { CouponForm } from "./pages/coupon/CouponForm";

export const App: React.FC = () => {
  return (
    <RefineKbarProvider>
      <Refine
        // ... other configurations
        resources={[
          // ... other resources
          {
            name: "coupons",
            list: "/coupons",
            create: "/coupons/create",
            edit: "/coupons/edit/:id",
            show: "/coupons/show/:id",
            meta: {
              label: "Coupons",
              icon: <ShoppingOutlined />,
            },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          <Route
            element={
              <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            {/* ... other routes */}
            <Route path="/coupons">
              <Route index element={<CouponList />} />
              <Route path="create" element={<CouponForm />} />
              <Route path="edit/:id" element={<CouponForm />} />
            </Route>
          </Route>
        </Routes>
      </Refine>
    </RefineKbarProvider>
  );
};
