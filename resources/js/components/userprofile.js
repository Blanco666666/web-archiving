// UserProfile.js

import React from 'react';
import { Card, Form, Input, Button } from 'antd';

const UserProfile = () => {
    const onFinish = (values) => {
        console.log('Profile updated:', values);
    };

    return (
        <Card title="User Profile" style={{ maxWidth: 600, margin: 'auto' }}>
            <Form
                layout="vertical"
                name="profile"
                initialValues={{ name: 'Secret', email: 'secret@afs.com' }}
                onFinish={onFinish}
            >
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
                    <Input type="email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Profile
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UserProfile;
