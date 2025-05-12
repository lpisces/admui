import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, theme, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  FileOutlined,
  LockOutlined,
  SettingOutlined,
  BranchesOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKey = location.pathname.split('/')[2] || 'welcome';

  const menuItems = [
    {
      key: 'welcome',
      icon: <HomeOutlined />,
      label: '欢迎页面',
      onClick: () => navigate('/dashboard/welcome'),
    },
    {
      key: 'organization',
      icon: <BranchesOutlined />,
      label: '组织管理',
      onClick: () => navigate('/dashboard/organization'),
    },
    {
      key: 'user',
      icon: <TeamOutlined />,
      label: '用户管理',
      onClick: () => navigate('/dashboard/user'),
    },
    {
      key: 'permission',
      icon: <LockOutlined />,
      label: '权限管理',
      onClick: () => navigate('/dashboard/permission'),
    },
    {
      key: 'file',
      icon: <FileOutlined />,
      label: '文件管理',
      onClick: () => navigate('/dashboard/file'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/dashboard/settings'),
    },
  ];

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/dashboard/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => navigate('/login'),
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} width={256}>
        <div className="logo">
          <h1>{collapsed ? 'A' : 'Admin UI'}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-button"
            />
          </div>
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 