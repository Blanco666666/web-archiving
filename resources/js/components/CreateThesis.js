import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateThesis = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleFileChange = (info) => {
        setFileList(info.fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('abstract', values.abstract);
        formData.append('submission_date', values.submission_date);
        formData.append('author_name', values.author_name);
        formData.append('number_of_pages', values.number_of_pages);
        formData.append('file_path', fileList[0]?.originFileObj); // Assuming only one file upload

        try {
            await axios.post('/api/theses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Thesis submitted successfully!');
            form.resetFields();
            setFileList([]);
        } catch (error) {
            message.error('Failed to submit thesis: ' + error.response.data.message);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Enter thesis title" />
            </Form.Item>
            <Form.Item name="abstract" label="Abstract" rules={[{ required: true }]}>
                <Input.TextArea placeholder="Enter thesis abstract" />
            </Form.Item>
            <Form.Item name="submission_date" label="Submission Date" rules={[{ required: true }]}>
                <Input type="date" />
            </Form.Item>
            <Form.Item name="author_name" label="Author Name" rules={[{ required: true }]}>
                <Input placeholder="Enter author name" />
            </Form.Item>
            <Form.Item name="number_of_pages" label="Number of Pages" rules={[{ required: true }]}>
                <Input type="number" min={1} placeholder="Enter number of pages" />
            </Form.Item>
            <Form.Item label="Upload Thesis Document">
                <Upload
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false} // Prevent automatic upload
                >
                    <Button icon={<UploadOutlined />}>Upload PDF</Button>
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Submit Thesis</Button>
            </Form.Item>
        </Form>
    );
};

export default CreateThesis;
