import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, Popconfirm, Switch, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const BankManagement = ({ data, onSave }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [banksList, setBanksList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (data?.banks) {
      setBanksList(data.banks);
    }
  }, [data]);

  const onFinishShipping = (values) => {
    onSave('shipping', values);
  };

  const handleAdd = () => {
    setEditingBank(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBank(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    const newBanks = banksList.filter(item => item !== record);
    setBanksList(newBanks);
    onSave('banks', newBanks);
  };

  const handleModalSave = async () => {
    try {
      const values = await form.validateFields();
      let newBanks = [...banksList];
      
      if (editingBank) {
        // If it's a new bank without _id, we match by object identity or index. But we have editingBank.
        newBanks = newBanks.map(item => item === editingBank ? { ...item, ...values } : item);
      } else {
        newBanks.push({ ...values });
      }
      
      setBanksList(newBanks);
      onSave('banks', newBanks);
      setIsModalVisible(false);
    } catch (error) {
      console.log('Validation Failed:', error);
    }
  };

  const handleStatusChange = (checked, record) => {
    const newBanks = banksList.map(item => item === record ? { ...item, status: checked } : item);
    setBanksList(newBanks);
    onSave('banks', newBanks);
  };

  const columns = [
    { title: 'Ngân hàng', dataIndex: 'bankName', key: 'bankName' },
    { title: 'Số tài khoản', dataIndex: 'accountNumber', key: 'accountNumber' },
    { title: 'Chủ tài khoản', dataIndex: 'accountName', key: 'accountName' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (val, record) => <Switch checked={val} onChange={(c) => handleStatusChange(c, record)} /> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} type="text" onClick={() => handleEdit(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa thẻ này?" onConfirm={() => handleDelete(record)}>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm tài khoản</Button>
      </div>
      <Table columns={columns} dataSource={banksList} rowKey={(record, idx) => record._id || idx} locale={{ emptyText: 'Chưa có tài khoản ngân hàng nào' }} pagination={false} />
      
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

      <Modal
        title={editingBank ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
        open={isModalVisible}
        onOk={handleModalSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" initialValues={{ status: true }}>
          <Form.Item name="bankName" label="Tên ngân hàng (VD: Vietcombank, MBBank)" rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}>
            <Input placeholder="Nhập tên ngân hàng..." />
          </Form.Item>
          <Form.Item name="accountNumber" label="Số tài khoản" rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}>
            <Input placeholder="Nhập số tài khoản..." />
          </Form.Item>
          <Form.Item name="accountName" label="Chủ tài khoản" rules={[{ required: true, message: 'Vui lòng nhập chủ tài khoản' }]}>
            <Input placeholder="Nhập tên chủ tài khoản..." />
          </Form.Item>
          <Form.Item name="qrCode" label="Đường dẫn ảnh QR Code (Tùy chọn)">
            <Input placeholder="Nhập URL ảnh QR..." />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm ẩn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BankManagement;
