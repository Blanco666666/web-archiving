import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Modal, Form, Input, DatePicker, message, Upload, Spin, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Content, Header } = Layout;

const EditThesis = () => {
  const [theses, setTheses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentThesisId, setCurrentThesisId] = useState(null);

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
          Authorization: `Bearer ${token}`,
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
    fetchTheses();
  }, []);

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
    setCurrentThesisId(null);
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
      formData.append('status', 'pending');
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

      fetchTheses();
      handleCancel();
    } catch (error) {
      console.error('Error submitting thesis:', error);
      message.error('Failed to submit thesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThesis = async (thesisId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/theses/${thesisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Thesis deleted successfully.');
      setTheses(theses.filter((thesis) => thesis.id !== thesisId));
    } catch (error) {
      console.error('Error deleting thesis:', error);
      message.error('Failed to delete thesis.');
    }
  };

  const handleEditThesis = (thesis) => {
    setCurrentThesisId(thesis.id);
    form.setFieldsValue({
      title: thesis.title,
      abstract: thesis.abstract,
      submission_date: moment(thesis.submission_date),
      author_name: thesis.author_name,
      number_of_pages: thesis.number_of_pages,
    });
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList.map((file) => file.originFileObj));

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author_name', key: 'author_name' },
    { title: 'Submission Date', dataIndex: 'submission_date', key: 'submission_date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, thesis) => (
        <div>
          <Button type="link" onClick={() => handleEditThesis(thesis)} style={{ marginRight: '8px' }}>
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
        <Table columns={columns} dataSource={theses} rowKey="id" />
      </Content>
      <Modal
        title={currentThesisId ? 'Edit Thesis' : 'Create Thesis'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdateThesis}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the thesis title' }]}>
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
          <Form.Item name="file_path" label="Upload File">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false}
              listType="text"
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentThesisId ? 'Update Thesis' : 'Submit Thesis'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default EditThesis;
