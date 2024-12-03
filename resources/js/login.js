import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Checkbox, Alert, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './layout/header';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('/api/auth/login', values);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setSuccess(true);

            // Role-based navigation
            if (user.role === 'superadmin') navigate('/superadmin-dashboard');
            else if (user.role === 'admin') navigate('/admin-dashboard');
            else navigate('/user-dashboard');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
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
                <Title level={3} style={{ textAlign: 'center' }}>Login</Title>

                {error && <Alert message={error} type="error" showIcon />}
                {success && <Alert message="Login successful!" type="success" showIcon />}

                <Form
                    name="login"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    style={{ marginTop: 20 }}
                >
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

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <span>Don't have an account? </span>
                        <Link to="/register">Register here</Link>
                    </div>
                </Form>
            </Space>
        </div>
        </>
    );
};

export default Login;
