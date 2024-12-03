import React, { useEffect, useState } from 'react';
import { Layout, Card, Col, Row, Spin, message } from 'antd';
import axios from 'axios';

const { Content, Header } = Layout;

const ThesisStatistics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTheses: 0,
        totalReaders: 0,
        approvedTheses: 0,
        pendingTheses: 0,
        rejectedTheses: 0,
    });

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/theses/statistics', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Statistics:', response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: 16 }}>
                <h2 style={{ margin: 0 }}>Thesis Statistics</h2>
            </Header>
            <Content style={{ margin: '16px', padding: 24, background: '#fff' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card title="Total Theses" bordered>
                                <h2 style={{ textAlign: 'center' }}>{stats.totalTheses}</h2>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Total Readers" bordered>
                                <h2 style={{ textAlign: 'center' }}>{stats.totalReaders}</h2>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Approved Theses" bordered>
                                <h2 style={{ textAlign: 'center' }}>{stats.approvedTheses}</h2>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Pending Theses" bordered>
                                <h2 style={{ textAlign: 'center' }}>{stats.pendingTheses}</h2>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="Rejected Theses" bordered>
                                <h2 style={{ textAlign: 'center' }}>{stats.rejectedTheses}</h2>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Content>
        </Layout>
    );
};

export default ThesisStatistics;
