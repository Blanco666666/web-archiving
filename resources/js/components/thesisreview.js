// src/components/ThesisReview.js
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Input, Spin } from 'antd';
import axios from 'axios';

const ThesisReview = () => {
    const [theses, setTheses] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [currentThesisId, setCurrentThesisId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTheses();
    }, []);

    const fetchTheses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/theses');
            setTheses(response.data.filter(thesis => thesis.status === 'pending'));
        } catch (error) {
            message.error('Failed to fetch theses: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Handle review action
    const handleReview = (id, status) => {
        if (status === 'rejected') {
            setCurrentThesisId(id);
            setIsModalVisible(true); 
        } else {
            updateThesisStatus(id, status);
        }
    };

    const updateThesisStatus = async (id, status) => {
        setSubmitting(true);
        try {
            await axios.put(`/api/theses/${id}/review`, { status, feedback });
            message.success(`Thesis ${status} successfully!`);
            fetchTheses();
        } catch (error) {
            message.error('Failed to update thesis status: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
            setFeedback(''); 
        }
    };

    const handleOk = async () => {
        await updateThesisStatus(currentThesisId, 'rejected');
        setIsModalVisible(false); 
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFeedback(''); 
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Author', dataIndex: 'author_name', key: 'author_name' },
        { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => handleReview(record.id, 'approved')}
                        type="primary"
                        loading={submitting && currentThesisId === record.id && feedback === ''}
                        style={{ marginRight: 8 }}
                    >
                        Approve
                    </Button>
                    <Button
                        onClick={() => handleReview(record.id, 'rejected')}
                        type="danger"
                        loading={submitting && currentThesisId === record.id && feedback !== ''}
                    >
                        Reject
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Table dataSource={theses} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
            )}
            <Modal
                title="Provide Feedback for Rejection"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Submit Feedback"
                confirmLoading={submitting}
            >
                <Input.TextArea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback for rejection"
                />
            </Modal>
        </div>
    );
};

export default ThesisReview;
