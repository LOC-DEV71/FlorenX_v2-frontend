import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space, Typography, Card, message } from 'antd';
import { FaEnvelope, FaKey, FaUserTag, FaPaperPlane, FaSave, FaServer, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { testEmailConfig, requestSecretOtp, verifySecretOtp } from '../../../services/admin/system.service';

const { Text } = Typography;

const EmailConfig = ({ data, onSave }) => {
  const [form] = Form.useForm();
  const [loadingTest, setLoadingTest] = useState(false);

  const handleTestEmail = async () => {
    const { value: email } = await Swal.fire({
      title: 'Nhập Email nhận Test',
      input: 'email',
      inputLabel: 'Hệ thống sẽ gửi một email thử nghiệm đến địa chỉ này để xác nhận cấu hình SMTP.',
      inputPlaceholder: 'Ví dụ: hotro.khachhang@gmail.com',
      showCancelButton: true,
      confirmButtonText: 'Gửi Test',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3b82f6',
    });

    if (email) {
      setLoadingTest(true);
      try {
        const res = await testEmailConfig({ email });
        if (res.data.code === 200) {
          Swal.fire('Thành công!', res.data.message, 'success');
        } else {
          Swal.fire('Thất bại!', res.data.message, 'error');
        }
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể kết nối đến máy chủ.', 'error');
      } finally {
        setLoadingTest(false);
      }
    }
  };

  const handleViewSmtpPassword = async () => {
    try {
        const confirm = await Swal.fire({
            title: 'Xác nhận bảo mật',
            text: 'Để xem Mật khẩu ứng dụng gốc, hệ thống sẽ gửi một mã OTP gồm 6 số về Email của bạn. Bạn có muốn tiếp tục?',
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
                const verifyRes = await verifySecretOtp({ otp, field: 'smtpPassword' });
                if (verifyRes.data.code === 200) {
                    Swal.fire('Thành công!', 'Đã mở khóa Mật khẩu ứng dụng thành công.', 'success');
                    form.setFieldsValue({ smtpPassword: verifyRes.data.data });
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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '10px 0' }}>
      <div style={{ marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)', border: '1px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <FaServer style={{ fontSize: '24px', color: '#16a34a' }} />
          </div>
          <div>
            <strong style={{ fontSize: '18px', color: '#166534', display: 'block', marginBottom: '4px' }}>
              Máy Chủ Gửi Email (SMTP Server)
            </strong>
            <Text style={{ color: '#15803d', fontSize: '14px' }}>
              Được sử dụng để tự động gửi thông báo đơn hàng, mã xác nhận, và khôi phục mật khẩu cho Khách hàng.
            </Text>
          </div>
        </div>
      </div>

      <Alert 
        message={<strong>Lưu ý Quan Trọng!</strong>} 
        description="Mật khẩu SMTP không phải là mật khẩu đăng nhập Gmail thông thường. Sếp cần bật Xác minh 2 bước trên Google và tạo 'Mật khẩu ứng dụng' (App Password) gồm 16 chữ cái để điền vào đây nha." 
        type="warning" 
        showIcon 
        style={{ marginBottom: 24, borderRadius: '8px', border: '1px solid #fde047' }} 
      />

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onSave} 
        initialValues={{ 
          smtpEmail: data?.smtpEmail || '', 
          smtpPassword: data?.smtpPassword || '', 
          senderName: data?.senderName || 'FlorenX System' 
        }}
        size="large"
      >
        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaEnvelope style={{color: '#ea4335', fontSize: '18px'}}/> Email Gửi Đi (SMTP Email)</span>} 
          name="smtpEmail"
          rules={[{ required: true, message: 'Vui lòng nhập Email' }, { type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Ví dụ: hotro.florenx@gmail.com" style={{ borderRadius: '8px' }} />
        </Form.Item>

        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaKey style={{color: '#f59e0b', fontSize: '18px'}}/> Mật khẩu Ứng dụng (SMTP Password)</span>} 
          tooltip="Mật khẩu 16 ký tự do Google cung cấp. Cần nhập OTP để xem mã gốc."
          required
        >
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="smtpPassword" noStyle rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu ứng dụng' }]}>
              <Input.Password placeholder="Nhập mật khẩu 16 ký tự do Google cấp..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
            </Form.Item>
            <Button type="default" onClick={handleViewSmtpPassword} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc', borderColor: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaEye style={{ fontSize: '16px', color: '#64748b' }} /> Xem Mã
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaUserTag style={{color: '#3b82f6', fontSize: '18px'}}/> Tên Người Gửi (Sender Name)</span>} 
          name="senderName"
        >
          <Input placeholder="Ví dụ: CSKH FlorenX" style={{ borderRadius: '8px' }} />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px', marginTop: 40 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            icon={<FaSave />} 
            style={{ flex: 1, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', border: 'none', height: 50, fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
          >
            LƯU CẤU HÌNH EMAIL
          </Button>
          
          <Button 
            size="large" 
            icon={<FaPaperPlane />} 
            onClick={handleTestEmail}
            loading={loadingTest}
            style={{ width: '200px', height: 50, fontSize: '15px', fontWeight: '600', borderRadius: '10px', color: '#0284c7', borderColor: '#38bdf8' }}
          >
            Gửi Email Test
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmailConfig;
