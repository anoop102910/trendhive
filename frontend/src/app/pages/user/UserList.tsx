import { List, useTable, EditButton, DeleteButton, TagField, CreateButton } from "@refinedev/antd";
import { Table, Space, Input, Select } from "antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { useState } from "react";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps, setFilters } = useTable({
    syncWithLocation: true,
  });

  const [nameFilter, setNameFilter] = useState<string | undefined>();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>();

  const onNameFilterChange = (value: string) => {
    setNameFilter(value);
    setFilters([
      ...(value ? [{ field: "name", operator: "contains", value }] : []),
      ...(activeFilter !== undefined
        ? [{ field: "active", operator: "eq", value: activeFilter }]
        : []),
    ]);
  };

  const onActiveFilterChange = (value: boolean | undefined) => {
    setActiveFilter(value);
    setFilters([
      ...(nameFilter ? [{ field: "name", operator: "contains", value: nameFilter }] : []),
      ...(value !== undefined ? [{ field: "active", operator: "eq", value }] : []),
    ]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => {
              confirm();
              onNameFilterChange(selectedKeys[0]);
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
            autoFocus
          />
          <Space>
            <button
              onClick={() => {
                clearFilters();
                onNameFilterChange("");
              }}
            >
              Reset
            </button>
            <button
              onClick={() => {
                confirm();
                onNameFilterChange(selectedKeys[0]);
              }}
            >
              Filter
            </button>
          </Space>
        </div>
      ),
      filterIcon: () => <span>🔍</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Active",
      dataIndex: "active",
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      filteredValue: activeFilter !== undefined ? [activeFilter] : null,
      onFilter: (value: boolean, record: any) => record.active === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Select
            allowClear
            placeholder="Select status"
            value={selectedKeys[0]}
            onChange={val => setSelectedKeys(val !== undefined ? [val] : [])}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <button
              onClick={() => {
                clearFilters();
                onActiveFilterChange(undefined);
              }}
            >
              Reset
            </button>
            <button
              onClick={() => {
                confirm();
                onActiveFilterChange(selectedKeys[0]);
              }}
            >
              Filter
            </button>
          </Space>
        </div>
      ),
      render: (value: boolean) => (
        <TagField value={value ? "Active" : "Inactive"} color={value ? "green" : "red"} />
      ),
      filterMultiple: false,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: { id: string }) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record.id} />
          <DeleteButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List
      headerProps={{
        extra: <CreateButton />,
      }}
    >
      <Table {...tableProps} rowKey="id" columns={columns} />
    </List>
  );
};
