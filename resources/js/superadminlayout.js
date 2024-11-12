import React from 'react';
import { Layout } from 'antd'; // Assuming you're using Ant Design
import SidebarSuperAdmin from './components/sidebarsuperadmin'; // Superadmin sidebar
import { Outlet } from 'react-router-dom'; // Outlet for nested routes

const { Content } = Layout;

const SuperAdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SidebarSuperAdmin />

            <Layout style={{ marginLeft: '200px' }}> 
            <Content style={{ padding: '24px', overflow: 'auto' }}>
                   
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default SuperAdminLayout;
