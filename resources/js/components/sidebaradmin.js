import React from 'react';
import { HomeOutlined, EditOutlined, OrderedListOutlined, PlusCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

const adminMenuItems = [
  { label: 'Dashboard', icon: <HomeOutlined />, path: '/admin-dashboard' },
  { label: 'List Theses', icon: <OrderedListOutlined />, path: '/admin-dashboard/list-theses' },
  { label: 'Add Thesis', icon: <PlusCircleOutlined />, path: '/admin-dashboard/add-theses' },
];

const SidebarAdmin = () => {
  const location = useLocation();
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
          'Authorization': `Bearer ${token}`,
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
    <Layout hasSider>
      <Sider style={siderStyle} theme="dark">
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
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
          {adminMenuItems.map((item, index) => (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path} style={{ textDecoration: 'none' }}>{item.label}</Link>
            </Menu.Item>
          ))}
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SidebarAdmin;
