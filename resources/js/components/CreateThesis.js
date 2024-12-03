import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Space } from 'antd';
import { UploadOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateThesis = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [abstractFileList, setAbstractFileList] = useState([]);
    const [authors, setAuthors] = useState([""]); // Track authors as an array

    // Function to handle author input changes
    const handleAuthorChange = (index, value) => {
        const updatedAuthors = [...authors];
        updatedAuthors[index] = value;
        setAuthors(updatedAuthors);
    };

    // Add a new author field
    const handleAddAuthor = () => {
        setAuthors([...authors, ""]); // Add an empty author input
    };

    // Remove an author field
    const handleRemoveAuthor = (index) => {
        const updatedAuthors = authors.filter((_, i) => i !== index);
        setAuthors(updatedAuthors);
    };

    const onFinish = async (values) => {
        try {
            // Ensure authors are submitted as a JSON string
            const authorsJson = JSON.stringify(authors); // Correctly stringified once
    
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('abstract', values.abstract);
            formData.append('submission_date', values.submission_date);
            formData.append('author_name', authorsJson); // Submit authors as a JSON string
            formData.append('number_of_pages', values.number_of_pages);
            formData.append('keywords', values.keywords);
    
            // Handle file uploads
            if (fileList.length > 0) {
                formData.append('file_path', fileList[0]?.originFileObj);
            } else {
                message.error('Full thesis document is required.');
                return;
            }
    
            if (abstractFileList.length > 0) {
                formData.append('abstract_file', abstractFileList[0]?.originFileObj);
            }
    
            // Submit data to the backend
            await axios.post('http://127.0.0.1:8000/api/theses', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            message.success('Thesis submitted successfully!');
            form.resetFields();
            setAuthors([""]); // Reset authors after submission
        } catch (error) {
            console.error('Error submitting thesis:', error);
            message.error('Failed to submit thesis: ' + (error.response?.data?.message || 'Unknown error'));
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
            <Form.Item label="Authors" rules={[{ required: true }]}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    {authors.map((author, index) => (
                        <Space key={index} style={{ display: 'flex', marginBottom: 8 }}>
                            <Input
                                value={author}
                                onChange={(e) => handleAuthorChange(index, e.target.value)}
                                placeholder={`Author ${index + 1}`}
                            />
                            {authors.length > 1 && (
                                <MinusCircleOutlined onClick={() => handleRemoveAuthor(index)} />
                            )}
                        </Space>
                    ))}
                    <Button
                        type="dashed"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddAuthor}
                    >
                        Add Author
                    </Button>
                </Space>
            </Form.Item>

            <Form.Item name="number_of_pages" label="Number of Pages" rules={[{ required: true }]}>
                <Input type="number" min={1} placeholder="Enter number of pages" />
            </Form.Item>

            <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}>
                <Input placeholder="Enter keywords, separated by commas" />
            </Form.Item>

            <Form.Item label="Upload Full Thesis Document" rules={[{ required: true }]}>
                <Upload
                    fileList={fileList}
                    onChange={(info) => setFileList(info.fileList)}
                    beforeUpload={() => false} // Prevent automatic upload
                >
                    <Button icon={<UploadOutlined />}>Upload Full Thesis PDF</Button>
                </Upload>
            </Form.Item>

            <Form.Item label="Upload Abstract Document (Optional)">
                <Upload
                    fileList={abstractFileList}
                    onChange={(info) => setAbstractFileList(info.fileList)}
                    beforeUpload={() => false} // Prevent automatic upload
                >
                    <Button icon={<UploadOutlined />}>Upload Abstract PDF (Optional)</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit Thesis
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateThesis;
