import { useTable } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { List, ShowButton, EditButton, DeleteButton } from "@refinedev/antd";
import { LoadingComponent } from "../../../components/Loading";
import { ErrorComponent } from "../../../components/Error";

interface IAttribute {
  id: string;
  name: string;
  values: {
    id: string;
    value: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const AttributeList = () => {
  const { tableProps, tableQuery } = useTable<IAttribute>({
    resource: "attributes",
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
      title: "Values",
      dataIndex: "values",
      key: "values",
      render: (values: { value: string }[]) => (
        <Space size={[0, 8]} wrap>
          {values.map((val, index) => (
            <Tag key={index} color="blue">
              {val.value}
            </Tag>
          ))}
        </Space>
      ),
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
      render: (_: any, record: IAttribute) => (
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
