// UserProfile.js

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Spin } from 'antd';
import axios from 'axios';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        // Fetch user profile data on load
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    message.error('User not authenticated. Please log in.');
                    return;
                }

                const response = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                form.setFieldsValue({
                    full_name: response.data.full_name,
                    email: response.data.email,
                    course: response.data.course,
                    school: response.data.school,
                    id: response.data.id || '',
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                message.error('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('User not authenticated. Please log in.');
                return;
            }

            await axios.put('/api/user/profile', values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            message.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="User Profile" style={{ maxWidth: 600, margin: 'auto' }}>
            {loading ? (
                <div style={{ textAlign: 'center', margin: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Form
                    layout="vertical"
                    form={form}
                    name="profile"
                    onFinish={onFinish}
                    initialValues={{
                        full_name: '',
                        email: '',
                        course: '',
                        school: '',
                        id: '',
                    }}
                >
                    <Form.Item
                        label="Full Name"
                        name="full_name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                    >
                        <Input type="email" disabled />
                    </Form.Item>
                    <Form.Item
                        label="Course"
                        name="course"
                        rules={[{ required: true, message: 'Please select your course' }]}
                    >
                        <Select placeholder="Select your course">
                            <Select.Option value="CS">Computer Science</Select.Option>
                            <Select.Option value="IT">Information Technology</Select.Option>
                            <Select.Option value="ENG">Engineering</Select.Option>
                            {/* Add more options as needed */}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="School"
                        name="school"
                        rules={[{ required: true, message: 'Please enter your school' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="ID (Optional)" name="id">
                        <Input placeholder="Enter your ID (optional)" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Card>
    );
};

export default UserProfile;
