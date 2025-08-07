import React from "react";
import {
  Space,
  Button,
  InputNumber,
  Row,
  Col,
  Card,
  Form,
  Input,
  Typography,
  message,
  List as AntList,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useApiUrl, useCustom, useCustomMutation } from "@refinedev/core";

const { Text, Title } = Typography;

interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  // Add other product fields like image if available in your API
}

interface ICartItem {
  id: string;
  quantity: number;
  productId: string;
  product: IProduct;
}

interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
}

export const CartPage: React.FC = () => {
  const apiUrl = useApiUrl();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchCart,
  } = useCustom<ICart>({
    url: `${apiUrl}/cart`,
    method: "get",
  });

  const { mutate: updateCartMutation, isLoading: isUpdating } = useCustomMutation();
  const { mutate: removeCartItemMutation, isLoading: isRemoving } = useCustomMutation();

  const cart = data?.data;

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateCartMutation(
      {
        url: `${apiUrl}/cart`,
        method: "post",
        values: { productId, quantity: newQuantity },
      },
      {
        onSuccess: () => {
          message.success("Cart updated successfully");
          refetchCart();
        },
        onError: (error: any) => {
          message.error(error.message || "Failed to update cart");
        },
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation(
      {
        url: `${apiUrl}/cart/items/${itemId}`,
        method: "delete",
      },
      {
        onSuccess: () => {
          message.success("Item removed from cart");
          refetchCart();
        },
        onError: (error: any) => {
          message.error(error.message || "Failed to remove item");
        },
      }
    );
  };

  const calculateSubtotal = () => {
    return cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  };

  const [couponForm] = Form.useForm();
  const handleCouponSubmit = (values: { couponCode: string }) => {
    console.log("Coupon submitted:", values.couponCode);
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  if (isError) {
    return <div>Error loading cart.</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card title={<Title level={3}>Shopping Cart</Title>} style={{ marginBottom: 24 }}>
            <AntList
              itemLayout="horizontal"
              dataSource={cart?.items}
              renderItem={(item: ICartItem) => (
                <AntList.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.id)}
                      loading={isRemoving}
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <AntList.Item.Meta
                    title={<Text strong>{item.product.name}</Text>}
                    description={<Text>${item.product.price.toFixed(2)}</Text>}
                  />
                  <Space size="large">
                    <InputNumber
                      min={0}
                      value={item.quantity}
                      onChange={value => handleUpdateQuantity(item.productId, value || 0)}
                      loading={isUpdating}
                    />
                    <Text strong>${(item.product.price * item.quantity).toFixed(2)}</Text>
                  </Space>
                </AntList.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={<Title level={3}>Order Summary</Title>}>
            <Row justify="space-between" style={{ marginBottom: "16px" }}>
              <Text strong>Subtotal:</Text>
              <Text strong>${calculateSubtotal()?.toFixed(2)}</Text>
            </Row>
            <Form form={couponForm} onFinish={handleCouponSubmit} layout="vertical">
              <Form.Item name="couponCode" label="Coupon Code">
                <Input placeholder="Enter coupon code" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Apply Coupon
                </Button>
              </Form.Item>
            </Form>
            <Button type="primary" style={{ marginTop: "16px" }} size="large" block>
              Checkout
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
