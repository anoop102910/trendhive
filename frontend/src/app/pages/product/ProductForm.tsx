import { Edit, Create, useForm } from "@refinedev/antd";
import { useList, useSelect, type IResourceComponentsProps } from "@refinedev/core";
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
  Image,
  Flex,
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
  UploadOutlined,
} from "@ant-design/icons";
import type { FormProps, FormListFieldData, FormInstance } from "antd/lib/form";
import { useState } from "react";
import { UploadModal } from "../../../components/MediaModal";

interface ICategory {
  id: string;
  name: string;
}

interface IAttributeValue {
  id: string;
  value: string;
}

interface IAttribute {
  id: string;
  name: string;
  values: IAttributeValue[];
}

interface IProductAttribute {
  id: string;
  value: string;
}

interface IProductImage {
  url: string;
}

interface IMetadata {
  key: string;
  value: string;
}

interface IProduct {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  quantity: number;
  sku?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  isFeatured: boolean;
  categoryId: string;
  mainImage: string;
  images?: IProductImage[];
  attributes?: IProductAttribute[];
  metadata?: IMetadata[];
  private_metadata?: IMetadata[];
}

type AttributeFieldsProps = {
  field: FormListFieldData;
  form: FormInstance;
  attributeOptions: IAttribute[];
  remove: (index: number) => void;
};

const AttributeFields = ({ field, form, attributeOptions, remove }: AttributeFieldsProps) => {
  const selectedAttributeId = form.getFieldValue(["attributes", field.name, "id"]);
  const selectedAttribute = attributeOptions?.find(attr => attr.id === selectedAttributeId);
  const attributeValues = selectedAttribute ? selectedAttribute.values : [];

  return (
    <Row gutter={16} key={field.key} style={{ alignItems: "center" }}>
      <Col span={11}>
        <Form.Item
          {...field}
          name={[field.name, "id"]}
          rules={[{ required: true, message: "Missing attribute name" }]}
        >
          <Select
            size="large"
            placeholder="Select attribute"
            options={attributeOptions?.map(item => ({
              label: item.name,
              value: item.id,
            }))}
            onChange={() =>
              form.setFieldsValue({
                attributes: {
                  [field.name]: {
                    ...form.getFieldValue(["attributes", field.name]),
                    value: undefined,
                  },
                },
              })
            }
          />
        </Form.Item>
      </Col>
      <Col span={11}>
        <Form.Item
          {...field}
          name={[field.name, "value"]}
          rules={[{ required: true, message: "Missing attribute value" }]}
        >
          <Select
            size="large"
            placeholder="Select value"
            options={attributeValues.map(item => ({
              label: item.value,
              value: item.id,
            }))}
            disabled={!selectedAttributeId}
          />
        </Form.Item>
      </Col>
      <Col span={2}>
        <MinusCircleOutlined onClick={() => remove(field.name)} />
      </Col>
    </Row>
  );
};

type ProductFormProps = {
  formProps: FormProps<IProduct>;
};

