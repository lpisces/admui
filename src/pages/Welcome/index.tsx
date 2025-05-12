import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, FileOutlined, BranchesOutlined, LockOutlined } from '@ant-design/icons';
import './index.less';

const { Title, Paragraph } = Typography;

const Welcome: React.FC = () => {
  const statCards = [
    {
      title: '用户总数',
      value: 1283,
      icon: <UserOutlined />,
      color: '#1890ff',
    },
    {
      title: '组织总数',
      value: 56,
      icon: <BranchesOutlined />,
      color: '#52c41a',
    },
    {
      title: '角色总数',
      value: 28,
      icon: <LockOutlined />,
      color: '#722ed1',
    },
    {
      title: '文件总数',
      value: 5632,
      icon: <FileOutlined />,
      color: '#faad14',
    },
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <Title level={2}>欢迎使用管理后台</Title>
        <Paragraph className="welcome-description">
          这是一个功能全面的管理系统，您可以在这里管理组织、用户、权限和文件。
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} className="stat-row">
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card className="stat-card" bordered={false}>
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <Statistic title={stat.title} value={stat.value} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="feature-row">
        <Col xs={24} md={8}>
          <Card title="用户管理" className="feature-card">
            <div className="feature-content">
              <TeamOutlined className="feature-icon" />
              <Paragraph>
                添加、编辑和删除系统用户，管理用户权限和角色分配。
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="组织管理" className="feature-card">
            <div className="feature-content">
              <BranchesOutlined className="feature-icon" />
              <Paragraph>
                创建和管理组织架构，可视化组织树形结构，轻松调整组织关系。
              </Paragraph>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="权限管理" className="feature-card">
            <div className="feature-content">
              <LockOutlined className="feature-icon" />
              <Paragraph>
                精细化的权限控制系统，可以为不同角色分配不同的操作权限。
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Welcome; 