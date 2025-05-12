import React, { useState } from 'react';
import {
  Typography,
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Card,
  Row,
  Col,
  Checkbox,
  Tree,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  TeamOutlined,
  BarsOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import './index.less';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 角色数据接口
interface RoleData {
  key: string;
  id: number;
  name: string;
  description: string;
  usersCount: number;
  createTime: string;
}

// 权限数据接口
interface PermissionData {
  key: string;
  id: number;
  name: string;
  code: string;
  description: string;
  type: string;
  createTime: string;
}

// 模拟角色数据
const mockRoles: RoleData[] = [
  {
    key: '1',
    id: 1,
    name: '超级管理员',
    description: '系统最高权限，可以管理所有功能',
    usersCount: 3,
    createTime: '2023-01-01',
  },
  {
    key: '2',
    id: 2,
    name: '管理员',
    description: '系统管理权限，可以管理大部分功能',
    usersCount: 5,
    createTime: '2023-01-02',
  },
  {
    key: '3',
    id: 3,
    name: '普通用户',
    description: '基本操作权限，只能使用基本功能',
    usersCount: 42,
    createTime: '2023-01-03',
  },
  {
    key: '4',
    id: 4,
    name: '访客',
    description: '只读权限，只能查看不能修改',
    usersCount: 18,
    createTime: '2023-01-04',
  },
];

// 模拟权限数据
const mockPermissions: PermissionData[] = [
  {
    key: '1',
    id: 1,
    name: '用户管理',
    code: 'user:view',
    description: '查看用户列表',
    type: '菜单',
    createTime: '2023-01-01',
  },
  {
    key: '2',
    id: 2,
    name: '用户添加',
    code: 'user:add',
    description: '添加用户',
    type: '操作',
    createTime: '2023-01-01',
  },
  {
    key: '3',
    id: 3,
    name: '用户编辑',
    code: 'user:edit',
    description: '编辑用户',
    type: '操作',
    createTime: '2023-01-01',
  },
  {
    key: '4',
    id: 4,
    name: '用户删除',
    code: 'user:delete',
    description: '删除用户',
    type: '操作',
    createTime: '2023-01-01',
  },
  {
    key: '5',
    id: 5,
    name: '组织管理',
    code: 'org:view',
    description: '查看组织列表',
    type: '菜单',
    createTime: '2023-01-02',
  },
  {
    key: '6',
    id: 6,
    name: '组织添加',
    code: 'org:add',
    description: '添加组织',
    type: '操作',
    createTime: '2023-01-02',
  },
  {
    key: '7',
    id: 7,
    name: '组织编辑',
    code: 'org:edit',
    description: '编辑组织',
    type: '操作',
    createTime: '2023-01-02',
  },
  {
    key: '8',
    id: 8,
    name: '组织删除',
    code: 'org:delete',
    description: '删除组织',
    type: '操作',
    createTime: '2023-01-02',
  },
];

// 模拟权限树数据
const permissionTreeData: DataNode[] = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      {
        title: '用户管理',
        key: 'user',
        children: [
          {
            title: '查看用户列表',
            key: 'user:view',
          },
          {
            title: '添加用户',
            key: 'user:add',
          },
          {
            title: '编辑用户',
            key: 'user:edit',
          },
          {
            title: '删除用户',
            key: 'user:delete',
          },
        ],
      },
      {
        title: '角色管理',
        key: 'role',
        children: [
          {
            title: '查看角色列表',
            key: 'role:view',
          },
          {
            title: '添加角色',
            key: 'role:add',
          },
          {
            title: '编辑角色',
            key: 'role:edit',
          },
          {
            title: '删除角色',
            key: 'role:delete',
          },
          {
            title: '分配权限',
            key: 'role:assignPerm',
          },
        ],
      },
      {
        title: '权限管理',
        key: 'permission',
        children: [
          {
            title: '查看权限列表',
            key: 'permission:view',
          },
          {
            title: '添加权限',
            key: 'permission:add',
          },
          {
            title: '编辑权限',
            key: 'permission:edit',
          },
          {
            title: '删除权限',
            key: 'permission:delete',
          },
        ],
      },
    ],
  },
  {
    title: '业务管理',
    key: 'business',
    children: [
      {
        title: '组织管理',
        key: 'org',
        children: [
          {
            title: '查看组织列表',
            key: 'org:view',
          },
          {
            title: '添加组织',
            key: 'org:add',
          },
          {
            title: '编辑组织',
            key: 'org:edit',
          },
          {
            title: '删除组织',
            key: 'org:delete',
          },
        ],
      },
      {
        title: '文件管理',
        key: 'file',
        children: [
          {
            title: '查看文件列表',
            key: 'file:view',
          },
          {
            title: '上传文件',
            key: 'file:upload',
          },
          {
            title: '下载文件',
            key: 'file:download',
          },
          {
            title: '删除文件',
            key: 'file:delete',
          },
        ],
      },
    ],
  },
];

