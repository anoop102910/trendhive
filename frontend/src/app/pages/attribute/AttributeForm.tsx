import { useForm, Create, Edit } from "@refinedev/antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button, Space } from "antd";
import { useParams } from "react-router-dom";
import type { FormListFieldData } from "antd/lib/form/FormList";

interface IAttribute {
  id: string;
  name: string;
  values: string[];
}

export const AttributeForm = () => {
  const { formProps, saveButtonProps, formLoading } = useForm<IAttribute>({
    redirect: "list",
  });

  const { id } = useParams();
  const isEditing = !!id;

  return (
    <>
      {isEditing ? (
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <AttributeFormFields formProps={formProps} />
        </Edit>
      ) : (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
          <AttributeFormFields formProps={formProps} />
        </Create>
      )}
    </>
  );
};

const AttributeFormFields = ({ formProps }: { formProps: any }) => {
  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true },
          { min: 2, message: "Name must be at least 2 characters" },
          { max: 50, message: "Name must be at most 50 characters" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.List
        name="values"
        rules={[
          {
            validator: async (_: any, values: string[]) => {
              if (!values || values.length < 1) {
                return Promise.reject(new Error("At least one value is required"));
              }
            },
          },
        ]}
      >
        {(
          fields: FormListFieldData[],
          { add, remove }: { add: () => void; remove: (index: number) => void },
          { errors }: { errors: React.ReactNode[] }
        ) => (
          <>
            {fields.map(({ key, name, ...restField }: FormListFieldData) => (
              <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={name}
                  rules={[
                    { required: true, message: "Value is required" },
                    { min: 1, message: "Value cannot be empty" },
                  ]}
                >
                  <Input placeholder="Enter attribute value" />
                </Form.Item>
                {fields.length > 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Value
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
