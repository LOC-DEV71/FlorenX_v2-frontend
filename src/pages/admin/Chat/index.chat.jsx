import React from "react";
import "./CustomerSupportChat.scss";

const conversationList = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    lastMessage: "Mình cần kiểm tra lại đơn hàng hôm qua.",
    time: "2 phút",
    unread: 3,
    active: true,
    status: "online",
  },
  {
    id: 2,
    name: "Trần Hoàng Phúc",
    lastMessage: "Shop hỗ trợ đổi size giúp mình nhé.",
    time: "10 phút",
    unread: 0,
    status: "offline",
  },
  {
    id: 3,
    name: "Lê Bảo Ngọc",
    lastMessage: "Mình chưa nhận được email xác nhận.",
    time: "25 phút",
    unread: 1,
    status: "online",
  },
  {
    id: 4,
    name: "Phạm Quốc Huy",
    lastMessage: "Voucher của mình không dùng được.",
    time: "1 giờ",
    unread: 0,
    status: "away",
  },
];

const messages = [
  {
    id: 1,
    type: "customer",
    text: "Chào shop, mình muốn hỏi đơn hàng #VLX1024 đã giao chưa ạ?",
    time: "09:12",
  },
  {
    id: 2,
    type: "admin",
    text: "Em chào anh/chị, để em kiểm tra đơn hàng giúp mình ngay nhé.",
    time: "09:13",
  },
  {
    id: 3,
    type: "customer",
    text: "Mình đặt từ hôm kia nhưng app vẫn báo đang xử lý.",
    time: "09:14",
  },
  {
    id: 4,
    type: "admin",
    text: "Dạ em đã ghi nhận. Tạm thời hệ thống đang cập nhật trạng thái vận chuyển nên có thể bị chậm hiển thị.",
    time: "09:16",
  },
];

function CustomerSupportChat() {
  return (
    <div className="customer-support-chat-page">
      <div className="customer-support-chat-page__header">
        <div>
          <h1>Chat chăm sóc khách hàng</h1>
          <p>Quản lý hội thoại, hỗ trợ khách hàng và theo dõi trạng thái phản hồi.</p>
        </div>

        <div className="customer-support-chat-page__header-actions">
          <button className="btn btn--ghost">Xuất hội thoại</button>
          <button className="btn btn--primary">Tạo ticket</button>
        </div>
      </div>

      <div className="customer-support-chat-page__stats">
        <div className="stat-card">
          <span className="stat-card__label">Đang chờ phản hồi</span>
          <strong className="stat-card__value">24</strong>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Đang online</span>
          <strong className="stat-card__value">08</strong>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Đã xử lý hôm nay</span>
          <strong className="stat-card__value">156</strong>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Đánh giá hài lòng</span>
          <strong className="stat-card__value">94%</strong>
        </div>
      </div>

      <div className="customer-support-chat-layout">
        <aside className="chat-sidebar">
          <div className="chat-sidebar__top">
            <div className="chat-search">
              <input type="text" placeholder="Tìm theo tên, SĐT, mã đơn..." />
            </div>

            <div className="chat-filter">
              <button className="chat-filter__item active">Tất cả</button>
              <button className="chat-filter__item">Chưa đọc</button>
              <button className="chat-filter__item">Ưu tiên</button>
            </div>
          </div>

          <div className="chat-conversation-list">
            {conversationList.map((item) => (
              <div
                key={item.id}
                className={`chat-conversation-item ${item.active ? "active" : ""}`}
              >
                <div className="chat-conversation-item__avatar">
                  {item.name.charAt(0)}
                  <span className={`status-dot ${item.status}`}></span>
                </div>

                <div className="chat-conversation-item__content">
                  <div className="chat-conversation-item__row">
                    <h4>{item.name}</h4>
                    <span className="time">{item.time}</span>
                  </div>

                  <div className="chat-conversation-item__row">
                    <p>{item.lastMessage}</p>
                    {item.unread > 0 && <span className="badge">{item.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="chat-main">
          <div className="chat-main__header">
            <div className="chat-user">
              <div className="chat-user__avatar">
                N
                <span className="status-dot online"></span>
              </div>

              <div className="chat-user__info">
                <h3>Nguyễn Minh Anh</h3>
                <span>Khách hàng thân thiết • Đơn gần nhất #VLX1024</span>
              </div>
            </div>

            <div className="chat-main__actions">
              <button className="icon-btn">📞</button>
              <button className="icon-btn">📎</button>
              <button className="icon-btn">⋯</button>
            </div>
          </div>

          <div className="chat-main__body">
            <div className="chat-date-divider">
              <span>Hôm nay</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${
                  msg.type === "admin" ? "chat-bubble-row--admin" : ""
                }`}
              >
                <div className={`chat-bubble ${msg.type === "admin" ? "admin" : "customer"}`}>
                  <p>{msg.text}</p>
                  <span>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-main__footer">
            <div className="chat-quick-actions">
              <button>Xin chào mẫu</button>
              <button>Kiểm tra đơn</button>
              <button>Gửi voucher</button>
              <button>Escalate</button>
            </div>

            <div className="chat-compose">
              <button className="compose-btn">＋</button>
              <textarea placeholder="Nhập nội dung phản hồi cho khách hàng..." />
              <button className="send-btn">Gửi</button>
            </div>
          </div>
        </section>

        <aside className="chat-detail">
          <div className="detail-card">
            <h4>Thông tin khách hàng</h4>
            <ul>
              <li>
                <span>Họ tên</span>
                <strong>Nguyễn Minh Anh</strong>
              </li>
              <li>
                <span>Số điện thoại</span>
                <strong>0901 234 567</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>minhanh@gmail.com</strong>
              </li>
              <li>
                <span>Phân loại</span>
                <strong>VIP</strong>
              </li>
            </ul>
          </div>

          <div className="detail-card">
            <h4>Đơn hàng gần đây</h4>
            <div className="order-item">
              <div>
                <strong>#VLX1024</strong>
                <p>2 sản phẩm • 1.250.000đ</p>
              </div>
              <span className="tag tag--warning">Đang xử lý</span>
            </div>

            <div className="order-item">
              <div>
                <strong>#VLX1008</strong>
                <p>1 sản phẩm • 640.000đ</p>
              </div>
              <span className="tag tag--success">Hoàn tất</span>
            </div>
          </div>

          <div className="detail-card">
            <h4>Ghi chú nội bộ</h4>
            <textarea placeholder="Nhập ghi chú cho team admin..." />
            <button className="btn btn--primary btn--full">Lưu ghi chú</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CustomerSupportChat;