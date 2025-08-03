import { Result } from "antd";

export const ErrorComponent = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Result
        status="error"
        title="Something went wrong!"
        subTitle="Please check your connection and try again."
      />
    </div>
  );
};
