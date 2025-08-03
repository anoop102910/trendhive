import { List, EditButton, DeleteButton, useTable, ShowButton } from "@refinedev/antd";
import { Table, Space, Image } from "antd";
import type { IResourceComponentsProps } from "@refinedev/core";

export const CollectionList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="slug" title="Slug" />
        <Table.Column
          dataIndex="backgroundImage"
          title="Background Image"
          render={value =>
            value ? (
              <Image src={value} alt="Background" style={{ maxWidth: 100, maxHeight: 100 }} />
            ) : (
              "No image"
            )
          }
        />
        <Table.Column
          title="Products"
          dataIndex="products"
          render={products => products?.length || 0}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: { id: string }) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
