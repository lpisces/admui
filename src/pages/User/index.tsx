import React, { useState } from 'react';
import { 
  Typography, 
  Table, 
  Button, 
  Space, 
  Input, 
  Modal, 
  Form, 
  Select, 
  message, 
  Tag, 
  Popconfirm, 
  Row, 
  Col,
  Badge 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ExclamationCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Title } = Typography;
const { Option } = Select;

interface UserData {
  key: string;
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'locked';
  role: string[];
  createTime: string;
}

// 模拟用户数据
const mockUsers: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  key: i.toString(),
  id: i + 1,
  name: `用户${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `1381234${i.toString().padStart(4, '0')}`,
  status: ['active', 'inactive', 'locked'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'locked',
  role: [
    ['admin', 'editor', 'viewer'][Math.floor(Math.random() * 3)],
    Math.random() > 0.7 ? ['admin', 'editor', 'viewer'][Math.floor(Math.random() * 3)] : ''
  ].filter(Boolean),
  createTime: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}));

const User: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const statusMap = {
    active: { text: '正常', color: 'success' },
    inactive: { text: '禁用', color: 'default' },
    locked: { text: '锁定', color: 'error' },
  };

  const roleMap = {
    admin: { text: '管理员', color: 'red' },
    editor: { text: '编辑者', color: 'blue' },
    viewer: { text: '访问者', color: 'green' },
  };

  const columns: ColumnsType<UserData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (text) => <a>{text}</a>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (text) => (
        <Space>
          <PhoneOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        { text: '正常', value: 'active' },
        { text: '禁用', value: 'inactive' },
        { text: '锁定', value: 'locked' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: 'active' | 'inactive' | 'locked') => (
        <Badge 
          status={statusMap[status].color as "success" | "default" | "error" | "warning" | "processing" | undefined} 
          text={statusMap[status].text} 
        />
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (roles: string[]) => (
        <>
          {roles.map(role => (
            <Tag color={roleMap[role as keyof typeof roleMap]?.color} key={role}>
              {roleMap[role as keyof typeof roleMap]?.text || role}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime.localeCompare(b.createTime),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setModalTitle('添加用户');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: UserData) => {
    setModalTitle('编辑用户');
    setCurrentUser(record);
    form.setFieldsValue({
      username: record.username,
      name: record.name,
      email: record.email,
      phone: record.phone,
      status: record.status,
      role: record.role,
    });
    setModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setUsers(users.filter(user => user.key !== key));
    message.success('删除成功');
  };

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }

    Modal.confirm({
      title: '确定要删除选中的用户吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setUsers(users.filter(user => !selectedRowKeys.includes(user.key)));
        setSelectedRowKeys([]);
        message.success(`成功删除${selectedRowKeys.length}个用户`);
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (currentUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.key === currentUser.key ? { ...user, ...values } : user
        ));
        message.success('编辑成功');
      } else {
        // 添加用户
        const newUser: UserData = {
          key: Date.now().toString(),
          id: Math.max(...users.map(u => u.id)) + 1,
          createTime: new Date().toISOString().split('T')[0],
          ...values,
        };
        setUsers([newUser, ...users]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredUsers = users.filter(user => 
    user.username.includes(searchText) ||
    user.name.includes(searchText) ||
    user.email.includes(searchText) ||
    user.phone.includes(searchText)
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="user-container">
      <Title level={2}>用户管理</Title>
      
      <div className="user-header">
        <Row justify="space-between" align="middle" className="toolbar">
          <Col>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                添加用户
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete} disabled={selectedRowKeys.length === 0}>
                批量删除
              </Button>
            </Space>
          </Col>
          <Col>
            <Input 
              placeholder="搜索用户" 
              prefix={<SearchOutlined />} 
              onChange={e => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </div>
      
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredUsers}
        rowKey="key"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        className="user-table"
        scroll={{ x: 1200 }}
      />
      
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="active"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">禁用</Option>
                  <Option value="locked">锁定</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select mode="multiple" placeholder="请选择角色">
                  <Option value="admin">管理员</Option>
                  <Option value="editor">编辑者</Option>
                  <Option value="viewer">访问者</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default User; 