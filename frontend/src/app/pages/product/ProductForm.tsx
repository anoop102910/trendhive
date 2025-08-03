import { Edit, Create, useForm } from "@refinedev/antd";
import { useSelect, type IResourceComponentsProps } from "@refinedev/core";
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Card,
  Row,
  Col,
  Space,
  Button,
  Divider,
} from "antd";
import { LoadingComponent } from "../../../components/Loading";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  SnippetsOutlined,
  SettingOutlined,
  DollarOutlined,
  NumberOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { FormProps } from "antd/lib";

type ProductFormProps = {
  formProps: FormProps;
};

export const ProductForm = ({ formProps }: ProductFormProps) => {
  const { options } = useSelect({
    resource: "categories",
    defaultValue: [],
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: 20,
    },
  });
  return (
    <Form {...formProps} layout="vertical">
      <Card
        title="General"
        style={{ marginBottom: 16 }}
        headStyle={{ borderBottom: 0 }}
        extra={<InfoCircleOutlined />}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter a name.",
                },
                {
                  min: 3,
                  message: "Product name must be at least 3 characters",
                },
                {
                  max: 255,
                  message: "Product name must be at most 255 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter product name"
                prefix={<InfoCircleOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Slug"
              name="slug"
              rules={[
                {
                  required: true,
                  message: "Please enter a slug.",
                },
                {
                  min: 3,
                  message: "Product slug must be at least 3 characters",
                },
                {
                  max: 255,
                  message: "Product slug must be at most 255 characters",
                },
              ]}
            >
              <Input size="large" placeholder="Enter product slug" prefix={<LinkOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description">
          <Input.TextArea size="large" placeholder="Enter product description" rows={4} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please enter the price.",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Price must be a positive number",
                },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                placeholder="Enter price"
                prefix={<DollarOutlined />}
                formatter={value => `₹ ${value}`}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Please enter the quantity.",
                },
                {
                  type: "number",
                  min: 0,
                  message: "Quantity must be a positive number",
                },
              ]}
            >
              <InputNumber
                size="large"
                style={{ width: "100%" }}
                placeholder="Enter quantity"
                prefix={<NumberOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="SKU"
              name="sku"
              rules={[
                {
                  max: 255,
                  message: "SKU must be at most 255 characters",
                },
              ]}
            >
              <Input size="large" placeholder="Enter SKU" prefix={<TagOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="isPublished"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Published" unCheckedChildren="Draft" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Featured"
              name="isFeatured"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Featured" unCheckedChildren="Not Featured" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Please select a category",
            },
          ]}
        >
          <Select
            size="large"
            placeholder="Select a category"
            showSearch
            optionFilterProp="children"
            options={options}
          />
        </Form.Item>
      </Card>

      <Card
        title="SEO"
        style={{ marginBottom: 16 }}
        headStyle={{ borderBottom: 0 }}
        extra={<SettingOutlined />}
      >
        <Form.Item
          label="SEO Title"
          name="seoTitle"
          rules={[
            {
              min: 3,
              message: "SEO title must be at least 3 characters",
            },
            {
              max: 60,
              message: "SEO title must be at most 60 characters",
            },
          ]}
        >
          <Input size="large" placeholder="Enter SEO title" prefix={<InfoCircleOutlined />} />
        </Form.Item>
        <Form.Item
          label="SEO Description"
          name="seoDescription"
          rules={[
            {
              min: 10,
              message: "SEO description must be at least 10 characters",
            },
            {
              max: 160,
              message: "SEO description must be at most 160 characters",
            },
          ]}
        >
          <Input.TextArea size="large" placeholder="Enter SEO description" rows={4} />
        </Form.Item>
      </Card>

      <Card
        title="Metadata"
        style={{ marginBottom: 16 }}
        headStyle={{ borderBottom: 0 }}
        extra={<SnippetsOutlined />}
      >
        <h4 style={{ marginBottom: 16 }}>Public Metadata</h4>
        <Form.List name="metadata">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ display: "flex" }}>
              {fields.map(field => (
                <Row gutter={16} key={field.key} style={{ alignItems: "center" }}>
                  <Col span={11}>
                    <Form.Item
                      {...field}
                      name={[field.name, "key"]}
                      rules={[
                        { required: true, message: "Missing key" },
                        {
                          min: 1,
                          message: "Metadata key must be at least 1 character",
                        },
                        {
                          max: 255,
                          message: "Metadata key must be at most 255 characters",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Key" prefix={<InfoCircleOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      {...field}
                      name={[field.name, "value"]}
                      rules={[
                        { required: true, message: "Missing value" },
                        {
                          min: 1,
                          message: "Metadata value must be at least 1 character",
                        },
                        {
                          max: 255,
                          message: "Metadata value must be at most 255 characters",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Value" prefix={<SnippetsOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Public Metadata
                </Button>
              </Form.Item>
            </Space>
          )}
        </Form.List>

        <Divider />

        <h4 style={{ marginBottom: 16 }}>Private Metadata</h4>
        <Form.List name="private_metadata">
          {(fields, { add, remove }) => (
            <Space direction="vertical" style={{ display: "flex" }}>
              {fields.map(field => (
                <Row gutter={16} key={field.key} style={{ alignItems: "center" }}>
                  <Col span={11}>
                    <Form.Item
                      {...field}
                      name={[field.name, "key"]}
                      rules={[
                        { required: true, message: "Missing key" },
                        {
                          min: 1,
                          message: "Private metadata key must be at least 1 character",
                        },
                        {
                          max: 255,
                          message: "Private metadata key must be at most 255 characters",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Key" prefix={<InfoCircleOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      {...field}
                      name={[field.name, "value"]}
                      rules={[
                        { required: true, message: "Missing value" },
                        {
                          min: 1,
                          message: "Private metadata value must be at least 1 character",
                        },
                        {
                          max: 255,
                          message: "Private metadata value must be at most 255 characters",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Value" prefix={<SnippetsOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Private Metadata
                </Button>
              </Form.Item>
            </Space>
          )}
        </Form.List>
      </Card>
    </Form>
  );
};

export const ProductCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Create>
  );
};

export const ProductEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  if (queryResult?.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Edit>
  );
};
