import React, { useState } from 'react';
import { Modal, Upload, Button, Table, Typography, Space, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import Papa from 'papaparse';
import { CreateProductZodSchema } from '../zod/product';
import { useApiUrl, useCustomMutation } from '@refinedev/core';

const { Title, Link } = Typography;

interface ProductImportProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const ProductImport: React.FC<ProductImportProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const apiUrl = useApiUrl();
  const { mutate, isLoading } = useCustomMutation();

  const handleUpload = (file: UploadFile) => {
    setFileList([file]);
    setErrors([]);
    setData([]);

    Papa.parse(file as any, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationErrors = [];
        const validatedData = [];
        results.data.forEach((row, index) => {
          const result = CreateProductZodSchema.safeParse(row);
          if (result.success) {
            validatedData.push(result.data);
          } else {
            validationErrors.push({
              row: index + 2,
              errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
            });
          }
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          setData(validatedData);
        }
      },
    });

    return false; // Prevent automatic upload
  };

  const handleImport = () => {
    mutate(
      {
        url: `${apiUrl}/products/batch`,
        method: 'post',
        values: { products: data },
      },
      {
        onSuccess: (response: any) => {
            if (response.data.errors && response.data.errors.length > 0) {
                setErrors(response.data.errors);
                notification.error({
                    message: 'Import Failed',
                    description: 'Some products could not be imported. Please check the errors below.',
                });
            } else {
                notification.success({
                    message: 'Import Successful',
                    description: `${response.data.createdCount} products have been imported successfully.`,
                });
                onSuccess();
            }
        },
        onError: (error) => {
          notification.error({
            message: 'Import Failed',
            description: error.message,
          });
        },
      },
    );
  };

  const errorColumns = [
    {
      title: 'Row',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
    },
  ];

  return (
    <Modal
      title="Import Products"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleImport}
          disabled={fileList.length === 0 || errors.length > 0 || data.length === 0}
          loading={isLoading}
        >
          Import
        </Button>,
      ]}
      width={800}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5}>
          Download a sample CSV file to see the expected format.
        </Title>
        <Link href="/sample-products.csv" download>
          Download Sample CSV
        </Link>

        <Upload
          beforeUpload={handleUpload}
          fileList={fileList}
          maxCount={1}
          accept=".csv"
          onRemove={() => {
            setFileList([]);
            setData([]);
            setErrors([]);
          }}
        >
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>

        {errors.length > 0 && (
          <div>
            <Title level={5}>Validation Errors</Title>
            <Table
              dataSource={errors}
              columns={errorColumns}
              rowKey="row"
              pagination={false}
            />
          </div>
        )}

        {data.length > 0 && errors.length === 0 && (
            <div>
                <Title level={5}>Data to be Imported</Title>
                <Table
                    dataSource={data}
                    columns={Object.keys(data[0] || {}).map(key => ({ title: key, dataIndex: key, key }))}
                    rowKey="slug"
                    pagination={{ pageSize: 5 }}
                />
            </div>
        )}
      </Space>
    </Modal>
  );
};
