import React, { useEffect, useState } from 'react';
import {
  ThunderboltFilled,
  CheckOutlined,
  CopyOutlined,
  CarOutlined,
  FileTextOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CreditCardOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import './OrderSuccess.scss';
import { useParams, Link } from 'react-router-dom';
import { getDetailOrder } from '../../../services/client/checkout.service';
import { error } from '../../../utils/notift';

// 1. Định nghĩa thứ tự chuẩn của enum từ Database
const ORDER_STATUS_STEPS = ["pending", "confirmed", "shipped", "done"];

// 2. Cấu hình hiển thị cho từng bước trên UI
const TIMELINE_CONFIG = [
  { key: 'pending',   label: 'Chờ xác nhận', Icon: FileTextOutlined },
  { key: 'confirmed', label: 'Xác nhận',    Icon: CheckOutlined },
  { key: 'shipped',   label: 'Vận chuyển',  Icon: CarOutlined },
  { key: 'done',      label: 'Hoàn thành',  Icon: HomeOutlined },
];

const OrderSuccess = () => {
  const { orderCode } = useParams();
  const [orders, setOrders] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getDetailOrder(orderCode);
        if (res?.data?.order) {
          setOrders(res.data.order);
        }
      } catch (err) {
        console.error(err);
        error("Lỗi lấy đơn hàng");
      }
    };
    fetchApi();
  }, [orderCode]);

  const copy = (text, setter) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Logic xử lý Timeline động
  const renderTimeline = () => {
    if (!orders) return null;

    // Tìm vị trí hiện tại của đơn hàng trong quy trình (0, 1, 2, 3)
    const currentIndex = ORDER_STATUS_STEPS.indexOf(orders.status);

    return TIMELINE_CONFIG.map((step, index) => {
      let stepStatus = "pending"; // Mặc định là bước chưa tới

      if (index < currentIndex) {
        stepStatus = "done";    // Bước đã hoàn thành
      } else if (index === currentIndex) {
        stepStatus = "active";  // Bước hiện tại
      }

      // Trường hợp đặc biệt: Nếu status là 'done' thì tất cả đều hiện 'done'
      if (orders.status === 'done') stepStatus = "done";

      return (
        <div key={step.key} className={`timeline-step ${stepStatus}`}>
          <div className="step-node">
            {stepStatus === "active" && index !== 3 ? <LoadingOutlined /> : <step.Icon />}
          </div>
          <div className="step-label">
            <span className="step-name">{step.label}</span>
            <span className="step-time">
              {stepStatus === "done" ? "Hoàn tất" : stepStatus === "active" ? "Đang xử lý" : "Chờ"}
            </span>
          </div>
        </div>
      );
    });
  };

  if (!orders) {
    return (
      <div className="loading-container">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="grid-overlay" />

      <div className="page-container">
        <section className="success-hero">
          <div className="checkmark-wrapper">
            <div className="ring-outer">
              <div className="ring-inner">
                <CheckOutlined className="check-icon" />
              </div>
            </div>
          </div>

          <h1 className="success-title">
            Đặt hàng <span className="highlight">thành công!</span>
          </h1>
          <p className="success-subtitle">
            Cảm ơn <strong>{orders.fullname}</strong>. Đơn hàng <strong>{orders.code}</strong> đang được xử lý.
            Bạn có thể kiểm qua đơn hàng qua email.
          </p>

          <div className="order-id-badge">
            <span className="label">Mã đơn hàng</span>
            <span className="value">{orders.code}</span>
            <button className="copy-btn" onClick={() => copy(orders.code, setCopied)}>
              <CopyOutlined />
            </button>
            {copied && <span className="copied-flash">Đã sao chép!</span>}
          </div>
        </section>

        <div className="order-timeline animate-in">
          <p className="timeline-header">Hành trình đơn hàng</p>
          <div className="timeline-track">
            {renderTimeline()}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default OrderSuccess;