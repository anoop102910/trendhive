import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Image,
  Input,
  Select,
  Pagination,
  Space,
  Tag,
  Empty,
  Spin,
} from "antd";
import { useList } from "@refinedev/core";
import {
  InboxOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FileImageOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { IResourceComponentsProps } from "@refinedev/core";

const { Option } = Select;

interface Media {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  multiple?: boolean;
}

export const MediaModal: React.FC<MediaModalProps & IResourceComponentsProps> = ({
  visible,
  onClose,
  onSelect,
  multiple = false,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filters, setFilters] = useState({ filename: "", mimetype: "" });
  const [sorter, setSorter] = useState({ field: "createdAt", order: "desc" });

  const { data, isLoading } = useList<Media>({
    resource: "media",
    pagination: {
      current: currentPage,
      pageSize: pageSize,
    },
    filters: [
      {
        field: "filename",
        operator: "contains",
        value: filters.filename,
      },
      {
        field: "mimetype",
        operator: "contains",
        value: filters.mimetype,
      },
    ],
    sorters: [
      {
        field: sorter.field,
        order: sorter.order,
      },
    ],
  });

  const mediaList = data?.data || [];
  const total = data?.total || 0;

  useEffect(() => {
    if (!visible) {
      setSelectedMedia([]);
      setFilters({ filename: "", mimetype: "" });
      setSorter({ field: "createdAt", order: "desc" });
      setCurrentPage(1);
    }
  }, [visible]);

  const handleSelect = (media: Media) => {
    if (multiple) {
      setSelectedMedia(prev => {
        if (prev.some(m => m.id === media.id)) {
          return prev.filter(m => m.id !== media.id);
        }
        return [...prev, media];
      });
    } else {
      setSelectedMedia([media]);
    }
  };

  const handleOk = () => {
    onSelect(multiple ? selectedMedia : selectedMedia[0]);
    onClose();
  };

  const isSelected = (media: Media) => selectedMedia.some(m => m.id === media.id);

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <FileImageOutlined style={{ marginRight: 8 }} />
          Media Library
        </div>
      }
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          disabled={selectedMedia.length === 0}
        >
          Select ({selectedMedia.length})
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={10}>
              <Input
                placeholder="Search by filename"
                prefix={<SearchOutlined />}
                value={filters.filename}
                onChange={e => setFilters(prev => ({ ...prev, filename: e.target.value }))}
              />
            </Col>
            <Col span={7}>
              <Select
                placeholder="Filter by MIME type"
                style={{ width: "100%" }}
                value={filters.mimetype}
                onChange={value => setFilters(prev => ({ ...prev, mimetype: value }))}
              >
                <Option value="">All MIME types</Option>
                <Option value="image">Images</Option>
                <Option value="video">Videos</Option>
                <Option value="application">Documents</Option>
              </Select>
            </Col>
            <Col span={7}>
              <Select
                placeholder="Sort by"
                style={{ width: "100%" }}
                value={sorter.field + (sorter.order === "asc" ? "_asc" : "_desc")}
                onChange={value => {
                  const [field, order] = value.split("_");
                  setSorter({ field, order });
                }}
              >
                <Option value="createdAt_desc">
                  <SortDescendingOutlined /> Date Created (Newest)
                </Option>
                <Option value="createdAt_asc">
                  <SortAscendingOutlined /> Date Created (Oldest)
                </Option>
                <Option value="updatedAt_desc">
                  <SortDescendingOutlined /> Date Modified (Newest)
                </Option>
                <Option value="updatedAt_asc">
                  <SortAscendingOutlined /> Date Modified (Oldest)
                </Option>
                <Option value="filename_asc">
                  <SortAscendingOutlined /> Filename (A-Z)
                </Option>
                <Option value="filename_desc">
                  <SortDescendingOutlined /> Filename (Z-A)
                </Option>
                <Option value="size_desc">
                  <SortDescendingOutlined /> Size (Largest)
                </Option>
                <Option value="size_asc">
                  <SortAscendingOutlined /> Size (Smallest)
                </Option>
              </Select>
            </Col>
          </Row>
        </Space>
      </div>
      <Divider style={{ margin: "16px 0" }} />
      <Spin spinning={isLoading}>
        {mediaList.length > 0 ? (
          <Row gutter={[16, 16]}>
            {mediaList.map(media => (
              <Col key={media.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => handleSelect(media)}
                  bodyStyle={{ padding: 0 }}
                  style={{
                    border: isSelected(media) ? "2px solid #1890ff" : "1px solid #f0f0f0",
                    position: "relative",
                  }}
                  cover={
                    <Image
                      alt={media.filename}
                      src={media.url}
                      preview={false}
                      style={{ height: 150, objectFit: "cover" }}
                    />
                  }
                >
                  <div style={{ padding: 8 }}>
                    <p
                      style={{
                        margin: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {media.filename}
                    </p>
                    {isSelected(media) && (
                      <Tag color="blue" style={{ position: "absolute", top: 8, right: 8 }}>
                        Selected
                      </Tag>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty
            image={<InboxOutlined />}
            description="No media found. Try adjusting your filters."
          />
        )}
      </Spin>
      <Divider style={{ margin: "16px 0" }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
        />
      </div>
    </Modal>
  );
};
