// Settings.js

import React from 'react';
import { Card, Form, Input, Button, Switch } from 'antd';

const Settings = () => {
    const onFinish = (values) => {
        console.log('Settings updated:', values);
        // Handle the update settings API call here
    };

    return (
        <Card title="Settings" style={{ maxWidth: 600, margin: 'auto' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item label="Change Password" name="password" rules={[{ required: true, message: 'Enter new password' }]}>
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>
                <Form.Item label="Enable Notifications" name="notifications" valuePropName="checked">
                    <Switch defaultChecked />
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
