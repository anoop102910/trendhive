import { useTable, List } from "@refinedev/antd";
import { Card, Col, Row, Typography, Button, Space } from "antd";
import { useApiUrl, useCustom, useCustomMutation } from "@refinedev/core";
import { ShoppingCartOutlined, HeartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Meta } = Card;
const { Text } = Typography;

interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export const ProductGallery = () => {
  const { tableProps } = useTable<IProduct>({
    resource: "products",
  });
  const apiUrl = useApiUrl();
  const { refetch: refetchCart } = useCustom<any>({
    url: `${apiUrl}/cart`,
    method: "get",
  });

  const { mutate, isLoading } = useCustomMutation();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleAddToCart = (productId: string) => {
    mutate(
      {
        url: `${apiUrl}/cart`,
        method: "post",
        values: { productId, quantity: 1 },
        successNotification: () => {
          return {
            message: "Product added to cart successfully",
            type: "success",
            description: "Product added to cart",
          };
        },
      },
      {
        onSuccess: () => {
          setAddedProductId(productId);
          refetchCart();
          setTimeout(() => setAddedProductId(null), 1000);
        },
      }
    );
  };

  return (
    <List>
      <Row gutter={[16, 16]}>
        {tableProps?.dataSource?.map(product => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              actions={[
                <Button
                  type="text"
                  icon={
                    addedProductId === product.id ? (
                      <CheckCircleOutlined style={{ color: "green" }} />
                    ) : (
                      <ShoppingCartOutlined />
                    )
                  }
                  onClick={() => handleAddToCart(product.id)}
                  loading={isLoading && addedProductId === product.id}
                >
                  {addedProductId === product.id ? "Added" : "Add to Cart"}
                </Button>,
                <Button type="text" icon={<HeartOutlined />}>
                  Wishlist
                </Button>,
              ]}
            >
              <Meta
                title={
                  <Space direction="vertical">
                    <Text strong>{product.name}</Text>
                    <Text type="success">${product.price.toFixed(2)}</Text>
                  </Space>
                }
                description={product.description.substring(0, 50) + "..."}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </List>
  );
};
