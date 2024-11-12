import React, { useEffect, useState } from 'react';
import { Layout, Spin, message } from 'antd';
import SidebarAdmin from './components/sidebaradmin';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './components/Searchbar';
import axios from 'axios';

const { Content, Header } = Layout;

const AdminLayout = () => {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetches theses from the backend
    const fetchTheses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/theses');
            setTheses(response.data);
        } catch (error) {
            console.error('Error fetching theses:', error.response?.data || error.message);
            message.error('Failed to fetch theses. Please try again later.'); // User feedback on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheses();
        document.title = "Admin Dashboard"; // Set document title
    }, []);

    // Handles thesis selection for editing
    const onThesisSelect = (selectedThesis) => {
        navigate(`/admin-dashboard/edit/${selectedThesis.id}`);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SidebarAdmin />

            <Layout style={{ marginLeft: 200 }}>
                <Header
                    style={{
                        background: '#fff',
                        padding: '0 20px',
                        borderBottom: '1px solid #f0f0f0',
                        position: 'fixed',
                        width: '100%',
                        zIndex: 1000,
                    }}
                >
                    <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
                </Header>
                <Content style={{ marginTop: 64, padding: '24px', background: '#fff' }}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            <Outlet />
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
