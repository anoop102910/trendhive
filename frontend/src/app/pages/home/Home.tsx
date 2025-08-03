import { useList } from "@refinedev/core";
import { Card, Col, Row, Space, Statistic, Table, Typography } from "antd";
import {
  AppstoreOutlined,
  ShoppingOutlined,
  TagsOutlined,
  CoffeeOutlined,
  GiftOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export const Home = () => {
  const { data: categoriesData } = useList({ resource: "categories" });
  const { data: productsData } = useList({
    resource: "products",
    sorters: [{ field: "createdAt", order: "desc" }],
  });
  const { data: collectionsData } = useList({ resource: "collections" });
  const { data: attributesData } = useList({ resource: "attributes" });
  const { data: couponsData } = useList({ resource: "coupons" });

  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={3}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Categories"
              value={categoriesData?.data.length || 0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Products"
              value={productsData?.data.length || 0}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Collections"
              value={collectionsData?.data.length || 0}
              prefix={<TagsOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Attributes"
              value={attributesData?.data.length || 0}
              prefix={<CoffeeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="Coupons"
              value={couponsData?.data.length || 0}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Products">
            <Table
              dataSource={productsData?.data || []}
              columns={productColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};
