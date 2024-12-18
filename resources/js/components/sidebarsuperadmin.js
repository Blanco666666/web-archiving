import React from 'react';
import {
  HomeOutlined,
  UserOutlined,
  OrderedListOutlined,
  EditOutlined,
  LogoutOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Sider } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

const menuLabels = [
  "Thesis Status",           // Path: /superadmin-dashboard
  "Thesis Dashboard",        // Path: /superadmin-thesisdashboard
  "User / Admin",            // Path: /superadmin-dashboard/manage-users
  "All Theses",              // Path: /superadmin-dashboard/list-theses
  "Add Thesis",              // Path: /superadmin-dashboard/add-theses
  "Manage Thesis",           // Path: /superadmin-dashboard/edit-thesis
];

const menuPaths = [
  "/superadmin-dashboard",                // Thesis Status
  "/superadmin-thesisdashboard",          // Thesis Dashboard
  "/superadmin-dashboard/manage-users",   // User / Admin
  "/superadmin-dashboard/list-theses",    // All Theses
  "/superadmin-dashboard/add-theses",     // Add Thesis
  "/superadmin-dashboard/edit-thesis",    // Manage Thesis
];

const menuIcons = [
  HomeOutlined,
  UserOutlined,
  OrderedListOutlined,
  EditOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
];

const items = menuIcons.map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: (
    <Link to={menuPaths[index]} style={{ textDecoration: 'none' }}>
      {menuLabels[index]}
    </Link>
  ),
}));

const SidebarSuperAdmin = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No token found. Please log in again.');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      localStorage.removeItem('token');
      sessionStorage.removeItem('token');

      navigate('/login');
    } catch (error) {
      console.error('Error during logout', error.response ? error.response.data : error);
    }
  };

  return (
    <Sider style={siderStyle}>
      <div className="logo" style={{ textAlign: 'center', padding: '16px' }}>
        <img
          src="https://imgs.search.brave.com/VPYgfQ2HQEGRg6_hqxAbxVSXiY6S-dKRV_hLjtcGWmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vOC84Ny9G/YXRoZXJfU2F0dXJu/aW5vX1VyaW9zX1Vu/aXZlcnNpdHlfbG9n/by5wbmc_MjAyMDA5/MjUwMDE0MjM"
          alt="Library Logo"
          style={{ width: '40px', height: 'auto', marginBottom: '8px' }}
        />
        <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
          Admin
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          ...items,
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
          },
        ]}
      />
    </Sider>
  );
};

export default SidebarSuperAdmin;
