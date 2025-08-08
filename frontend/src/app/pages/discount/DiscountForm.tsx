import React from "react";
import { useForm, Create, Edit, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Switch } from "antd";
import { useParams } from "react-router-dom";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import type { FormProps } from "antd/lib";
import {
  InfoCircleOutlined,
  TagOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useSelect as useRefineSelect } from "@refinedev/core";

interface IDiscount {
  id: string;
  name: string;
  code?: string;
  description?: string;
  type: string;
  value: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  productIds?: string[];
}

export const DiscountForm = () => {
  const { formProps, saveButtonProps, formLoading, form } = useForm<IDiscount>({
    redirect: "list",
  });

  const { id } = useParams();
  const isEditing = !!id;

  const { options: productOptions } = useRefineSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: 20,
    },
  });

  const disabledDate: RangePickerProps["disabledDate"] = current => {
    return current && current < dayjs().startOf("day");
  };

  const formFields = (
    <Form {...formProps} form={form} layout="vertical">
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter a name for the discount.",
          },
          {
            min: 3,
            message: "Discount name must be at least 3 characters",
          },
          {
            max: 255,
            message: "Discount name must be at most 255 characters",
          },
        ]}
      >
        <Input
          size="large"
          placeholder="e.g., 'Summer Sale 2025'"
          prefix={<InfoCircleOutlined />}
        />
      </Form.Item>
      <Form.Item
        label="Coupon Code"
        name="code"
        rules={[
          {
            max: 255,
            message: "Coupon code must be at most 255 characters",
          },
        ]}
      >
        <Input size="large" placeholder="Optional, e.g., 'SUMMER10'" prefix={<TagOutlined />} />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea size="large" placeholder="Describe the discount" rows={4} />
      </Form.Item>
      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please select a discount type." }]}
        initialValue="PERCENTAGE"
      >
        <Select size="large" placeholder="Select discount type">
          <Select.Option value="PERCENTAGE">Percentage</Select.Option>
          <Select.Option value="FIXED_AMOUNT">Fixed Amount</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Value"
        name="value"
        rules={[
          {
            required: true,
            message: "Please enter the discount value.",
          },
          {
            type: "number",
            min: 0,
            message: "Value must be a positive number",
          },
        ]}
      >
        <InputNumber
          size="large"
          style={{ width: "100%" }}
          placeholder="Enter value"
          prefix={
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) =>
                getFieldValue("type") === "PERCENTAGE" ? <PercentageOutlined /> : <DollarOutlined />
              }
            </Form.Item>
          }
          formatter={value => {
            const type = form.getFieldValue("type");
            if (type === "PERCENTAGE") {
              return `${value}%`;
            }
            return `$ ${value}`;
          }}
        />
      </Form.Item>
      <Form.Item
        label="Start Date"
        name="startDate"
        rules={[{ required: true, message: "Please select a start date." }]}
      >
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          placeholder="Select start date"
          prefix={<CalendarOutlined />}
          disabledDate={disabledDate}
        />
      </Form.Item>
      <Form.Item label="End Date" name="endDate">
        <DatePicker
          size="large"
          style={{ width: "100%" }}
          placeholder="Optional end date"
          prefix={<CalendarOutlined />}
          disabledDate={disabledDate}
        />
      </Form.Item>
      <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item label="Assign to Products" name="productIds">
        <Select
          mode="multiple"
          placeholder="Select products"
          options={productOptions}
          style={{ width: "100%" }}
        />
      </Form.Item>
    </Form>
  );

  if (isEditing) {
    return (
      <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
        {formFields}
      </Edit>
    );
  }

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      {formFields}
    </Create>
  );
};
