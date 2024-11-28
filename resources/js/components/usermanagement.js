import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Spin, Popconfirm } from 'antd';
import axios from 'axios';

const { Option } = Select;

axios.defaults.baseURL = 'http://127.0.0.1:8000'; // Set the base URL

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('Authentication token not found.');
            return;
        }

        try {
            const response = await axios.get('/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            message.error('Error fetching users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showEditModal = (user) => {
        setCurrentUser(user);
        setIsEditModalVisible(true);
    };

    const showAddModal = () => {
        setIsAddModalVisible(true);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
        setCurrentUser(null);
    };

    const handleUpdateUser = async (values) => {
        try {
            await axios.put(`/api/users/${currentUser.id}`, values);
            message.success('User updated successfully.');
            fetchUsers();
            handleCancel();
        } catch (error) {
            message.error('Failed to update user.');
        }
    };

    const handleAddUser = async (values) => {
        try {
            await axios.post('/api/users', {
                ...values,
                password: 'defaultPassword123', // Default password for new users
            });
            message.success('User added successfully.');
            fetchUsers();
            handleCancel();
        } catch (error) {
            message.error('Failed to add user.');
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`);
            message.success('User deleted successfully.');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user.');
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, user) => (
                <div>
                    <Button type="primary" onClick={() => showEditModal(user)} style={{ marginRight: '8px' }}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDeleteUser(user.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="danger">Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>User Management</h2>
            <Input
                placeholder="Search users by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            {loading ? (
                <Spin size="large" tip="Loading users..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            )}
            <Button type="primary" onClick={showAddModal} style={{ marginBottom: '16px' }}>
                Add New User
            </Button>
            <Modal
                title="Edit User"
                visible={isEditModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                {currentUser && (
                    <Form initialValues={currentUser} onFinish={handleUpdateUser}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter the name' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, message: 'Please enter the email' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role' }]}
                        >
                            <Select>
                                <Option value="user">User</Option>
                                <Option value="admin">Admin</Option>
                                <Option value="superadmin">SuperAdmin</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
            <Modal
                title="Add New User"
                visible={isAddModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form onFinish={handleAddUser}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter the email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        initialValue="user"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select>
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                            <Option value="superadmin">SuperAdmin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserManagement;
