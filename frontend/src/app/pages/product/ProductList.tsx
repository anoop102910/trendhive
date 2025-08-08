import {
  List,
  EditButton,
  DeleteButton,
  useTable,
  ImportButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Radio, Row, Col, Card, Button, Image, Pagination } from "antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { TagField } from "@refinedev/antd";
import { useState } from "react";
import { ProductImport } from "../../../components/ProductImport";
import { useNavigation } from "@refinedev/core";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const { show } = useNavigation();

  const showImportModal = () => {
    setIsImportModalVisible(true);
  };

  const handleImportSuccess = () => {
    setIsImportModalVisible(false);
    tableQueryResult.refetch();
  };

  const handleImportCancel = () => {
    setIsImportModalVisible(false);
  };

  const products = tableProps.dataSource || [];

  return (
    <>
      <List
        headerProps={{
          extra: (
            <Space>
              <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                <Radio.Button value="table">
                  <UnorderedListOutlined />
                </Radio.Button>
                <Radio.Button value="gallery">
                  <AppstoreOutlined />
                </Radio.Button>
              </Radio.Group>
              <CreateButton />
            </Space>
          ),
        }}
      >
        {viewMode === "table" ? (
          <Table {...tableProps} rowKey="id">
            <Table.Column dataIndex="name" title="Name" />
            <Table.Column dataIndex="slug" title="Slug" />
            <Table.Column
              dataIndex="price"
              title="Price"
              render={value => `₹${value.toFixed(2)}`}
            />
            <Table.Column dataIndex="quantity" title="Quantity" />
            <Table.Column
              dataIndex="isPublished"
              title="Status"
              render={value => (
                <TagField
                  value={value ? "Published" : "Draft"}
                  color={value ? "green" : "orange"}
                />
              )}
            />
            <Table.Column
              dataIndex="isFeatured"
              title="Featured"
              render={value => (
                <TagField
                  value={value ? "Featured" : "Not Featured"}
                  color={value ? "blue" : "default"}
                />
              )}
            />
            <Table.Column
              title="Actions"
              dataIndex="actions"
              render={(_, record: { id: string }) => (
                <Space>
                  <EditButton hideText size="small" recordItemId={record.id} />
                  <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
              )}
            />
          </Table>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {products.map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <Image
                        src={
                          product.mainImage ||
                          product.images?.[0]?.url ||
                          "https://tse1.mm.bing.net/th/id/OIP.Vui1gAtnHmqJTYC5Xi0kMgHaFC?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                        }
                        alt={product.name}
                        style={{
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                    }
                    actions={[
                      <EditButton hideText size="small" recordItemId={product.id} key="edit" />,
                      <DeleteButton hideText size="small" recordItemId={product.id} key="delete" />,
                    ]}
                    onClick={() => show("products", product.id)}
                  >
                    <Card.Meta title={product.name} description={`₹${product.price?.toFixed(2)}`} />
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination {...tableProps.pagination} style={{ marginTop: 16, textAlign: "right" }} />
          </>
        )}
      </List>
      <ProductImport
        visible={isImportModalVisible}
        onCancel={handleImportCancel}
        onSuccess={handleImportSuccess}
      />
    </>
  );
};
