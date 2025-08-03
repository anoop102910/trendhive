import { Spin } from "antd";

export const LoadingComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
};
