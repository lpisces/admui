import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Steps } from 'antd';
import { MailOutlined, LockOutlined, CodeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.less';

const { Title } = Typography;
const { Step } = Steps;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');

  const handleNext = (values: any) => {
    if (currentStep === 0) {
      setEmail(values.email);
      message.success('验证码已发送到您的邮箱');
      setCurrentStep(1);
    } else if (currentStep === 1) {
      message.success('验证码验证成功');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      message.success('密码重置成功，请使用新密码登录');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  };

  const steps = [
    {
      title: '验证邮箱',
      content: (
        <Form
          form={form}
          name="verify_email"
          onFinish={handleNext}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '邮箱格式不正确!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="注册邮箱" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="forgot-form-button">
              获取验证码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '验证身份',
      content: (
        <Form
          form={form}
          name="verify_code"
          onFinish={handleNext}
          layout="vertical"
        >
          <Form.Item>
            <div className="verification-email">
              验证码已发送至: <strong>{email}</strong>
            </div>
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              { required: true, message: '请输入验证码!' },
              { len: 6, message: '验证码为6位数字!' }
            ]}
          >
            <Input prefix={<CodeOutlined />} placeholder="6位验证码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="forgot-form-button">
              验证
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '重置密码',
      content: (
        <Form
          form={form}
          name="reset_password"
          onFinish={handleNext}
          layout="vertical"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入新密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" size="large" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: '请确认新密码!' },
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
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="forgot-form-button">
              重置密码
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <Card bordered={false} className="forgot-password-card">
          <div className="forgot-password-header">
            <Title level={2} className="forgot-password-title">忘记密码</Title>
            <p className="forgot-password-subtitle">重置您的账号密码</p>
          </div>
          
          <Steps current={currentStep} className="forgot-password-steps">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className="steps-content">
            {steps[currentStep].content}
          </div>

          <div className="forgot-password-footer">
            <Link to="/login">返回登录</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 