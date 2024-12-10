import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Spin, message, Modal, Form, Input, DatePicker, Upload, Popconfirm } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

const { Content, Header } = Layout;

const EditThesis = () => {
    const [theses, setTheses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentThesis, setCurrentThesis] = useState(null);
    const [form] = Form.useForm();
    const [pdfModalVisible, setPdfModalVisible] = useState(false);
    const [pdfFilePath, setPdfFilePath] = useState('');


    const handleViewPdf = (filePath) => {
        setPdfFilePath(`http://localhost:8000/storage/${filePath}`);
        setPdfModalVisible(true);
    };
    
    const handleClosePdfModal = () => {
        setPdfModalVisible(false);
        setPdfFilePath('');
    };
    // Fetch theses based on status
    const fetchTheses = async (status = null) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('No token found. Please log in.');
                return;
            }

            const params = status ? { status } : {};
            const response = await axios.get('/api/theses', {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setTheses(response.data);
        } catch (error) {
            console.error('Error fetching theses:', error);
            message.error('Failed to fetch theses. Please check your API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheses(filterStatus === 'all' ? null : filterStatus);
    }, [filterStatus]);

    const handleStatusChange = (status) => {
        setFilterStatus(status);
    };

    const handleEditThesis = (thesis) => {
        setCurrentThesis(thesis);
        form.setFieldsValue({
            title: thesis.title,
            abstract: thesis.abstract,
            submission_date: moment(thesis.submission_date),
            author_name: thesis.author_name,
            number_of_pages: thesis.number_of_pages,
            keywords: thesis.keywords || '',
        });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setCurrentThesis(null);
    };

    const handleCreateOrUpdateThesis = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('abstract', values.abstract);
            formData.append('author_name', values.author_name);
            formData.append('submission_date', values.submission_date.format('YYYY-MM-DD'));
            formData.append('number_of_pages', values.number_of_pages);
            formData.append('keywords', values.keywords || '');

            if (values.abstract_file) {
                formData.append('abstract_file', values.abstract_file.file.originFileObj);
            }
            if (values.full_text_file) {
                formData.append('full_text_file', values.full_text_file.file.originFileObj);
            }

            await axios.put(`/api/theses/${currentThesis.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            message.success('Thesis updated successfully.');
            fetchTheses(filterStatus === 'all' ? null : filterStatus);
            handleCancel();
        } catch (error) {
            console.error('Error updating thesis:', error);
            message.error('Failed to update thesis.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteThesis = async (thesisId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/theses/${thesisId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Thesis deleted successfully.');
            fetchTheses(filterStatus === 'all' ? null : filterStatus);
        } catch (error) {
            console.error('Error deleting thesis:', error);
            message.error('Failed to delete thesis.');
        }
    };

    const handleRestoreThesis = async (thesisId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`/api/theses/${thesisId}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Thesis restored successfully.');
            fetchTheses(filterStatus === 'all' ? null : filterStatus);
        } catch (error) {
            console.error('Error restoring thesis:', error);
            message.error('Failed to restore thesis.');
        }
    };

    const columns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Author', dataIndex: 'author_name', key: 'author_name' },
        { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span style={{ textTransform: 'capitalize' }}>{status}</span>,
        },
        {
            title: 'Files',
            key: 'files',
            render: (_, thesis) => (
                <div>
                    {thesis.abstract_file_path && (
                        <Button
                            type="link"
                            onClick={() => handleViewPdf(thesis.abstract_file_path)}
                            style={{ marginRight: '8px' }}
                        >
                            View Abstract
                        </Button>
                    )}
                    {thesis.file_path && (
                        <Button
                            type="link"
                            onClick={() => handleViewPdf(thesis.file_path)}
                        >
                            View Full Text
                        </Button>
                    )}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, thesis) => (
                <div>
                    {thesis.status === 'rejected' ? (
                        <Button
                            type="primary"
                            onClick={() => handleRestoreThesis(thesis.id)}
                            style={{ marginRight: '8px' }}
                        >
                            Restore
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="link"
                                onClick={() => handleEditThesis(thesis)}
                                style={{ marginRight: '8px' }}
                            >
                                Edit
                            </Button>
                            <Popconfirm
                                title="Are you sure you want to delete this thesis?"
                                onConfirm={() => handleDeleteThesis(thesis.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="link" danger>
                                    Delete
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </div>
            ),
        },
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#fff', padding: '16px', textAlign: 'center' }}>
                <h2>Edit Theses</h2>
            </Header>
            <Content style={{ padding: '24px', background: '#fff' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Button
                        type={filterStatus === 'all' ? 'primary' : 'default'}
                        onClick={() => handleStatusChange('all')}
                        style={{ marginRight: '8px' }}
                    >
                        All
                    </Button>
                    <Button
                        type={filterStatus === 'approved' ? 'primary' : 'default'}
                        onClick={() => handleStatusChange('approved')}
                        style={{ marginRight: '8px' }}
                    >
                        Approved
                    </Button>
                    <Button
                        type={filterStatus === 'pending' ? 'primary' : 'default'}
                        onClick={() => handleStatusChange('pending')}
                        style={{ marginRight: '8px' }}
                    >
                        Pending
                    </Button>
                    <Button
                        type={filterStatus === 'rejected' ? 'primary' : 'default'}
                        onClick={() => handleStatusChange('rejected')}
                    >
                        Rejected
                    </Button>
                </div>
                <Table columns={columns} dataSource={theses} rowKey="id" />
            </Content>
            <Modal
                title="Edit Thesis"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateThesis}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter the thesis title' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="abstract"
                        label="Abstract"
                        rules={[{ required: true, message: 'Please enter the thesis abstract' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="submission_date"
                        label="Submission Date"
                        rules={[{ required: true, message: 'Please select the submission date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="author_name"
                        label="Author Name"
                        rules={[{ required: true, message: 'Please enter the author name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="number_of_pages"
                        label="Number of Pages"
                        rules={[{ required: true, message: 'Please enter the number of pages' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="keywords" label="Keywords">
                        <Input />
                    </Form.Item>
                    <Form.Item name="abstract_file" label="Upload Abstract File">
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload Abstract PDF</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="full_text_file" label="Upload Full Text File">
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Upload Full Text PDF</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update Thesis
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
    title="View PDF"
    visible={pdfModalVisible}
    onCancel={handleClosePdfModal}
    footer={null}
    width="80%"
    bodyStyle={{ padding: 0, height: '80vh' }}
>
    <iframe
        src={pdfFilePath}
        title="PDF Viewer"
        width="100%"
        height="100%"
        frameBorder="0"
    />
</Modal>
        </Layout>
    );
};

export default EditThesis;
