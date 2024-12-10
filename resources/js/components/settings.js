import React from 'react';
import { Card, Form, Input, Button, Switch, message } from 'antd';
import axios from 'axios';

const Settings = () => {
    const onFinish = async (values) => {
        console.log('Settings updated:', values);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Authentication token not found.');
                return;
            }

            // Call the API to update the password
            const response = await axios.post('/api/user/change-password', {
                email: values.email,
                old_password: values.old_password,
                new_password: values.new_password,
            });

            if (response.status === 200) {
                message.success('Password updated successfully.');
            } else {
                message.error('Failed to update password.');
            }
        } catch (error) {
            console.error('Error updating password:', error.response?.data || error.message);
            message.error(
                error.response?.data?.message || 'Failed to update password. Please try again.'
            );
        }
    };

    return (
        <Card title="Settings" style={{ maxWidth: 600, margin: 'auto' }}>
<Form layout="vertical" onFinish={onFinish}>
    <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please enter your email' }]}
    >
        <Input placeholder="Enter your email" />
    </Form.Item>
    <Form.Item
        label="Old Password"
        name="old_password"
        rules={[{ required: true, message: 'Please enter your old password' }]}
    >
        <Input.Password placeholder="Enter old password" />
    </Form.Item>
    <Form.Item
        label="New Password"
        name="new_password"
        rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters long' },
        ]}
    >
        <Input.Password placeholder="Enter new password" />
    </Form.Item>
    <Form.Item>
        <Button type="primary" htmlType="submit">
            Save Settings
        </Button>
    </Form.Item>
</Form>
        </Card>
    );
};

export default Settings;
