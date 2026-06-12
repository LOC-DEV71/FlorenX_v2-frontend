import React from 'react';
import { Form, Input, Button, Switch } from 'antd';

const PolicyConfig = ({ data, onSave }) => {
  return (
    <div style={{ maxWidth: 600 }}>
      <Form layout="vertical" onFinish={onSave} initialValues={{ 
        vatEnabled: data?.vatEnabled ?? false, 
        vatPercent: data?.vatPercent ?? 8, 
        pointEarnRatio: data?.pointEarnRatio ?? 10000, 
        pointRedeemRatio: data?.pointRedeemRatio ?? 100 
      }}>
        <Form.Item label="Tính Thuế VAT vào đơn hàng" name="vatEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Phần trăm VAT (%)" name="vatPercent">
          <Input type="number" placeholder="Ví dụ: 8 hoặc 10" />
        </Form.Item>

        <Form.Item label="Tỷ lệ Tích điểm (VND = 1 Điểm)" name="pointEarnRatio">
          <Input type="number" placeholder="Ví dụ: 10000 (Mỗi 10k được 1 điểm)" />
        </Form.Item>

        <Form.Item label="Tỷ lệ Đổi điểm (1 Điểm = VND)" name="pointRedeemRatio">
          <Input type="number" placeholder="Ví dụ: 100 (1 điểm được giảm 100đ)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Lưu chính sách</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PolicyConfig;