// 模拟角色权限数据
const rolePermissionMap: Record<string, string[]> = {
  '1': ['user:view', 'user:add', 'user:edit', 'user:delete', 'org:view', 'org:add', 'org:edit', 'org:delete', 'role:view', 'role:add', 'role:edit', 'role:delete', 'role:assignPerm', 'permission:view', 'permission:add', 'permission:edit', 'permission:delete', 'file:view', 'file:upload', 'file:download', 'file:delete'],
  '2': ['user:view', 'user:add', 'user:edit', 'org:view', 'org:add', 'org:edit', 'role:view', 'file:view', 'file:upload', 'file:download'],
  '3': ['user:view', 'org:view', 'file:view', 'file:download'],
  '4': ['user:view', 'org:view', 'file:view'],
};

const Permission: React.FC = () => {
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [rolePermModalVisible, setRolePermModalVisible] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>(mockRoles);
  const [permissions, setPermissions] = useState<PermissionData[]>(mockPermissions);
  const [modalTitle, setModalTitle] = useState('');
  const [currentRole, setCurrentRole] = useState<RoleData | null>(null);
  const [currentPermission, setCurrentPermission] = useState<PermissionData | null>(null);
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);
  const [roleId, setRoleId] = useState<string>('');
  const [roleForm] = Form.useForm();
  const [permissionForm] = Form.useForm();

  // 角色表格列
  const roleColumns: ColumnsType<RoleData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '用户数',
      dataIndex: 'usersCount',
      sorter: (a, b) => a.usersCount - b.usersCount,
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
            onClick={() => handleEditRole(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => handleRolePermission(record)}
          >
            权限
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRole(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 权限表格列
  const permissionColumns: ColumnsType<PermissionData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '权限名称',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '权限代码',
      dataIndex: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: '类型',
      dataIndex: 'type',
      filters: [
        { text: '菜单', value: '菜单' },
        { text: '操作', value: '操作' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === '菜单' ? 'blue' : 'green'}>{type}</Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
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
            onClick={() => handleEditPermission(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePermission(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 添加角色
  const handleAddRole = () => {
    setModalTitle('添加角色');
    setCurrentRole(null);
    roleForm.resetFields();
    setRoleModalVisible(true);
  };

  // 编辑角色
  const handleEditRole = (record: RoleData) => {
    setModalTitle('编辑角色');
    setCurrentRole(record);
    roleForm.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setRoleModalVisible(true);
  };

  // 删除角色
  const handleDeleteRole = (key: string) => {
    setRoles(roles.filter(role => role.key !== key));
    message.success('删除成功');
  };

  // 添加权限
  const handleAddPermission = () => {
    setModalTitle('添加权限');
    setCurrentPermission(null);
    permissionForm.resetFields();
    setPermissionModalVisible(true);
  };

  // 编辑权限
  const handleEditPermission = (record: PermissionData) => {
    setModalTitle('编辑权限');
    setCurrentPermission(record);
    permissionForm.setFieldsValue({
      name: record.name,
      code: record.code,
      type: record.type,
      description: record.description,
    });
    setPermissionModalVisible(true);
  };

  // 删除权限
  const handleDeletePermission = (key: string) => {
    setPermissions(permissions.filter(permission => permission.key !== key));
    message.success('删除成功');
  };

  // 角色权限设置
  const handleRolePermission = (record: RoleData) => {
    setRoleId(record.key);
    setModalTitle(`设置 "${record.name}" 的权限`);
    
    // 获取该角色已有的权限
    const perms = rolePermissionMap[record.key] || [];
    setCheckedPermissions(perms);
    
    setRolePermModalVisible(true);
  };

  // 确认添加/编辑角色
  const handleRoleModalOk = () => {
    roleForm.validateFields().then(values => {
      if (currentRole) {
        // 编辑角色
        setRoles(roles.map(role =>
          role.key === currentRole.key ? { ...role, ...values } : role
        ));
        message.success('编辑成功');
      } else {
        // 添加角色
        const newRole: RoleData = {
          key: Date.now().toString(),
          id: Math.max(...roles.map(r => r.id)) + 1,
          usersCount: 0,
          createTime: new Date().toISOString().split('T')[0],
          ...values,
        };
        setRoles([...roles, newRole]);
        message.success('添加成功');
      }
      setRoleModalVisible(false);
    });
  };

  // 确认添加/编辑权限
  const handlePermissionModalOk = () => {
    permissionForm.validateFields().then(values => {
      if (currentPermission) {
        // 编辑权限
        setPermissions(permissions.map(permission =>
          permission.key === currentPermission.key ? { ...permission, ...values } : permission
        ));
        message.success('编辑成功');
      } else {
        // 添加权限
        const newPermission: PermissionData = {
          key: Date.now().toString(),
          id: Math.max(...permissions.map(p => p.id)) + 1,
          createTime: new Date().toISOString().split('T')[0],
          ...values,
        };
        setPermissions([...permissions, newPermission]);
        message.success('添加成功');
      }
      setPermissionModalVisible(false);
    });
  };

  // 确认角色权限设置
  const handleRolePermModalOk = () => {
    // 在真实环境中，这里应该调用API保存角色权限
    rolePermissionMap[roleId] = checkedPermissions;
    message.success('权限设置成功');
    setRolePermModalVisible(false);
  };

  // 选中权限变化
  const onPermissionCheck = (
    checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }
  ) => {
    const keys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    setCheckedPermissions(keys as string[]);
  };

  return (
    <div className="permission-container">
      <Title level={2}>权限管理</Title>

      <Tabs defaultActiveKey="1" className="permission-tabs">
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              角色管理
            </span>
          }
          key="1"
        >
          <div className="tab-header">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>
              添加角色
            </Button>
          </div>
          <Table
            columns={roleColumns}
            dataSource={roles}
            rowKey="key"
            pagination={{ showSizeChanger: true, showQuickJumper: true }}
            className="role-table"
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarsOutlined />
              权限管理
            </span>
          }
          key="2"
        >
          <div className="tab-header">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPermission}>
              添加权限
            </Button>
          </div>
          <Table
            columns={permissionColumns}
            dataSource={permissions}
            rowKey="key"
            pagination={{ showSizeChanger: true, showQuickJumper: true }}
            className="permission-table"
          />
        </TabPane>
      </Tabs>

      {/* 角色表单 */}
      <Modal
        title={modalTitle}
        open={roleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={() => setRoleModalVisible(false)}
      >
        <Form
          form={roleForm}
          layout="vertical"
          name="roleForm"
        >
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
          >
            <Input.TextArea rows={4} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限表单 */}
      <Modal
        title={modalTitle}
        open={permissionModalVisible}
        onOk={handlePermissionModalOk}
        onCancel={() => setPermissionModalVisible(false)}
      >
        <Form
          form={permissionForm}
          layout="vertical"
          name="permissionForm"
        >
          <Form.Item
            name="name"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>
          <Form.Item
            name="code"
            label="权限代码"
            rules={[{ required: true, message: '请输入权限代码' }]}
          >
            <Input placeholder="请输入权限代码，如：user:add" />
          </Form.Item>
          <Form.Item
            name="type"
            label="权限类型"
            rules={[{ required: true, message: '请选择权限类型' }]}
          >
            <Select placeholder="请选择权限类型">
              <Option value="菜单">菜单</Option>
              <Option value="操作">操作</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="权限描述"
          >
            <Input.TextArea rows={4} placeholder="请输入权限描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 角色权限设置 */}
      <Modal
        title={modalTitle}
        open={rolePermModalVisible}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setRolePermModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleRolePermModalOk}
          >
            保存
          </Button>,
        ]}
        onCancel={() => setRolePermModalVisible(false)}
      >
        <div className="role-perm-container">
          <Card title="权限列表" bordered={false}>
            <Tree
              checkable
              checkedKeys={checkedPermissions}
              onCheck={onPermissionCheck}
              treeData={permissionTreeData}
              defaultExpandAll
            />
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default Permission; 