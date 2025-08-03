import { useTable } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";
import { List, ShowButton, EditButton, DeleteButton } from "@refinedev/antd";
import { LoadingComponent } from "../../../components/Loading";
import { ErrorComponent } from "../../../components/Error";
import { COUPON_TYPE } from "./types";

interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: typeof COUPON_TYPE;
  discountValue: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  _count: {
    assignedUsers: number;
    ProductCoupon: number;
  };
}

export const CouponList = () => {
  const { tableProps, tableQuery } = useTable<ICoupon>({
    resource: "coupons",
  });

  if (tableQuery.isLoading) {
    return <LoadingComponent />;
  }

  if (tableQuery.isError) {
    return <ErrorComponent />;
  }

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: true,
    },
    {
      title: "Type",
      dataIndex: "discountType",
      key: "discountType",
      render: (value: COUPON_TYPE) => (
        <Tag color={value === "PERCENTAGE" ? "blue" : "green"}>{value}</Tag>
      ),
    },
    {
      title: "Value",
      dataIndex: "discountValue",
      key: "discountValue",
      render: (value: number, record: ICoupon) =>
        record.discountType === "PERCENTAGE" ? `${value}%` : `$${value}`,
    },
    {
      title: "Usage",
      key: "usage",
      render: (record: ICoupon) => (
        <span>
          {record.usedCount} / {record.usageLimit || "∞"}
        </span>
      ),
    },
    {
      title: "Valid Period",
      key: "validPeriod",
      render: (record: ICoupon) => (
        <span>
          {new Date(record.startDate).toLocaleDateString()} -{" "}
          {new Date(record.endDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (value: boolean) => (
        <Tag color={value ? "success" : "error"}>{value ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Assigned",
      key: "assigned",
      render: (record: ICoupon) => (
        <Space>
          <Tag color="blue">{record._count.assignedUsers} Users</Tag>
          <Tag color="cyan">{record._count.ProductCoupon} Products</Tag>
        </Space>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: ICoupon) => (
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
