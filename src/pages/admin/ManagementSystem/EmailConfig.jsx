import React from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';

const EmailConfig = ({ data, onSave }) => {
  return (
    <div style={{ maxWidth: 600 }}>
      <Alert message="Lưu ý: Mật khẩu ở đây là 'Mật khẩu ứng dụng' (App Password) của Gmail, không phải mật khẩu đăng nhập bình thường." type="info" showIcon style={{ marginBottom: 20 }} />
      <Form layout="vertical" onFinish={onSave} initialValues={{ smtpEmail: data?.smtpEmail || '', smtpPassword: data?.smtpPassword || '', senderName: data?.senderName || '' }}>
        <Form.Item label="Email gửi đi (SMTP Email)" name="smtpEmail">
          <Input placeholder="Ví dụ: no-reply@florenx.com hoặc abc@gmail.com" />
        </Form.Item>

        <Form.Item label="Mật khẩu ứng dụng (SMTP Password)" name="smtpPassword">
          <Input.Password placeholder="Nhập mật khẩu ứng dụng 16 ký tự" />
        </Form.Item>

        <Form.Item label="Tên người gửi (Sender Name)" name="senderName">
          <Input placeholder="Ví dụ: FlorenX System" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Lưu cấu hình Email</Button>
            <Button>Gửi Email test thử</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EmailConfig;
