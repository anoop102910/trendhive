import { useTable } from "@refinedev/antd";
import { Table, Space} from "antd";
import { List, ShowButton, EditButton, DeleteButton } from "@refinedev/antd";
import { LoadingComponent } from "../../../components/Loading";
import { ErrorComponent } from "../../../components/Error";

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
  const { tableProps, tableQuery } = useTable<ICategory>({
    resource: "categories",
  });

  if (tableQuery.isLoading) {
    return <LoadingComponent />;
  }

  if (tableQuery.isError) {
    return <ErrorComponent />;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
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
