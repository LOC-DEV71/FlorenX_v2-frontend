import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getTiers, createTier, editTier, deleteTier } from "../../../services/admin/tier.admin.service";
import { success, error } from "../../../utils/notift";
import "./MemberTiers.scss";

const MemberTiers = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const res = await getTiers();
      if (res.data) {
        setTiers(res.data);
      }
    } catch (err) {
      error("Lỗi khi tải dữ liệu hạng thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const showModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        const res = await editTier(editingId, values);
        if (res.data.code === 200) {
          success(res.data.message);
        } else {
          error(res.data.message);
        }
      } else {
        const res = await createTier(values);
        if (res.data.code === 200) {
          success(res.data.message);
        } else {
          error(res.data.message);
        }
      }
      setIsModalVisible(false);
      fetchTiers();
    } catch (err) {
      if (err.response) {
        error(err.response.data.message || "Có lỗi xảy ra từ máy chủ");
      } else if (err.errorFields) {
        // Validation error
      } else {
        error("Có lỗi xảy ra: " + err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteTier(id);
      if (res.data.code === 200) {
        success(res.data.message);
        fetchTiers();
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Lỗi khi xóa");
    }
  };

  const columns = [
    {
      title: "Tên Hạng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <Tag color={record.slug === 'diamond' ? 'purple' : record.slug === 'gold' ? 'gold' : record.slug === 'silver' ? 'default' : 'orange'}>{text}</Tag>,
    },
    {
      title: "Mã Hạng (slug)",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Giảm Giá (%)",
      dataIndex: "discountRate",
      key: "discountRate",
      render: (text) => `${text}%`,
    },
    {
      title: "Giảm Tối Đa (VNĐ)",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Đơn Tối Thiểu (VNĐ)",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "ĐK Tổng Chi Tiêu (VNĐ)",
      dataIndex: "conditionTotalSpent",
      key: "conditionTotalSpent",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa hạng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="member-tiers-container">
      <div className="header-actions">
        <h2>Quản Lý Đặc Quyền Hạng Thành Viên</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Thêm Hạng Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tiers}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingId ? "Sửa Hạng Thành Viên" : "Thêm Hạng Mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Hạng (vd: Hạng Vàng)"
            rules={[{ required: true, message: "Vui lòng nhập tên hạng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Mã Hạng (slug) (vd: gold, silver)"
            rules={[{ required: true, message: "Vui lòng nhập mã hạng" }]}
          >
            <Input />
          </Form.Item>
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="discountRate"
              label="Giảm giá (%)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập % giảm giá" }]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="maxDiscount"
              label="Giảm Tối Đa (VNĐ)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Form.Item
              name="minOrderValue"
              label="Đơn Tối Thiểu Áp Dụng (VNĐ)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập số tiền" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="conditionTotalSpent"
              label="ĐK Tổng Chi Tiêu (VNĐ)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Vui lòng nhập điều kiện lên hạng" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberTiers;
