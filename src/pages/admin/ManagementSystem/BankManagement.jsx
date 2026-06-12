import React from 'react';
import { Form, Input, Button, Table, Space, Popconfirm, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BankManagement = ({ data, onSave }) => {
  const onFinishShipping = (values) => {
    onSave('shipping', values);
  };

  const columns = [
    { title: 'Ngân hàng', dataIndex: 'bankName', key: 'bankName' },
    { title: 'Số tài khoản', dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: 'Chủ tài khoản', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (val) => <Switch checked={val} /> },
    {
      title: 'Hành động',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="text" />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?">
            <Button icon={<DeleteOutlined />} danger type="text" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Tài khoản Ngân hàng</h3>
        <Button type="primary" icon={<PlusOutlined />}>Thêm tài khoản</Button>
      </div>
      <Table columns={columns} dataSource={data?.banks || []} rowKey="_id" locale={{ emptyText: 'Chưa có tài khoản ngân hàng nào' }} pagination={false} />
      
      <div style={{ marginTop: 60, maxWidth: 600 }}>
        <h3>Cấu hình Phí Vận Chuyển</h3>
        <Form layout="vertical" onFinish={onFinishShipping} initialValues={{ 
          defaultFee: data?.shipping?.defaultFee ?? 30000, 
          freeShippingThreshold: data?.shipping?.freeShippingThreshold ?? 500000 
        }}>
          <Form.Item label="Phí ship mặc định (VND)" name="defaultFee">
            <Input type="number" placeholder="Ví dụ: 30000" />
          </Form.Item>
          <Form.Item label="Miễn phí ship cho đơn từ (VND)" name="freeShippingThreshold">
            <Input type="number" placeholder="Ví dụ: 500000" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu cấu hình vận chuyển</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default BankManagement;
