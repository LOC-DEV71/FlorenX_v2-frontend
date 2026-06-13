import React, { useState, useEffect } from 'react';
import { Tabs, Card, Spin, message } from 'antd';
import BankManagement from './BankManagement';
import AIConfig from './AIConfig';
import EmailConfig from './EmailConfig';
import PolicyConfig from './PolicyConfig';
import IAMConfig from './IAMConfig';
import MediaConfig from './MediaConfig';
import PaymentConfig from './PaymentConfig';
import { getSystemConfig, updateSystemConfig } from '../../../services/admin/system.service';

const SystemManagement = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getSystemConfig();
      if (res.data.code === 200) {
        setData(res.data.data);
      }
    } catch (error) {
      message.error("Lỗi khi tải cấu hình hệ thống");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, values) => {
    try {
      const payload = { [section]: values };
      const res = await updateSystemConfig(payload);
      if (res.data.code === 200) {
        message.success("Lưu cấu hình thành công!");
        fetchData();
      } else {
        message.error("Lưu cấu hình thất bại");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi");
    }
  };

  const handleSaveMulti = async (payload) => {
    try {
      const res = await updateSystemConfig(payload);
      if (res.data.code === 200) {
        message.success("Lưu cấu hình thành công!");
        fetchData();
      } else {
        message.error("Lưu cấu hình thất bại");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi");
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '50px auto' }} />;

  const items = [
    {
      key: '1',
      label: 'Dòng tiền & Vận chuyển',
      children: <BankManagement data={data} onSave={handleSave} />,
    },
    {
      key: '2',
      label: 'Cấu hình AI Chatbox',
      children: <AIConfig data={data} onSave={(payload) => handleSaveMulti(payload)} />,
    },
    {
      key: '3',
      label: 'Máy chủ Email (SMTP)',
      children: <EmailConfig data={data?.email} onSave={(v) => handleSave('email', v)} />,
    },
    {
      key: '4',
      label: 'Chính sách & Thuế',
      children: <PolicyConfig data={data?.policy} onSave={(v) => handleSave('policy', v)} />,
    },
    {
      key: '5',
      label: 'Định danh & Truy cập (IAM)',
      children: <IAMConfig data={data?.iam} onSave={(v) => handleSave('iam', v)} />,
    },
    {
      key: '6',
      label: 'Quản lý Đa phương tiện',
      children: <MediaConfig data={data?.media} onSave={(v) => handleSave('media', v)} />,
    },
    {
      key: '7',
      label: 'Cổng Thanh toán',
      children: <PaymentConfig data={data?.payment} onSave={(v) => handleSave('payment', v)} />,
    },
  ];

  return (
    <Card title="Quản trị Hệ thống (System Settings)" bordered={false} className="system-settings-card">
      <style>{`
        .system-settings-card .ant-tabs-nav {
          position: sticky;
          top: 20px;
          align-self: flex-start;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }
        /* Ẩn thanh scrollbar cho đẹp */
        .system-settings-card .ant-tabs-nav::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
      <Tabs defaultActiveKey="2" items={items} tabPosition="left" />
    </Card>
  );
};

export default SystemManagement;
