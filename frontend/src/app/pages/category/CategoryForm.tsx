import { Edit, Create, useForm } from "@refinedev/antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, type FormProps, Card, Row, Col, Space, Button, Divider } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  SnippetsOutlined,
  SettingOutlined,
} from "@ant-design/icons";

type CategoryFormProps = {
  formProps: FormProps;
};

export const CategoryForm = ({ formProps }: CategoryFormProps) => {
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
                  message: "Category name must be at least 3 characters",
                },
                {
                  max: 50,
                  message: "Category name must be at most 50 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter category name"
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
                  message: "Category slug must be at least 3 characters",
                },
                {
                  max: 50,
                  message: "Category slug must be at most 50 characters",
                },
              ]}
            >
              <Input size="large" placeholder="Enter category slug" prefix={<LinkOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Description" name="description">
          <Input.TextArea size="large" placeholder="Enter category description" rows={4} />
        </Form.Item>
      </Card>

      <Card
        title="SEO"
        style={{ marginBottom: 16 }}
        headStyle={{ borderBottom: 0 }}
        extra={<SettingOutlined />}
      >
        <Form.Item
          label="SEO Slug"
          name="seoSlug"
          rules={[
            {
              min: 3,
              message: "SEO slug must be at least 3 characters",
            },
            {
              max: 60,
              message: "SEO slug must be at most 60 characters",
            },
          ]}
        >
          <Input size="large" placeholder="Enter SEO slug" prefix={<LinkOutlined />} />
        </Form.Item>
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

export const CategoryCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <CategoryForm formProps={formProps} />
    </Create>
  );
};

export const CategoryEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <CategoryForm formProps={formProps} />
    </Edit>
  );
};
