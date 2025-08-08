import React from "react";
import { List, EditButton, DeleteButton, useTable } from "@refinedev/antd";
import { Table, Space } from "antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { TagField } from "@refinedev/antd";

export const DiscountList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="code" title="Code" />
        <Table.Column dataIndex="type" title="Type" />
        <Table.Column dataIndex="value" title="Value" />
        <Table.Column dataIndex="startDate" title="Start Date" />
        <Table.Column dataIndex="endDate" title="End Date" />
        <Table.Column
          dataIndex="isActive"
          title="Active"
          render={value => (
            <TagField value={value ? "Active" : "Inactive"} color={value ? "green" : "red"} />
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