export const ProductForm = ({ formProps }: ProductFormProps) => {
  const [form] = Form.useForm<IProduct>();
  const { options } = useSelect<ICategory>({
    resource: "categories",
    defaultValue: [],
    optionLabel: "name",
    optionValue: "id",
    pagination: {
      pageSize: 20,
    },
  });

  const { data: attributesData } = useList<IAttribute>({
    resource: "attributes",
    pagination: {
      pageSize: 20,
    },
  });

  const [isMediaModalOpen, setIsMediaModalOpen] = useState<boolean>(false);
  const [modalFor, setModalFor] = useState<"mainImage" | "subImages" | null>(null);

  const handleMediaSelect = (media: IProductImage[]) => {
    if (modalFor === "mainImage") {
      form.setFieldsValue({ mainImage: media[0].url });
    } else if (modalFor === "subImages") {
      const currentSubImages = form.getFieldValue("images") || [];
      const newSubImages = media.map(item => ({ url: item.url }));
      form.setFieldsValue({ images: [...currentSubImages, ...newSubImages] });
    }
  };

  const openMediaModal = (field: "mainImage" | "subImages") => {
    setModalFor(field);
    setIsMediaModalOpen(true);
  };

  const attributeOptions = attributesData?.data || [];

  return (
    <>
      <Form form={form} {...formProps} layout="vertical">
        <Row gutter={24}>
          <Col span={16}>
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
                    <Input
                      size="large"
                      placeholder="Enter product slug"
                      prefix={<LinkOutlined />}
                    />
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
            </Card>

            <Card
              title="Attributes"
              style={{ marginBottom: 16 }}
              headStyle={{ borderBottom: 0 }}
              extra={<SnippetsOutlined />}
            >
              <Form.List name="attributes">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" style={{ display: "flex" }}>
                    {fields.map(field => (
                      <AttributeFields
                        key={field.key}
                        field={field}
                        form={form}
                        attributeOptions={attributeOptions}
                        remove={remove}
                      />
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add Attribute
                      </Button>
                    </Form.Item>
                  </Space>
                )}
              </Form.List>
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
          </Col>
          <Col span={8}>
            <Card
              title="Status"
              style={{ marginBottom: 16 }}
              headStyle={{ borderBottom: 0 }}
              extra={<SettingOutlined />}
            >
              <Form.Item
                label="Status"
                name="isPublished"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Published" unCheckedChildren="Draft" />
              </Form.Item>
              <Form.Item
                label="Featured"
                name="isFeatured"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Featured" unCheckedChildren="Not Featured" />
              </Form.Item>
            </Card>
            <Card
              title="Media"
              style={{ marginBottom: 16 }}
              headStyle={{ borderBottom: 0 }}
              extra={<UploadOutlined />}
            >
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
              <Divider />
              <Form.Item
                label="Main Image"
                name="mainImage"
                rules={[
                  {
                    required: true,
                    message: "Please select a main image",
                  },
                ]}
              >
                <Flex
                  justify="center"
                  align="center"
                  style={{
                    width: "100%",
                    height: 200,
                    border: "1px dashed #d9d9d9",
                    borderRadius: 8,
                    cursor: "pointer",
                    backgroundColor: "#f0f2f5",
                  }}
                  onClick={() => openMediaModal("mainImage")}
                >
                  <Space direction="vertical" align="center">
                    <UploadOutlined style={{ fontSize: 24, color: "#999" }} />
                    <div style={{ color: "#999" }}>Select Main Image</div>
                  </Space>
                </Flex>
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.mainImage !== curr.mainImage}>
                {() => {
                  const mainImageUrl = form.getFieldValue("mainImage");
                  return mainImageUrl ? (
                    <div style={{ position: "relative" }}>
                      <Image
                        src={mainImageUrl}
                        alt="Main"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                      <Button
                        type="primary"
                        danger
                        style={{ position: "absolute", top: 10, right: 10 }}
                        onClick={() => form.setFieldsValue({ mainImage: undefined })}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : null;
                }}
              </Form.Item>
              <Divider />
              <h4 style={{ marginBottom: 16 }}>Sub Images</h4>
              <Form.List name="images">
                {(fields, { add, remove }) => (
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <Flex wrap justify="start" gutter={[16, 16]}>
                      {fields.map(({ key, name }) => (
                        <div
                          key={key}
                          style={{
                            position: "relative",
                            width: 100,
                            height: 100,
                            border: "1px solid #d9d9d9",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={form.getFieldValue(["images", name, "url"])}
                            alt="Sub"
                            width={100}
                            height={100}
                            style={{ objectFit: "cover" }}
                          />
                          <Button
                            type="primary"
                            danger
                            icon={<MinusCircleOutlined />}
                            size="small"
                            onClick={() => remove(name)}
                            style={{ position: "absolute", top: 2, right: 2 }}
                          />
                        </div>
                      ))}
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          border: "1px dashed #d9d9d9",
                          borderRadius: 8,
                          cursor: "pointer",
                          backgroundColor: "#f0f2f5",
                        }}
                        onClick={() => openMediaModal("subImages")}
                      >
                        <Flex
                          justify="center"
                          align="center"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <PlusOutlined style={{ fontSize: 24, color: "#999" }} />
                        </Flex>
                      </div>
                    </Flex>
                  </Space>
                )}
              </Form.List>
            </Card>
          </Col>
        </Row>
      </Form>
      <UploadModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </>
  );
};

export const ProductCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps } = useForm<IProduct>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Create>
  );
};

export const ProductEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<IProduct>();

  if (queryResult?.isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <ProductForm formProps={formProps} />
    </Edit>
  );
};
