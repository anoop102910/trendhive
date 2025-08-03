import { Edit, Create, useForm, useSelect } from "@refinedev/antd";
import type { IResourceComponentsProps } from "@refinedev/core";
import { Form, Input, Card, Row, Col, Space, Button, Divider, Select, Upload } from "antd";
import type { FormProps } from "antd";
import { LoadingComponent } from "../../../components/Loading";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  SnippetsOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";

type CollectionFormProps = {
  formProps: FormProps;
};

export const CollectionForm = ({ formProps }: CollectionFormProps) => {
  const { selectProps: productSelectProps } = useSelect({
    resource: "products",
    optionLabel: "name",
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
                  message: "Collection name must be at least 3 characters",
                },
                {
                  max: 250,
                  message: "Collection name must be at most 250 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter collection name"
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
                  message: "Collection slug must be at least 3 characters",
                },
                {
                  max: 255,
                  message: "Collection slug must be at most 255 characters",
                },
              ]}
            >
              <Input size="large" placeholder="Enter collection slug" prefix={<LinkOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Description" name="description">
          <Input.TextArea size="large" placeholder="Enter collection description" rows={4} />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Background Image"
              name="backgroundImage"
              rules={[
                {
                  max: 100,
                  message: "Background image URL must be at most 100 characters",
                },
              ]}
            >
              <Upload>
                <Button icon={<UploadOutlined />}>Upload Background Image</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Background Image Alt Text"
              name="backgroundImageAlt"
              rules={[
                {
                  max: 128,
                  message: "Background image alt text must be at most 128 characters",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter alt text for background image"
                prefix={<InfoCircleOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Products" name="productIds">
          <Select
            {...productSelectProps}
            mode="multiple"
            size="large"
            placeholder="Select products"
            style={{ width: "100%" }}
          />
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
        <Form.List name="privateMetadata">
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

export const CollectionCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <CollectionForm formProps={formProps} />
    </Create>
  );
};

export const CollectionEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  if (queryResult?.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <CollectionForm formProps={formProps} />
    </Edit>
  );
};
