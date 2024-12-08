import React, { useEffect, useState } from 'react';
import { Table, Card, Layout, Spin, message } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;

const ThesisDashboard = () => {
    const [thesisData, setThesisData] = useState([]);
    const [totalTheses, setTotalTheses] = useState(0);
    const [totalViews, setTotalViews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the API
        const fetchThesisData = async () => {
            try {
                const response = await axios.get('/api/superadmin/thesis-overview', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include auth token
                    },
                });

                setThesisData(response.data.theses);
                setTotalTheses(response.data.totalTheses);
                setTotalViews(response.data.totalViews);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching thesis data:', error);
                message.error('Failed to fetch data. Please try again.');
                setLoading(false);
            }
        };

        fetchThesisData();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Submission Date',
            dataIndex: 'submission_date',
            key: 'submission_date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ backgroundColor: 'transparent', padding: '20px 0' }}>
                <h1 style={{ textAlign: 'center', margin: 0, fontSize: '24px' }}>Thesis Statistics</h1>
            </Header>
            <Content style={{ padding: '20px' }}>
                {loading ? (
                    <Spin tip="Loading..." style={{ display: 'block', margin: 'auto' }} />
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <Card title="Total Theses" bordered={false} style={{ width: '45%' }}>
                                <p style={{ fontSize: '24px', textAlign: 'center' }}>{totalTheses}</p>
                            </Card>
                            <Card title="Total Views" bordered={false} style={{ width: '45%' }}>
                                <p style={{ fontSize: '24px', textAlign: 'center' }}>{totalViews}</p>
                            </Card>
                        </div>
                        <Card title="Thesis Overview" bordered={false}>
                            <Table
                                dataSource={thesisData}
                                columns={columns}
                                rowKey="id"
                                pagination={{ pageSize: 10 }}
                            />
                        </Card>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default ThesisDashboard;
