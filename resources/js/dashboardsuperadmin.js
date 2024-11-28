import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, message, Spin } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarSuperAdmin from './components/sidebarsuperadmin';
import axios from 'axios';

const { Header, Content, Footer } = Layout;

const DashboardSuperAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [theses, setTheses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const navigate = useNavigate();

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('You are not logged in');
            navigate('/login');
        }
        return token;
    };
    const fetchPendingTheses = async () => {
        setLoading(true);
        const token = getToken();
        try {
            const response = await axios.get('/api/theses?status=pending', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTheses(response.data);
        } catch (error) {
            console.error('Error fetching pending theses:', error);
            if (error.response && error.response.status === 401) {
                message.error('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                message.error('Failed to fetch theses.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTheses();
    }, []);

    const showFeedbackModal = (thesis) => {
        setSelectedThesis(thesis);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFeedback('');
    };

    const handleApprove = async (thesisId) => {
        setApproveLoading(true);
        const token = getToken();
    
        try {
            const response = await axios.put(
                `/api/theses/${thesisId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                message.success('Thesis approved successfully');
                fetchPendingTheses();
            }
        } catch (error) {
            console.error('Error approving thesis:', error.response?.data || error.message);
            if (error.response && error.response.status === 401) {
                message.error('Session expired or unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                message.error('Failed to approve thesis. Please try again.');
            }
        } finally {
            setApproveLoading(false);
        }
    };
    
    const handleReject = async () => {
        if (!feedback) {
            message.error('Feedback is required to reject the thesis.');
            return;
        }
    
        setRejectLoading(true);
        const token = getToken();
    
        try {
            const response = await axios.put(
                `/api/theses/${selectedThesis.id}/reject`,
                { feedback },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                message.success('Thesis rejected successfully');
                fetchPendingTheses();
                handleCancel();
            }
        } catch (error) {
            console.error('Error rejecting thesis:', error.response?.data || error.message);
            if (error.response && error.response.status === 401) {
                message.error('Session expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                message.error('Failed to reject thesis. Please try again.');
            }
        } finally {
            setRejectLoading(false);
        }
    };
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
                        loading={approveLoading}
                        style={{ marginRight: '8px' }}
                    >
                        Approve
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => showFeedbackModal(thesis)}
                        loading={rejectLoading}
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SidebarSuperAdmin collapsed={collapsed} onCollapse={setCollapsed} />
            <Layout style={{ marginLeft: collapsed ? '80px' : '100px' }}>
                <Header style={{ background: '#fff', padding: 16, textAlign: 'center' }}>
                    <h2 style={{ margin: 0 }}>Super Admin Dashboard</h2>
                </Header>

                <Content
                    style={{
                        margin: '16px',
                        padding: 24,
                        background: '#fff',
                        minHeight: 'calc(100vh - 200px)',
                    }}
                >
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px 0' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={theses}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                    <Outlet />
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    Super Admin Dashboard ©{new Date().getFullYear()}
                </Footer>
            </Layout>

            <Modal
                title="Provide Feedback for Rejection"
                visible={isModalVisible}
                onOk={handleReject}
                onCancel={handleCancel}
                okText="Submit Feedback"
                confirmLoading={rejectLoading}
            >
                <Form layout="vertical">
                    <Form.Item label="Feedback" required>
                        <Input.TextArea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                            placeholder="Provide reasons for rejection or any required changes"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default DashboardSuperAdmin;
