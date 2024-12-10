import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Typography, Space, Button } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

// Define menu items for Menu
const menuItems = [
    { key: 'home', label: <Link to="/" style={{ color: '#ffffff' }}>Home</Link> },
    { key: 'about', label: <Link to="/about" style={{ color: '#ffffff' }}>About</Link> },
];

const HeaderComponent = () => {
    return (
        <Header
            className="custom-navbar shadow-lg"
            style={{
                backgroundColor: '#001529', // Dark background for better contrast
                padding: '0 20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
                zIndex: 1000, // Keep header on top
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Space align="center" className="brand-text">
                <img
                    src="https://imgs.search.brave.com/VPYgfQ2HQEGRg6_hqxAbxVSXiY6S-dKRV_hLjtcGWmg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vOC84Ny9G/YXRoZXJfU2F0dXJu/aW5vX1VyaW9zX1Vu/aXZlcnNpdHlfbG9n/by5wbmc_MjAyMDA5/MjUwMDE0MjM"
                    alt="FSUU Logo"
                    className="navbar-logo"
                    style={{ height: '40px', marginRight: '10px' }}
                />
                <Text strong style={{ color: '#ffffff' }}>
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
                    backgroundColor: 'transparent', // Matches header background
                }}
                items={menuItems} // Use items instead of children
            />

        </Header>
    );
};

export default HeaderComponent;