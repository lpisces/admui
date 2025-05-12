import React, { useState } from 'react';
import {
  Typography,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  message,
  Card,
  Row,
  Col,
  Avatar,
  Switch,
  Divider,
  Select,
  List,
  Tag,
  Space,
  Popconfirm,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UploadOutlined,
  BellOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { TabsProps } from 'antd';
import './index.less';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 模拟登录设备数据
const mockDevices = [
  {
    id: 1,
    device: 'Chrome on Windows',
    ip: '192.168.1.1',
    location: '北京',
    time: '2023-05-12 10:30:45',
    current: true,
  },
  {
    id: 2,
    device: 'Safari on MacOS',
    ip: '192.168.1.2',
    location: '上海',
    time: '2023-05-10 08:15:22',
    current: false,
  },
  {
    id: 3,
    device: 'Firefox on Windows',
    ip: '192.168.1.3',
    location: '广州',
    time: '2023-05-08 16:45:12',
    current: false,
  },
  {
    id: 4,
    device: 'Chrome on Android',
    ip: '192.168.1.4',
    location: '深圳',
    time: '2023-05-05 12:32:18',
    current: false,
  },
];

const Settings: React.FC = () => {
  const [userForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatar, setAvatar] = useState<string>('https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    system: true,
    desktop: false,
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlert: true,
    ipRestriction: false,
  });
  const [devices, setDevices] = useState(mockDevices);

  // 保存个人资料
  const handleSaveProfile = (values: any) => {
    console.log('Profile values:', values);
    message.success('个人资料保存成功');
  };

  // 修改密码
  const handleChangePassword = (values: any) => {
    console.log('Password values:', values);
    message.success('密码修改成功');
    passwordForm.resetFields();
  };

  // 头像上传前检查
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // 头像上传
  const handleUploadAvatar: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // 实际开发中应该使用后端返回的图片URL
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setAvatar(url);
        message.success('头像上传成功');
      });
    }
  };

  // 将File对象转为base64
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  // 处理通知设置变更
  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: checked,
    });
    message.success('设置已保存');
  };

  // 处理安全设置变更
  const handleSecurityChange = (key: string, checked: boolean) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: checked,
    });
    message.success('设置已保存');
  };

  // 删除登录设备
  const handleRemoveDevice = (id: number) => {
    setDevices(devices.filter(device => device.id !== id));
    message.success('设备已移除');
  };

  // 选项卡内容
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          个人资料
        </span>
      ),
      children: (
        <Card bordered={false}>
          <div className="avatar-section">
            <div className="avatar-container">
              <Avatar size={100} src={avatar} icon={<UserOutlined />} />
              <Upload
                name="avatar"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleUploadAvatar}
                action="/api/upload"
                className="avatar-uploader"
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
            <Paragraph className="avatar-tip">
              请上传JPG或PNG格式的图片，大小不超过2MB
            </Paragraph>
          </div>
          
          <Divider />
          
          <Form
            form={userForm}
            layout="vertical"
            initialValues={{
              nickname: '管理员',
              username: 'admin',
              email: 'admin@example.com',
              phone: '13800138000',
              company: '示例科技有限公司',
              position: '系统管理员',
              bio: '负责系统管理和运维工作',
            }}
            onFinish={handleSaveProfile}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="nickname"
                  label="昵称"
                  rules={[{ required: true, message: '请输入昵称' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="昵称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="用户名" disabled />
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
                  <Input prefix={<MailOutlined />} placeholder="邮箱" />
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
                  <Input prefix={<PhoneOutlined />} placeholder="手机号" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="公司"
                >
                  <Input placeholder="公司名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="position"
                  label="职位"
                >
                  <Input placeholder="职位" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="bio"
              label="个人简介"
            >
              <Input.TextArea rows={4} placeholder="个人简介" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <LockOutlined />
          修改密码
        </span>
      ),
      children: (
        <Card bordered={false}>
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              name="oldPassword"
              label="当前密码"
              rules={[{ required: true, message: '请输入当前密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
            </Form.Item>
            
            <Form.Item
              name="newPassword"
              label="新密码"
              rules={[
                { required: true, message: '请输入新密码' },
                { min: 6, message: '密码长度不能少于6位' }
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
            </Form.Item>
            
            <Form.Item
              name="confirmPassword"
              label="确认新密码"
              dependencies={['newPassword']}
              hasFeedback
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                更改密码
              </Button>
            </Form.Item>
          </Form>
          
          <Divider />
          
          <div className="password-tips">
            <Title level={5}>密码设置建议：</Title>
            <ul>
              <li>不要使用简单的数字或字母组合</li>
              <li>密码长度建议8位以上</li>
              <li>建议包含大小写字母、数字和特殊字符</li>
              <li>定期更换密码可以提高账号安全性</li>
            </ul>
          </div>
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <BellOutlined />
          通知设置
        </span>
      ),
      children: (
        <Card bordered={false}>
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: '邮件通知',
                description: '重要事件发生时通过邮件通知您',
                key: 'email',
                checked: notificationSettings.email,
              },
              {
                title: '系统通知',
                description: '在系统内接收消息通知',
                key: 'system',
                checked: notificationSettings.system,
              },
              {
                title: '桌面通知',
                description: '允许系统在桌面推送通知',
                key: 'desktop',
                checked: notificationSettings.desktop,
              },
            ]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Switch
                    key="switch"
                    checked={item.checked}
                    onChange={(checked) => handleNotificationChange(item.key, checked)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <SafetyOutlined />
          安全设置
        </span>
      ),
      children: (
        <Card bordered={false}>
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: '两步验证',
                description: '登录时需要额外验证，提升账号安全性',
                key: 'twoFactor',
                checked: securitySettings.twoFactor,
              },
              {
                title: '登录通知',
                description: '账号登录时发送邮件通知',
                key: 'loginAlert',
                checked: securitySettings.loginAlert,
              },
              {
                title: 'IP限制',
                description: '限制特定IP地址访问您的账号',
                key: 'ipRestriction',
                checked: securitySettings.ipRestriction,
              },
            ]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Switch
                    key="switch"
                    checked={item.checked}
                    onChange={(checked) => handleSecurityChange(item.key, checked)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          
          <Divider />
          
          <Title level={5}>登录设备</Title>
          <Paragraph className="device-description">
            以下是最近登录过您账号的设备，如果发现陌生设备，请及时移除并修改密码。
          </Paragraph>
          
          <List
            className="device-list"
            itemLayout="horizontal"
            dataSource={devices}
            renderItem={(item) => (
              <List.Item
                actions={[
                  item.current ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      当前设备
                    </Tag>
                  ) : (
                    <Popconfirm
                      title="确定移除这个设备吗？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => handleRemoveDevice(item.id)}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      >
                        移除
                      </Button>
                    </Popconfirm>
                  ),
                ]}
              >
                <List.Item.Meta
                  title={item.device}
                  description={
                    <Space direction="vertical" size={0}>
                      <span>IP: {item.ip}</span>
                      <span>位置: {item.location}</span>
                      <span>登录时间: {item.time}</span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="settings-container">
      <Title level={2}>个人设置</Title>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default Settings; 