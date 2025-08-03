import { List, EditButton, DeleteButton, useTable } from "@refinedev/antd";
import { Table, Space } from "antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { TagField } from "@refinedev/antd";

export const ProductList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="slug" title="Slug" />
        <Table.Column dataIndex="price" title="Price" render={value => `₹${value.toFixed(2)}`} />
        <Table.Column dataIndex="quantity" title="Quantity" />
        <Table.Column
          dataIndex="isPublished"
          title="Status"
          render={value => (
            <TagField value={value ? "Published" : "Draft"} color={value ? "green" : "orange"} />
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
    </List>
  );
};
