import React, { useState } from 'react';
import { Form, Input, Button, Switch, Space, Typography, Card, InputNumber, Divider, Row, Col } from 'antd';
import { FaShieldAlt, FaGoogle, FaFacebook, FaClock, FaLock, FaSave, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { requestSecretOtp, verifySecretOtp } from '../../../services/admin/system.service';

const { Text } = Typography;

const IAMConfig = ({ data, onSave }) => {
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
      <div style={{ marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg, #fdf4ff 0%, #f5d0fe 100%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(217, 70, 239, 0.15)', border: '1px solid #f5d0fe' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <FaShieldAlt style={{ fontSize: '24px', color: '#c026d3' }} />
          </div>
          <div>
            <strong style={{ fontSize: '18px', color: '#86198f', display: 'block', marginBottom: '4px' }}>
              Quản lý Định danh & Truy cập (IAM)
            </strong>
            <Text style={{ color: '#a21caf', fontSize: '14px' }}>
              Trung tâm kiểm soát phương thức đăng nhập, bảo mật phiên làm việc và chính sách tài khoản của toàn hệ thống.
            </Text>
          </div>
        </div>
      </div>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onSave} 
        initialValues={{ 
          googleStatus: data?.googleStatus ?? true,
          googleClientId: data?.googleClientId || '',
          jwtExpiresIn: data?.jwtExpiresIn ?? 7,
          jwtSecret: data?.jwtSecret || '',
          pwdMinLength: data?.pwdMinLength ?? 8,
          pwdRequireSpecial: data?.pwdRequireSpecial ?? true
        }}
        size="large"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Divider orientation="left" style={{ borderColor: '#d1d5db', marginTop: 0 }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563' }}>
                <FaGoogle style={{ color: '#ea4335' }} /> Đăng Nhập bằng Google (OAuth 2.0)
              </span>
            </Divider>
          </Col>
          
          <Col span={24}>
            <Form.Item name="googleStatus" valuePropName="checked">
              <Switch checkedChildren="Bật Đăng nhập Google" unCheckedChildren="Đang Tắt" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Google Client ID</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="googleClientId" noStyle>
                  <Input.Password placeholder="Nhập Client ID..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
                </Form.Item>
                <Button type="default" onClick={() => handleViewSecret('googleClientId', 'Google Client ID')} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc' }}>
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
                <FaClock style={{ color: '#0ea5e9' }} /> Phiên đăng nhập (Session & Token)
              </span>
            </Divider>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label={<span style={{ fontWeight: '600' }}>Thời gian sống của JWT (Ngày)</span>} 
              name="jwtExpiresIn"
              tooltip="Khách hàng sẽ bị đăng xuất sau số ngày này."
            >
              <InputNumber min={1} max={365} style={{ width: '100%', borderRadius: '8px' }} addonAfter="Ngày" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Chuỗi bí mật (JWT Secret)</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="jwtSecret" noStyle>
                  <Input.Password placeholder="Chuỗi ký mã thông báo..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
                </Form.Item>
                <Button type="default" onClick={() => handleViewSecret('jwtSecret', 'Chuỗi bí mật (JWT)')} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc' }}>
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
                <FaLock style={{ color: '#eab308' }} /> Chính sách Mật khẩu
              </span>
            </Divider>
          </Col>

          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Độ dài tối thiểu</span>} name="pwdMinLength">
              <InputNumber min={6} max={32} style={{ width: '100%', borderRadius: '8px' }} addonAfter="Ký tự" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<span style={{ fontWeight: '600' }}>Ký tự đặc biệt (@, #, $)</span>} name="pwdRequireSpecial" valuePropName="checked">
              <Switch checkedChildren="Bắt buộc" unCheckedChildren="Không bắt buộc" />
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
            style={{ background: 'linear-gradient(90deg, #d946ef 0%, #a21caf 100%)', border: 'none', height: 50, fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', boxShadow: '0 4px 14px rgba(217, 70, 239, 0.4)' }}
          >
            LƯU CẤU HÌNH ĐỊNH DANH (IAM)
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default IAMConfig;
