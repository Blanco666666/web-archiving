import React, { useEffect, useState } from 'react';
import { Layout, Typography, Spin, Drawer } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarUser from './components/sidebaruser';
import SearchBar from './components/Searchbar';
import axios from 'axios';

const { Content, Header } = Layout;
const { Title } = Typography;

const UserLayout = () => {
    const [loading, setLoading] = useState(true);
    const [theses, setTheses] = useState([]);
    const [selectedThesis, setSelectedThesis] = useState(null); 
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/theses');
                setTheses(response.data);
            } catch (error) {
                console.error('Error fetching theses:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        document.title = "Dashboard-User";

        return () => {
            document.title = "Dashboard-User";
        };
    }, []);


    const onThesisSelect = (thesis) => {
        setSelectedThesis(thesis);
        setIsDrawerVisible(true); 
    };

    const onDrawerClose = () => {
        setIsDrawerVisible(false);
        setSelectedThesis(null);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SidebarUser />
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>User Dashboard</Title>
                    </div>
                </Header>
                <Content style={{ padding: '20px', overflow: 'auto', marginTop: '64px' }}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <>
                            <Outlet />
                        </>
                    )}
                </Content>
            </Layout>

            <Drawer
                title={selectedThesis ? selectedThesis.title : ''}
                visible={isDrawerVisible}
                onClose={onDrawerClose}
                width={600}
                footer={null}
            >
                {selectedThesis ? (
                    <div>
                        <h3>Author: {selectedThesis.author_name}</h3>
                        <p><strong>Description:</strong> {selectedThesis.description}</p>
                        <p><strong>Year:</strong> {selectedThesis.year}</p>
                        <p><strong>Abstract:</strong> {selectedThesis.abstract}</p>
                    </div>
                ) : (
                    <p>No thesis selected</p>
                )}
            </Drawer>
        </Layout>
    );
};

export default UserLayout;
