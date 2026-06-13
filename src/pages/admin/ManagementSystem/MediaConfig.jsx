import React, { useState } from 'react';
import { Form, Input, Button, Switch, Space, Typography, Card, InputNumber, Divider, Row, Col } from 'antd';
import { FaCloudUploadAlt, FaSave, FaEye, FaImages } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { requestSecretOtp, verifySecretOtp } from '../../../services/admin/system.service';

const { Text } = Typography;

const MediaConfig = ({ data, onSave }) => {
  const [form] = Form.useForm();

  const handleViewSecret = async (field, labelName) => {
    try {
        const confirm = await Swal.fire({
            title: 'Xác nhận bảo mật',
            text: `Để xem ${labelName} gốc, hệ thống sẽ gửi một mã OTP gồm 6 số về Email của bạn. Bạn có muốn tiếp tục?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Gửi mã OTP',
            cancelButtonText: 'Hủy'
        });

        if (!confirm.isConfirmed) return;

        Swal.fire({
            title: 'Đang gửi OTP...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        const res = await requestSecretOtp();
        if (res.data.code === 200) {
            Swal.close();
            const { value: otp } = await Swal.fire({
                title: 'Nhập mã OTP',
                text: res.data.message,
                input: 'text',
                inputPlaceholder: 'Nhập 6 số OTP...',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                confirmButtonColor: '#3b82f6',
            });

            if (otp) {
                Swal.fire({
                    title: 'Đang xác thực...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
                const verifyRes = await verifySecretOtp({ otp, field });
                if (verifyRes.data.code === 200) {
                    Swal.fire('Thành công!', `Đã mở khóa ${labelName} thành công.`, 'success');
                    form.setFieldsValue({ [field]: verifyRes.data.data });
                } else {
                    Swal.fire('Thất bại', verifyRes.data.message, 'error');
                }
            }
        } else {
            Swal.fire('Lỗi', res.data.message, 'error');
        }
    } catch (error) {
        Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ.', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '10px 0' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(20, 184, 166, 0.15)', border: '1px solid #ccfbf1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <FaImages style={{ fontSize: '24px', color: '#0d9488' }} />
          </div>
          <div>
            <strong style={{ fontSize: '18px', color: '#0f766e', display: 'block', marginBottom: '4px' }}>
              Quản lý Đa phương tiện (Media)
            </strong>
            <Text style={{ color: '#115e59', fontSize: '14px' }}>
              Trung tâm cấu hình máy chủ lưu trữ Đám mây (Cloudinary) để chứa ảnh sản phẩm, banner và avatar.
            </Text>
          </div>
        </div>
      </div>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onSave} 
        initialValues={{ 
          cloudinaryStatus: data?.cloudinaryStatus ?? true,
          cloudinaryCloudName: data?.cloudinaryCloudName || '',
          cloudinaryApiKey: data?.cloudinaryApiKey || '',
          cloudinaryApiSecret: data?.cloudinaryApiSecret || '',
        }}
        size="large"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left" style={{ borderColor: '#d1d5db', marginTop: 0 }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563' }}>
                <FaCloudUploadAlt style={{ color: '#0ea5e9' }} /> Cấu hình API Cloudinary
              </span>
            </Divider>
          </Col>
          
          <Col span={24}>
            <Form.Item name="cloudinaryStatus" valuePropName="checked">
              <Switch checkedChildren="Bật Lưu trữ Cloudinary" unCheckedChildren="Đang Tắt" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Cloud Name</span>} name="cloudinaryCloudName">
              <Input placeholder="Nhập Cloud Name của dự án..." style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>API Key</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="cloudinaryApiKey" noStyle>
                  <Input.Password placeholder="Nhập API Key..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
                </Form.Item>
                <Button type="default" onClick={() => handleViewSecret('cloudinaryApiKey', 'Cloudinary API Key')} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc' }}>
                  <FaEye style={{ color: '#64748b' }} />
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>API Secret</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="cloudinaryApiSecret" noStyle>
                  <Input.Password placeholder="Nhập API Secret..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
                </Form.Item>
                <Button type="default" onClick={() => handleViewSecret('cloudinaryApiSecret', 'Cloudinary API Secret')} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc' }}>
                  <FaEye style={{ color: '#64748b' }} />
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 40 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            icon={<FaSave />} 
            style={{ background: 'linear-gradient(90deg, #14b8a6 0%, #0f766e 100%)', border: 'none', height: 50, fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', boxShadow: '0 4px 14px rgba(20, 184, 166, 0.4)' }}
          >
            LƯU CẤU HÌNH ĐA PHƯƠNG TIỆN
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default MediaConfig;
