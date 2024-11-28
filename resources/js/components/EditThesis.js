import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Modal, Form, Input, DatePicker, message, Upload, Spin } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Content, Header } = Layout;

const EditThesis = () => {
  const [theses, setTheses] = useState([]); // Store fetched theses
  const [loading, setLoading] = useState(true); // Manage loading state
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [form] = Form.useForm(); // Form instance for editing
  const [fileList, setFileList] = useState([]); // Store file uploads
  const [currentThesisId, setCurrentThesisId] = useState(null); // Current thesis ID for editing

  // Fetch theses from API
  const fetchTheses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('User not authenticated. Please log in.');
        return;
      }

      const response = await axios.get('/api/theses', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setTheses(response.data);
    } catch (error) {
      console.error('Error fetching theses:', error);
      message.error('Failed to fetch theses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses(); // Fetch theses on component mount
  }, []);

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset form fields on cancel
    setFileList([]); // Reset file list
    setCurrentThesisId(null); // Reset thesis ID
  };

  const handleCreateOrUpdateThesis = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('abstract', values.abstract);
      formData.append('submission_date', values.submission_date.format('YYYY-MM-DD'));
      formData.append('author_name', values.author_name);
      formData.append('number_of_pages', values.number_of_pages);
      formData.append('status', 'pending'); // Always set to pending initially
      if (fileList.length > 0) {
        formData.append('file_path', fileList[0]);
      }

      if (currentThesisId) {
        await axios.put(`/api/theses/${currentThesisId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Thesis updated successfully.');
      } else {
        await axios.post('/api/theses', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Thesis submitted successfully and is pending approval.');
      }

      fetchTheses(); // Refresh the theses list
      handleCancel(); // Close modal after submission
    } catch (error) {
      console.error('Error submitting thesis:', error);
      message.error('Failed to submit thesis.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author_name', key: 'author_name' },
    { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, thesis) => (
        <Button type="link" onClick={() => handleEditThesis(thesis)}>Edit</Button>
      ),
    },
  ];

  // Handle editing a thesis
  const handleEditThesis = (thesis) => {
    setCurrentThesisId(thesis.id);
    form.setFieldsValue({
      title: thesis.title,
      abstract: thesis.abstract,
      submission_date: moment(thesis.submission_date),
      author_name: thesis.author_name,
      number_of_pages: thesis.number_of_pages,
    });
    setFileList([]); // Clear previous file list
    setIsModalVisible(true); // Open modal for editing
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList.map(file => file.originFileObj));

  // If still loading, show a spinner
  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Layout style={{ minHeight: '30vh' }}>
      <Layout style={{ marginLeft: 100 }}>
        <Content style={{ marginTop: 64, padding: '24px', background: '#fff' }}>
          <Table columns={columns} dataSource={theses} rowKey="id" />
        </Content>

        <Modal title={currentThesisId ? "Edit Thesis" : "Create Thesis"} visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateThesis}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the thesis title' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="abstract" label="Abstract" rules={[{ required: true, message: 'Please enter the thesis abstract' }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="submission_date" label="Submission Date" rules={[{ required: true, message: 'Please select the submission date' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="author_name" label="Author Name" rules={[{ required: true, message: 'Please enter the author name' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="number_of_pages" label="Number of Pages" rules={[{ required: true, message: 'Please enter the number of pages' }]}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="file_path" label="Upload File" rules={[{ required: currentThesisId ? false : true, message: 'Please upload the thesis file' }]}>
              <Upload fileList={fileList} onChange={handleFileChange} beforeUpload={() => false} listType="text">
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">{currentThesisId ? 'Update Thesis' : 'Submit Thesis'}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default EditThesis;
