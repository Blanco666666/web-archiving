import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Alert, Typography, Space } from 'antd';
import HeaderComponent from './layout/header';
import { Link } from 'react-router-dom';

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
            console.log('Server Response:', response.data);
    
            if (response.status === 201) {
                setSuccess('Registration successful!');
            } else {
                setError('Unexpected error occurred. Please try again.');
            }
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            setError(
                typeof err.response?.data?.error === 'string'
                    ? err.response.data.error
                    : 'Registration failed! Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
<>
<HeaderComponent />
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
                <Title level={3} style={{ textAlign: 'center' }}>
                    Register
                </Title>

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
                                    if (!value || getFieldValue('password') === value)
                                        return Promise.resolve();
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <span>Already have an account? </span>
                        <Link to="/login">Login here</Link>
                    </div>
                </Form>
            </Space>
        </div>
        </>
    );
};

export default Register;
