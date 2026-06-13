import React, { useState, useRef } from 'react';
import { Form, Input, Button, Select, Switch, Tag, Progress, Space, InputNumber, Divider, Typography, Upload, Avatar, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FaRobot, FaMagic, FaChartLine, FaListUl, FaSave, FaGoogle, FaEye } from 'react-icons/fa';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
import Swal from 'sweetalert2';
import { requestSecretOtp, verifySecretOtp } from '../../../services/admin/system.service';

const AIConfig = ({ data, onSave }) => {
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState(data?.ai?.botAvatar || '');
  const botAvatarFileRef = useRef(null);

  const onFinish = (values) => {
    let modelValue = values.model;
    if (Array.isArray(modelValue)) {
      modelValue = modelValue[0] || '';
    }
    const aiData = { 
        status: values.status, 
        apiKey: values.apiKey, 
        model: modelValue, 
        prompt: values.prompt,
        requestsToday: aiConfig.requestsToday || 0,
        lastResetDate: aiConfig.lastResetDate || new Date()
    };
    // Xử lý avatar: giữ cũ / upload mới / xóa
    if (botAvatarFileRef.current) {
      // Có file mới → sẽ upload qua FormData, không cần gán ở đây
    } else if (avatarPreview && aiConfig.botAvatar) {
      aiData.botAvatar = aiConfig.botAvatar; // Giữ nguyên avatar cũ
    } else {
      aiData.botAvatar = ''; // Đã xóa avatar
    }
    const aiModels = values.aiModels || [];
    onSave({ ai: aiData, aiModels }, botAvatarFileRef.current);
  };

  const aiConfig = data?.ai || {};
  const aiModelsList = data?.aiModels || [];
  const initialModel = aiConfig.model ? [aiConfig.model] : [];

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    
    return (
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3, padding: '4px 10px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '6px', border: '1px solid #d9d9d9' }}>
        <span style={{ fontWeight: 500 }}>{value}</span>
        <Tag color="green" style={{ margin: 0, border: 'none', borderRadius: '4px' }}>[ Free ]</Tag>
      </Tag>
    );
  };

  const getModelLimit = (modelStr) => {
    const found = aiModelsList.find(m => m.code === modelStr);
    return found ? found.dailyLimit : 20;
  };

  const actualLimit = getModelLimit(aiConfig.model);
  const requestsToday = aiConfig.requestsToday ?? 0;
  const percent = actualLimit > 0 ? Math.min(Math.round((requestsToday / actualLimit) * 100), 100) : 0;

  const handleViewApiKey = async () => {
    try {
        const confirm = await Swal.fire({
            title: 'Xác nhận bảo mật',
            text: 'Để xem mã API Key gốc, hệ thống sẽ gửi một mã OTP gồm 6 số về Email của bạn. Bạn có muốn tiếp tục?',
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
                const verifyRes = await verifySecretOtp({ otp, field: 'apiKey' });
                if (verifyRes.data.code === 200) {
                    Swal.fire('Thành công!', 'Đã mở khóa API Key thành công.', 'success');
                    form.setFieldsValue({ apiKey: verifyRes.data.data });
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
      
      {/* Progress Bar Section */}
      <div style={{ marginBottom: 32, padding: '20px 24px', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', borderRadius: 12, boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)', border: '1px solid #bae6fd' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
          <strong style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 10, color: '#0369a1' }}>
            <FaChartLine style={{ fontSize: '20px' }} />
            Hạn mức Quota Google (Theo Model đang dùng)
          </strong>
          <span style={{ 
            color: percent >= 100 ? '#ef4444' : '#0284c7', 
            fontWeight: 'bold',
            background: 'white',
            padding: '6px 16px',
            borderRadius: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            {requestsToday} / {actualLimit} lượt
          </span>
        </div>
        <Progress percent={percent} status={percent >= 100 ? 'exception' : 'active'} strokeColor={{ '0%': '#38bdf8', '100%': '#0284c7' }} strokeWidth={12} />
      </div>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={onFinish} 
        initialValues={{ 
          status: aiConfig.status ?? true, 
          apiKey: aiConfig.apiKey || '',
          model: initialModel, 
          prompt: aiConfig.prompt || '',
          aiModels: aiModelsList
        }}
        size="large"
      >
        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaRobot style={{color: '#8b5cf6', fontSize: '18px'}}/> Trạng thái Chatbot AI</span>} 
          name="status" 
          valuePropName="checked"
        >
          <Switch checkedChildren="Bật (Active)" unCheckedChildren="Tắt (Disabled)" style={{ background: aiConfig.status ? '#10b981' : undefined }} />
        </Form.Item>

        {/* Avatar cho Bot AI */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px', marginBottom: 12 }}>
            <FaRobot style={{ color: '#ec4899', fontSize: '18px' }} /> Avatar Bot AI
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 400 }}>(Hiển thị khi AI trả lời đánh giá sản phẩm)</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Avatar 
              src={avatarPreview || undefined} 
              size={72} 
              style={{ 
                border: '3px solid #e5e7eb', 
                background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                fontSize: '28px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
              }}
            >
              {!avatarPreview && '🤖'}
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Upload
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ được upload file ảnh!');
                    return Upload.LIST_IGNORE;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    message.error('Ảnh phải nhỏ hơn 2MB!');
                    return Upload.LIST_IGNORE;
                  }
                  botAvatarFileRef.current = file;
                  setAvatarPreview(URL.createObjectURL(file));
                  return false; // Ngăn upload tự động
                }}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ borderRadius: '8px' }}>
                  Chọn ảnh đại diện
                </Button>
              </Upload>
              {avatarPreview && (
                <Button 
                  type="link" 
                  danger 
                  size="small" 
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => {
                    botAvatarFileRef.current = null;
                    setAvatarPreview('');
                  }}
                >
                  Xóa avatar
                </Button>
              )}
            </div>
          </div>
        </div>

        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaMagic style={{color: '#3b82f6', fontSize: '18px'}}/> Google AI API Key</span>} 
          tooltip="Lấy mã này tại Google AI Studio để Chatbot hoạt động. Cần nhập OTP để xem mã gốc."
          required
        >
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item name="apiKey" noStyle rules={[{ required: true, message: 'Vui lòng nhập API Key' }]}>
              <Input.Password placeholder="Nhập API Key bắt đầu bằng AIzaSy..." style={{ borderRadius: '8px 0 0 8px', width: '100%' }} />
            </Form.Item>
            <Button type="default" onClick={handleViewApiKey} style={{ borderRadius: '0 8px 8px 0', background: '#f8fafc', borderColor: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaEye style={{ fontSize: '16px', color: '#64748b' }} /> Xem Mã
            </Button>
          </Space.Compact>
        </Form.Item>
        
        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaGoogle style={{color: '#fbbc05', fontSize: '18px'}}/> Chọn Model Google AI</span>} 
          name="model" 
          tooltip="Danh sách Model này được đồng bộ từ Bảng Quản lý phía dưới."
        >
          <Select mode="tags" maxCount={1} placeholder="Nhập hoặc chọn Model..." tagRender={tagRender} optionLabelProp="value" style={{ width: '100%' }}>
            {aiModelsList.map(m => (
              <Option key={m.code} value={m.code}>
                <Space>
                  <Text strong>{m.name}</Text>
                  <Tag color="success" style={{ borderRadius: '4px' }}>Limit: {m.dailyLimit}/ngày</Tag>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label={<span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8, fontSize: '15px' }}><FaMagic style={{color: '#ec4899', fontSize: '18px'}}/> Thiết lập Nhân cách (System Prompt)</span>} 
          name="prompt" 
          tooltip="Dạy AI cách xưng hô và tư vấn bán hàng."
        >
          <TextArea rows={10} placeholder="Ví dụ: Tên bạn là Veltrix-chan..." style={{ borderRadius: '8px', padding: '12px', fontSize: '14px' }} />
        </Form.Item>

        <Divider orientation="left" style={{ borderColor: '#d1d5db', marginTop: 40 }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563' }}>
            <FaListUl style={{ color: '#10b981' }} /> Quản lý Danh sách Model
          </span>
        </Divider>

        <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
          <Form.List name="aiModels">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 12 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'code']}
                      rules={[{ required: true, message: 'Thiếu mã model' }]}
                    >
                      <Input placeholder="Mã Code (VD: gemini-4)" style={{ width: 230 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Thiếu tên' }]}
                    >
                      <Input placeholder="Tên hiển thị (Tự do)" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'dailyLimit']}
                      rules={[{ required: true, message: 'Thiếu Quota' }]}
                    >
                      <InputNumber placeholder="Quota" style={{ width: 100 }} />
                    </Form.Item>
                    <Button type="text" danger icon={<MinusCircleOutlined style={{ fontSize: '16px' }} />} onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item style={{ margin: 0, marginTop: 16 }}>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: 40, color: '#10b981', borderColor: '#10b981', fontWeight: 500, borderRadius: '8px' }}>
                    Thêm Model mới
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>

        <Form.Item style={{ marginTop: 40 }}>
          <Button type="primary" htmlType="submit" size="large" block icon={<FaSave />} style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', border: 'none', height: 50, fontSize: '16px', fontWeight: 'bold', borderRadius: '10px', boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)' }}>
            LƯU TẤT CẢ CẤU HÌNH AI
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AIConfig;
