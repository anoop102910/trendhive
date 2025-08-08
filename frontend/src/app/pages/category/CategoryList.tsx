import { useTable } from "@refinedev/antd";
import { Table, Space, Input } from "antd";
import { List, ShowButton, EditButton, DeleteButton } from "@refinedev/antd";
import { LoadingComponent } from "../../../components/Loading";
import { ErrorComponent } from "../../../components/Error";
import { useState } from "react";

interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metadata: Record<string, string>;
  private_metadata: Record<string, string>;
  seoSlug?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const CategoryList = () => {
  const { tableProps, tableQuery, setFilters } = useTable<ICategory>({
    resource: "categories",
    initialFilter: [],
  });

  const [searchText, setSearchText] = useState("");

  if (tableQuery.isLoading) {
    return <LoadingComponent />;
  }

  if (tableQuery.isError) {
    return <ErrorComponent />;
  }

  const handleSearch = (value: string) => {
    setFilters([
      {
        field: "name",
        operator: "contains",
        value,
      },
    ]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={() => handleSearch(searchText)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <a onClick={() => handleSearch(searchText)}>Search</a>
            <a
              onClick={() => {
                setSearchText("");
                handleSearch("");
              }}
            >
              Reset
            </a>
          </Space>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: ICategory) => (
        <Space>
          <ShowButton hideText recordItemId={record.id} />
          <EditButton hideText recordItemId={record.id} />
          <DeleteButton hideText recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table {...tableProps} columns={columns} rowKey="id" />
    </List>
  );
};
