import { useForm, Create, Edit, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Switch, Space } from "antd";
import { useParams } from "react-router-dom";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { COUPON_TYPE } from "./types";
import type { FormProps } from "antd/lib";

interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discountType: typeof COUPON_TYPE;
  discountValue: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds?: string[];
  userIds?: string[];
}

export const CouponForm = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<ICoupon>({
    redirect: "list",
  });

  const { id } = useParams();
  const isEditing = !!id;

  const { selectProps: productSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "users",
    optionLabel: "email",
    optionValue: "id",
  });

  const disabledDate: RangePickerProps["disabledDate"] = current => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <>
      {isEditing ? (
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <CouponFormFields
            formProps={formProps}
            productSelectProps={productSelectProps}
            userSelectProps={userSelectProps}
            disabledDate={disabledDate}
          />
        </Edit>
      ) : (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <CouponFormFields
            formProps={formProps}
            productSelectProps={productSelectProps}
            userSelectProps={userSelectProps}
            disabledDate={disabledDate}
          />
        </Create>
      )}
    </>
  );
};

interface CouponFormFieldsProps {
  formProps: FormProps;
  productSelectProps: any;
  userSelectProps: any;
  disabledDate: RangePickerProps["disabledDate"];
}

const CouponFormFields: React.FC<CouponFormFieldsProps> = ({
  formProps,
  productSelectProps,
  userSelectProps,
  disabledDate,
}) => {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Code"
        name="code"
        rules={[
          { required: true },
          { min: 3, message: "Code must be at least 3 characters" },
          { max: 50, message: "Code must be at most 50 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      <Space size="large">
        <Form.Item label="Discount Type" name="discountType" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Fixed Amount", value: "FIXED" },
              { label: "Percentage", value: "PERCENTAGE" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Discount Value" name="discountValue" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            max={formProps.getFieldValue("discountType") === "PERCENTAGE" ? 100 : undefined}
          />
        </Form.Item>

        <Form.Item label="Usage Limit" name="usageLimit">
          <InputNumber min={1} />
        </Form.Item>
      </Space>

      <Space size="large">
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true }]}
          getValueProps={value => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true }]}
          getValueProps={value => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Space>

      <Form.Item label="Assign to Products" name="productIds">
        <Select {...productSelectProps} mode="multiple" placeholder="Select products" />
      </Form.Item>

      <Form.Item label="Assign to Users" name="userIds">
        <Select {...userSelectProps} mode="multiple" placeholder="Select users" />
      </Form.Item>
    </Form>
  );
};
