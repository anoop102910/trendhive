import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  Space,
  Image,
  message,
  Radio,
  Card,
  Row,
  Col,
  Table,
  Checkbox,
} from "antd";
import { useList, useCreate } from "@refinedev/core";
import { UploadOutlined } from "@ant-design/icons";

export const UploadModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect?: (media: any) => void;
}> = ({ open, onClose, onSelect }) => {
  const [filenameFilter, setFilenameFilter] = useState("");
  const [mimetypeFilter, setMimetypeFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState<number | undefined>();
  const [sorter, setSorter] = useState<{ field?: string; order?: string }>({});
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "table">("gallery");
  const [selectedMedia, setSelectedMedia] = useState<any[]>([]);

  const { data, isLoading, refetch } = useList({
    resource: "media",
    filters: [
      ...(filenameFilter
        ? [{ field: "filename", operator: "contains", value: filenameFilter }]
        : []),
      ...(mimetypeFilter
        ? [{ field: "mimetype", operator: "contains", value: mimetypeFilter }]
        : []),
      ...(sizeFilter ? [{ field: "size", operator: "eq", value: sizeFilter }] : []),
    ],
    sorters: sorter.field ? [{ field: sorter.field, order: sorter.order as "asc" | "desc" }] : [],
    pagination: { current: 1, pageSize: 20 },
  });

  const { mutate: createMedia } = useCreate();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const presign = await fetch("/api/media/presigned-url").then(res => res.json());

      await fetch(presign.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      createMedia({
        resource: "media",
        values: {
          filename: file.name,
          mimetype: file.type,
          size: file.size,
          url: presign.url.split("?")[0],
        },
        successNotification: () => ({
          message: "Upload successful",
          type: "success",
        }),
      });

      refetch();
    } catch (error) {
      message.error("Upload failed");
    }
    setUploading(false);
    return false;
  };

  const mediaList = data?.data || [];

  const handleSelect = (item: any) => {
    setSelectedMedia(prev => {
      const isSelected = prev.some(media => media.id === item.id);
      if (isSelected) {
        return prev.filter(media => media.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleConfirmSelect = () => {
    if (onSelect) {
      onSelect(selectedMedia);
      onClose();
    }
  };

  return (
    <Modal
      title="Media Library"
      open={open}
      onCancel={onClose}
      footer={
        onSelect && (
          <Button
            type="primary"
            onClick={handleConfirmSelect}
            disabled={selectedMedia.length === 0}
          >
            Select ({selectedMedia.length})
          </Button>
        )
      }
      width={1000}
    >
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Filename"
          value={filenameFilter}
          onChange={e => setFilenameFilter(e.target.value)}
          allowClear
        />
        <Input
          placeholder="Mimetype"
          value={mimetypeFilter}
          onChange={e => setMimetypeFilter(e.target.value)}
          allowClear
        />
        <Input
          placeholder="Size (bytes)"
          type="number"
          value={sizeFilter}
          onChange={e => setSizeFilter(e.target.value ? Number(e.target.value) : undefined)}
          allowClear
        />
        <Button type="primary" onClick={() => refetch()}>
          Apply
        </Button>
        <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
          <Radio.Button value="gallery">Gallery</Radio.Button>
          <Radio.Button value="table">Table</Radio.Button>
        </Radio.Group>
      </Space>

      <Upload beforeUpload={handleUpload} showUploadList={false} disabled={uploading}>
        <Button icon={<UploadOutlined />} loading={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </Upload>

      <div style={{ marginTop: 16 }}>
        {viewMode === "gallery" ? (
          <Row gutter={[16, 16]}>
            {mediaList.map(item => (
              <Col xs={12} sm={8} md={6} lg={4} key={item.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ position: "relative" }}>
                      <Image
                        src={item.url}
                        alt={item.filename}
                        style={{
                          height: 150,
                          objectFit: "cover",
                        }}
                      />
                      {onSelect && (
                        <Checkbox
                          style={{ position: "absolute", top: 8, right: 8 }}
                          checked={selectedMedia.some(media => media.id === item.id)}
                          onChange={() => handleSelect(item)}
                        />
                      )}
                    </div>
                  }
                >
                  <Card.Meta
                    title={item.filename}
                    description={`${(item.size / 1024).toFixed(1)} KB`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table
            rowKey="id"
            loading={isLoading}
            dataSource={mediaList}
            pagination={false}
            onChange={(pagination, filters, sorter) => {
              if (!Array.isArray(sorter)) {
                setSorter({
                  field: sorter.field as string,
                  order: sorter.order || undefined,
                });
              }
            }}
            columns={[
              ...(onSelect
                ? [
                    {
                      title: "Select",
                      dataIndex: "id",
                      render: (id, record) => (
                        <Checkbox
                          checked={selectedMedia.some(media => media.id === record.id)}
                          onChange={() => handleSelect(record)}
                        />
                      ),
                    },
                  ]
                : []),
              {
                title: "Preview",
                dataIndex: "url",
                render: url => <Image src={url} alt="preview" width={60} height={60} />,
              },
              { title: "Filename", dataIndex: "filename" },
              { title: "Mimetype", dataIndex: "mimetype" },
              {
                title: "Size (KB)",
                dataIndex: "size",
                render: size => (size / 1024).toFixed(1),
              },
              { title: "Created At", dataIndex: "createdAt" },
            ]}
          />
        )}
      </div>
    </Modal>
  );
};
