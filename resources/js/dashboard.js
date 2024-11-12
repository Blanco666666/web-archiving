import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarUser from './components/sidebaruser';
import ListThesis from './components/ListThesis';
import SearchBar from './components/Searchbar';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [theses, setTheses] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingTheses, setIsLoadingTheses] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);
    const [role, setRole] = useState('user');

    const sidebarWidth = collapsed ? 80 : 200;

    // Check token for authentication and fetch user data
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                await axios.get('/api/auth/check-token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (error) {
                console.error('Token expired or invalid', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        checkToken();
    }, [navigate]);

    useEffect(() => {
        document.title = 'Dashboard - Student';
    }, []);

    // Fetch user and theses data
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const [userResponse, thesesResponse] = await Promise.all([
                    axios.get('/api/auth/user', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('/api/theses'),
                ]);

                setUser(userResponse.data);
                setRole(userResponse.data.role);
                setTheses(thesesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setIsLoadingUser(false);
                setIsLoadingTheses(false);
            }
        };

        fetchData();
    }, []);

    if (isLoadingUser) return <p>Loading user data...</p>;
    if (error) return <p>{error}</p>;

    const renderSidebar = () => {
        if (role === 'superadmin') return <SidebarSuperAdmin collapsed={collapsed} onCollapse={setCollapsed} />;
        if (role === 'admin') return <SidebarAdmin collapsed={collapsed} onCollapse={setCollapsed} />;
        return <SidebarUser collapsed={collapsed} onCollapse={setCollapsed} />;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {renderSidebar()}
            <Layout style={{ marginLeft: sidebarWidth }}>
                <Header style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #f0f0f0', position: 'fixed', zIndex: 1000, width: '100%', height: '64px' }}>
                    <Title level={3} style={{ margin: 0 }}>User Dashboard</Title>
                </Header>
                <Content style={{ margin: '64px 16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    </div>
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <ListThesis theses={theses} />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
