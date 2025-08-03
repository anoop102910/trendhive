import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space, Typography, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

const { Option } = Select;
const { Text } = Typography;

interface UserDataType {
  key: string;
  username: string;
  email: string;
  totalOrders: number;
  lastLogin: string;
  status: 'active' | 'inactive' | 'pending';
}

const userData: UserDataType[] = [
  {
    key: '1',
    username: 'john_doe',
    email: 'john.doe@example.com',
    totalOrders: 15,
    lastLogin: '2025-06-14',
    status: 'active',
  },
  {
    key: '2',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    totalOrders: 8,
    lastLogin: '2025-06-13',
    status: 'inactive',
  },
  {
    key: '3',
    username: 'peter_jones',
    email: 'peter.jones@example.com',
    totalOrders: 22,
    lastLogin: '2025-06-12',
    status: 'active',
  },
  {
    key: '4',
    username: 'alice_williams',
    email: 'alice.williams@example.com',
    totalOrders: 5,
    lastLogin: '2025-06-11',
    status: 'pending',
  },
  {
    key: '5',
    username: 'bob_brown',
    email: 'bob.brown@example.com',
    totalOrders: 30,
    lastLogin: '2025-06-10',
    status: 'active',
  },
  {
    key: '6',
    username: 'charlie_davis',
    email: 'charlie.davis@example.com',
    totalOrders: 12,
    lastLogin: '2025-06-09',
    status: 'active',
  },
  {
    key: '7',
    username: 'diana_miller',
    email: 'diana.miller@example.com',
    totalOrders: 18,
    lastLogin: '2025-06-08',
    status: 'inactive',
  },
];

type DataIndex = keyof UserDataType;

const UserTable: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [minOrders, setMinOrders] = useState<string | null>(null);
  const [maxOrders, setMaxOrders] = useState<string | null>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<UserDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnType<UserDataType>[] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      ...getColumnSearchProps('username'),
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      sorter: (a, b) => a.totalOrders - b.totalOrders,
      sortDirections: ['ascend', 'descend'],
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Min Orders"
            value={minOrders}
            onChange={(e) => {
              const value = e.target.value;
              setMinOrders(value);
              setSelectedKeys(value ? [value, maxOrders] : [null, maxOrders] as any);
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            type="number"
          />
          <Input
            placeholder="Max Orders"
            value={maxOrders}
            onChange={(e) => {
              const value = e.target.value;
              setMaxOrders(value);
              setSelectedKeys(value ? [minOrders, value] : [minOrders, null] as any);
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            type="number"
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setMinOrders(null);
                setMaxOrders(null);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        const numValue = record.totalOrders;
        const [min, max] = value as [string | null, string | null]; // Cast value to a tuple of strings or nulls
        const parsedMin = min !== null ? parseFloat(min) : null;
        const parsedMax = max !== null ? parseFloat(max) : null;

        if (parsedMin !== null && parsedMax !== null) {
          return numValue >= parsedMin && numValue <= parsedMax;
        }
        if (parsedMin !== null) {
          return numValue >= parsedMin;
        }
        if (parsedMax !== null) {
          return numValue <= parsedMax;
        }
        return true;
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: UserDataType['status']) => {
        let color = '';
        if (status === 'active') {
          color = 'green';
        } else if (status === 'inactive') {
          color = 'red';
        } else if (status === 'pending') {
          color = 'orange';
        }
        return <Text style={{ color }}>{status.toUpperCase()}</Text>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Edit {record.username}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={userData} />;
};

export default UserTable;