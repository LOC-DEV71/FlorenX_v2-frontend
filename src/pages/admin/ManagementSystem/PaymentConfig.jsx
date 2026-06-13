import React, { useState } from 'react';
import { Form, Input, Button, Switch, Space, Typography, Card, Divider, Row, Col } from 'antd';
import { FaPaypal, FaSave, FaEye, FaCreditCard } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { requestSecretOtp, verifySecretOtp } from '../../../services/admin/system.service';

const { Text } = Typography;

const PaymentConfig = ({ data, onSave }) => {
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
      <div style={{ marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)', border: '1px solid #bfdbfe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <FaCreditCard style={{ fontSize: '24px', color: '#2563eb' }} />
          </div>
          <div>
            <strong style={{ fontSize: '18px', color: '#1e40af', display: 'block', marginBottom: '4px' }}>
              Quản lý Cổng Thanh toán Điện tử
            </strong>
            <Text style={{ color: '#1d4ed8', fontSize: '14px' }}>
              Trung tâm cấu hình và kết nối các cổng thanh toán quốc tế và nội địa (PayPal, MoMo...).
            </Text>
          </div>
        </div>
      </div>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onSave} 
        initialValues={{ 
          paypalStatus: data?.paypalStatus ?? true,
          paypalClientId: data?.paypalClientId || '',
          paypalClientSecret: data?.paypalClientSecret || '',
          bankTransferStatus: data?.bankTransferStatus ?? true,
        }}
        size="large"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left" style={{ borderColor: '#d1d5db', marginTop: 0 }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563' }}>
                <FaPaypal style={{ color: '#003087' }} /> Cấu hình API PayPal
              </span>
            </Divider>
          </Col>
          
          <Col span={24}>
            <Form.Item name="paypalStatus" valuePropName="checked">
              <Switch checkedChildren="Bật thanh toán PayPal" unCheckedChildren="Đang Tắt" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Client ID</span>} name="paypalClientId">
              <Input placeholder="Nhập PayPal Client ID..." style={{ borderRadius: '8px' }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Client Secret</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="paypalClientSecret" noStyle>
                  <Input.Password placeholder="Nhập PayPal Client Secret..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
                </Form.Item>
                <Button type="default" onClick={() => handleViewSecret('paypalClientSecret', 'PayPal Client Secret')} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc' }}>
                  <FaEye style={{ color: '#64748b' }} />
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Divider orientation="left" style={{ borderColor: '#d1d5db' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563' }}>
                <div style={{ background: '#16a34a', borderRadius: 4, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 12 }}>B</div> Chuyển khoản Ngân hàng (Bank Transfer)
              </span>
            </Divider>
          </Col>
          
          <Col span={24}>
            <Form.Item name="bankTransferStatus" valuePropName="checked">
              <Switch checkedChildren="Bật thanh toán Chuyển khoản" unCheckedChildren="Đang Tắt" />
            </Form.Item>
            <Text type="secondary" style={{ fontStyle: 'italic', display: 'block', marginTop: 8 }}>
              Ghi chú: Để quản lý danh sách Thẻ/Tài khoản ngân hàng, vui lòng chuyển sang <b>Tab 1: Dòng tiền & Vận chuyển</b>.
            </Text>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 40 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            icon={<FaSave />} 
            style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)', border: 'none', height: 50, fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            LƯU CẤU HÌNH THANH TOÁN
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default PaymentConfig;
