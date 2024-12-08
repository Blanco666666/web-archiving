import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Spin, message, Drawer } from 'antd';
import SidebarSuperAdmin from './components/sidebarsuperadmin';
import axios from 'axios';

const { Header, Content, Footer } = Layout;

const DashboardSuperAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pendingTheses, setPendingTheses] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);

    // Fetch pending theses
    const fetchPendingTheses = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('You are not logged in');
            return;
        }

        try {
            const response = await axios.get('/api/theses?status=pending', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPendingTheses(response.data);
        } catch (error) {
            console.error('Error fetching pending theses:', error);
            message.error('Failed to fetch pending theses.');
        } finally {
            setLoading(false);
        }
    };

    // Handle Approve Thesis
    const handleApprove = async (thesisId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/theses/${thesisId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Thesis approved successfully');
            // Remove the thesis from the local state after approval
            setPendingTheses(pendingTheses.filter((thesis) => thesis.id !== thesisId));
        } catch (error) {
            console.error('Error approving thesis:', error);
            message.error('Failed to approve thesis.');
        }
    };

    // Handle Reject Thesis
    const handleReject = async (thesisId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/theses/${thesisId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Thesis rejected successfully.');
            // Remove the thesis from the local state after rejection
            setPendingTheses(pendingTheses.filter((thesis) => thesis.id !== thesisId));
        } catch (error) {
            console.error('Error rejecting thesis:', error);
            message.error('Failed to reject thesis.');
        }
    };

    // Open drawer to view thesis details
    const handleViewDetails = (thesis) => {
        setSelectedThesis(thesis);
        setDrawerVisible(true);
    };

    // Close the drawer
    const closeDrawer = () => {
        setDrawerVisible(false);
        setSelectedThesis(null);
    };

    useEffect(() => {
        fetchPendingTheses();
    }, []);

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Author', dataIndex: 'author_name', key: 'author_name' },
        { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, thesis) => (
                <div>
                    <Button
                        type="primary"
                        onClick={() => handleApprove(thesis.id)}
                        style={{ marginRight: '8px' }}
                    >
                        Approve
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleReject(thesis.id)}
                        style={{ marginRight: '8px' }}
                    >
                        Reject
                    </Button>
                    <Button type="default" onClick={() => handleViewDetails(thesis)}>
                        View Details
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SidebarSuperAdmin collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout style={{ marginLeft: collapsed ? '80px' : '80px' }}>
                <Header style={{ background: '#fff', padding: 16 }}>
                    <h2 style={{ margin: 0 }}>Pending Theses</h2>
                </Header>
                <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', marginTop: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={pendingTheses}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Super Admin Dashboard ©{new Date().getFullYear()}</Footer>
            </Layout>

            {/* Drawer for Thesis Details */}
            <Drawer
                title="Thesis Details"
                placement="right"
                onClose={closeDrawer}
                visible={drawerVisible}
                width={600}
            >
                {selectedThesis ? (
                    <div>
                        <p>
                            <strong>Title:</strong> {selectedThesis.title}
                        </p>
                        <p>
                            <strong>Author:</strong> {selectedThesis.author_name}
                        </p>
                        <p>
                            <strong>Abstract:</strong> {selectedThesis.abstract}
                        </p>
                        <p>
                            <strong>Number of Pages:</strong> {selectedThesis.number_of_pages}
                        </p>
                        <p>
                            <strong>Submission Date:</strong> {selectedThesis.submission_date}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedThesis.status}
                        </p>
                        <p>
                            <strong>Keywords:</strong> {selectedThesis.keywords}
                        </p>
                    </div>
                ) : (
                    <Spin size="large" />
                )}
            </Drawer>
        </Layout>
    );
};

export default DashboardSuperAdmin;
