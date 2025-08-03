import { Form, Input, Button, Typography } from "antd";
import { useLogin } from "@refinedev/core";

const { Title } = Typography;

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const [form] = Form.useForm();

  const onSubmit = (values: { email: string; password: string }) => {
    mutate(values, {
      onError: (error: any) => {
        form.setFields([
          {
            name: "email",
            errors: [error?.message || "Login failed"],
          },
        ]);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <Title level={3} className="text-center">
          Login
        </Title>
        <Form layout="vertical" form={form} onFinish={onSubmit} requiredMark={true}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input size="large" placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
