import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Select, Alert, Typography, Space } from 'antd';

const { Title } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const onFinish = async (values) => {
        console.log('Form Values:', values); 
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('/api/auth/signup', values);
            if (response.status === 201) {
                setSuccess('Registration successful!');
            } else {
                setError('Registration failed! Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: 400,
                margin: '50px auto',
                padding: '30px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
            }}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={3} style={{ textAlign: 'center' }}>Register</Title>

                {error && <Alert message={error} type="error" showIcon />}
                {success && <Alert message={success} type="success" showIcon />}

                <Form
                    name="register"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    style={{ marginTop: 20 }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Enter a valid email!' },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="password_confirmation"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" />
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </div>
    );
};

export default Register;
