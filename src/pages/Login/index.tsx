import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import './index.less';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('登录成功！');
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card bordered={false} className="login-card">
          <div className="login-header">
            <Title level={2} className="login-title">管理后台</Title>
            <p className="login-subtitle">欢迎使用管理系统</p>
          </div>
          
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>

            <Form.Item>
              <div className="login-form-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" className="login-form-forgot">
                  忘记密码?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              <div className="login-form-register">
                还没有账号? <Link to="/register">立即注册</Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login; 