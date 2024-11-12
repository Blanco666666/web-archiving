import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Dropdown, Typography, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

// Define menu items for Dropdown and Menu
const dropdownItems = [
    { key: '1', label: <Link to="#action/3.1">Action</Link> },
    { key: '2', label: <Link to="#action/3.2">Another action</Link> },
    { key: '3', label: <Link to="#action/3.3">Something</Link> },
    { key: '4', type: 'divider' },
    { key: '5', label: <Link to="#action/3.4">Separated link</Link> },
];

const menuItems = [
    { key: 'home', label: <Link to="/" style={{ color: '#ffffff' }}>Home</Link> },
    { key: 'about', label: <Link to="/about" style={{ color: '#ffffff' }}>About</Link> },
    {
        key: 'dropdown',
        label: (
            <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()} href="#" style={{ color: '#ffffff' }}>
                    Dropdown <DownOutlined />
                </a>
            </Dropdown>
        ),
    },
];

const HeaderComponent = () => {
    return (
        <Header 
            className="custom-navbar shadow-lg" 
            style={{ 
                backgroundColor: '#001529', // Dark background for better contrast
                padding: '0 20px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                zIndex: 1000 // Keep header on top
            }}
        >
            <Space align="center" className="brand-text">
                <img
                    src="https://imgs.search.brave.com/VPYgfQ2HQEGRg6_hqxAbxVSXiY6S-dKRV_hLjtcGWmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vOC84Ny9G/YXRoZXJfU2F0dXJu/aW5vX1VyaW9zX1Vu/aXZlcnNpdHlfbG9n/by5wbmc_MjAyMDA5/MjUwMDE0MjM"
                    alt="FSUU Logo"
                    className="navbar-logo"
                    style={{ height: '40px', marginRight: '10px' }} 
                />
                <Text strong style={{ color: '#ffffff' }}> {/* White color for visibility */}
                    Father Saturnino Urios University Archiving System
                </Text>
            </Space>

            <Menu 
                mode="horizontal" 
                selectable={false} 
                theme="dark" // Dark theme for visibility
                style={{ 
                    flexGrow: 1, 
                    justifyContent: 'flex-end',
                    backgroundColor: 'transparent' // Matches header background
                }}
                items={menuItems} // Use items instead of children
            />
        </Header>
    );
};

export default HeaderComponent;
