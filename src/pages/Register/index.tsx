import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import './index.less';

const { Title } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('注册成功！请登录');
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <Card bordered={false} className="register-card">
          <div className="register-header">
            <Title level={2} className="register-title">注册账号</Title>
            <p className="register-subtitle">创建一个新账号</p>
          </div>
          
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            scrollToFirstError
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '用户名至少3个字符!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '邮箱格式不正确!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="邮箱" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号!' },
                { pattern: /^1\d{10}$/, message: '手机号格式不正确!' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="手机号" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码至少6个字符!' }
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="register-form-button">
                注册
              </Button>
              <div className="register-form-login">
                已有账号? <Link to="/login">立即登录</Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register; 