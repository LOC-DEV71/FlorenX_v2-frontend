import React, { useState, useEffect } from "react";
import { Switch, Typography, Divider, Button } from "antd";

const { Title, Text } = Typography;

const MaintenanceConfig = ({ systemData, onSave, hasPermission = () => true }) => {
  const [maintenance, setMaintenance] = useState({
    blockAuth: false,
    blockCart: false,
    blockCheckout: false,
    blockOrders: false,
    blockReviews: false,
    blockAi: false,
  });

  useEffect(() => {
    if (systemData?.maintenance) {
      setMaintenance(systemData.maintenance);
    }
  }, [systemData]);

  const handleToggle = (key, checked) => {
    setMaintenance((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSave = () => {
    onSave(maintenance);
  };

  return (
    <div className="config-section">
      <div className="section-header">
        <Title level={4}>Chế Độ Bảo Trì (Maintenance Mode)</Title>
        <Text type="secondary">
          Bật các công tắc dưới đây để chặn tạm thời các tính năng trên trang Client. Khách hàng sẽ chỉ xem được thông tin mà không thể thao tác các tính năng bị chặn (View-only Mode).
        </Text>
      </div>

      <Divider />

      <div className="config-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Đăng nhập & Đăng ký</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Chặn toàn bộ truy cập vào module Xác thực</div>
            </div>
            <Switch
              checked={maintenance.blockAuth}
              onChange={(checked) => handleToggle("blockAuth", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>

        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Thêm Giỏ Hàng</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Ngăn khách hàng thêm sản phẩm mới vào giỏ</div>
            </div>
            <Switch
              checked={maintenance.blockCart}
              onChange={(checked) => handleToggle("blockCart", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>

        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Đặt Hàng & Thanh Toán</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Ngăn khách hàng tạo đơn hàng và thanh toán</div>
            </div>
            <Switch
              checked={maintenance.blockCheckout}
              onChange={(checked) => handleToggle("blockCheckout", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>

        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Quản Lý Đơn Hàng</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Chặn xem lịch sử và hủy đơn hàng</div>
            </div>
            <Switch
              checked={maintenance.blockOrders}
              onChange={(checked) => handleToggle("blockOrders", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>

        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Đánh Giá Sản Phẩm</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Chặn khách hàng gửi bình luận, đánh giá</div>
            </div>
            <Switch
              checked={maintenance.blockReviews}
              onChange={(checked) => handleToggle("blockReviews", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>

        <div className="config-card" style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Chặn Trợ Lý Ảo AI</strong>
              <div style={{ fontSize: '12px', color: '#888' }}>Tạm tắt tính năng Veltrix-chan tư vấn</div>
            </div>
            <Switch
              checked={maintenance.blockAi}
              onChange={(checked) => handleToggle("blockAi", checked)}
              disabled={!hasPermission("system_edit")}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleSave}
          disabled={!hasPermission("system_edit")}
        >
          Lưu Cấu Hình Bảo Trì
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceConfig;
