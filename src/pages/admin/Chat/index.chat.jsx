import React, { useEffect, useRef, useState } from "react";
import {
  PhoneOutlined,
  PaperClipOutlined,
  MoreOutlined,
  SearchOutlined,
  PlusOutlined,
  SendOutlined,
  ExportOutlined,
  StarFilled
} from "@ant-design/icons";
import "./CustomerSupportChat.scss";
import { useSocket } from "../../../Socket/useSocket";
import { formatCustom } from "../../../utils/formatCustomDate";
import { getListRoom } from "../../../services/admin/roomchat.admin.service";

const conversationList = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    lastMessage: "Mình cần kiểm tra lại đơn hàng hôm qua.",
    time: "2 phút",
    unread: 3,
    active: true,
    status: "online",
    avatarClass: "av-a",
  },
  {
    id: 2,
    name: "Trần Hoàng Phúc",
    lastMessage: "Shop hỗ trợ đổi size giúp mình nhé.",
    time: "10 phút",
    unread: 0,
    status: "offline",
    avatarClass: "av-b",
  },
  {
    id: 3,
    name: "Lê Bảo Ngọc",
    lastMessage: "Mình chưa nhận được email xác nhận.",
    time: "25 phút",
    unread: 1,
    status: "online",
    avatarClass: "av-c",
  },
  {
    id: 4,
    name: "Phạm Quốc Huy",
    lastMessage: "Voucher của mình không dùng được.",
    time: "1 giờ",
    unread: 0,
    status: "away",
    avatarClass: "av-d",
  },
];
const quickReplies = [
  { label: "👋 Xin chào mẫu" },
  { label: "📦 Kiểm tra đơn" },
  { label: "🎁 Gửi voucher" },
  { label: "🚨 Escalate" },
];

function CustomerSupportChat() {
  const [activeConv, setActiveConv] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBodyRef = useRef(null);
  const textareaRef = useRef(null);
  const [user, setUser] = useState([])
  const [orders, setOrders] = useState([])
  const [room_chat_id, setRoom_chat_id] = useState("")

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const typingTimeoutRef = useRef(null);
  const [typing, setTyping] = useState([])
  const handleInput = (e) => {
    setInputText(e.target.value);
    if (!socket || !activeConv) return;
    socket.emit("client_typing", { roomId: activeConv, typing: true, sender: "admin" });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("client_typing", { roomId: activeConv, typing: false, sender: "admin" });
    }, 1000);

    socket.on("server_show_typing", (data) => {
      setTyping(data);
    });
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 90) + "px";
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    socket.emit("client_send_message", { roomId: activeConv, text: inputText, sender: "admin", timestamp: new Date() })
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filters = ["Tất cả", "Chưa đọc", "Ưu tiên"];


  const socket = useSocket();
  useEffect(() => {
    if (activeConv && socket) {
      socket.emit("client_join_room", { roomId: activeConv, sender: "admin" });

      socket.on("server_return_room_data", (data) => {
        setMessages(data.message);
        setUser(data.user)
        setOrders(data.orders)
      });

      socket.on("server_send_message", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
    }

    return () => {
      socket.off("server_return_room_data");
      socket.off("server_send_message");
    };
  }, [activeConv, socket]);

  const formatMember = (member) => {
    switch (member) {
      case "bronze":
        return "Hạng đồng"
      case "diamond":
        return "Hạng Kim cương"
      case "gold":
        return "Hạng Vàng"
      case "silver":
        return "Hạng bạc"
      default:
        break;
    }
  }
  const formatStatusOrder = (status) => {
    switch (status) {
      case "pending":
        return "Chưa xác nhận"
      case "confirmed":
        return "Đã xác nhận"
      case "shipped":
        return "Đang giao"
      case "done":
        return "Hoàn thành"
      case "cancel":
        return "Đã hủy"
      default:
        break;
    }
  }

  const [roomchat, setRoomchat] = useState([]);
  useEffect(() => {
    const fetchApi = async () => {
      try {
      const res = await getListRoom();
        if(res?.data?.code){
          setRoomchat(res?.data?.rooms)
        }
      } catch (error) {
        console.log(error?.response?.data?.message)
      }
    }

    fetchApi();
  }, [])
  return (
    <div className="csp">
      {/* Header */}
      <div className="csp-header">
        <div>
          <h1>Chat chăm sóc khách hàng</h1>
          <p>Quản lý hội thoại, hỗ trợ khách hàng và theo dõi trạng thái phản hồi.</p>
        </div>
        <div className="csp-header-actions">
          <button className="btn btn-ghost">
            <ExportOutlined style={{ marginRight: 6 }} /> Xuất hội thoại
          </button>
          <button className="btn btn-primary">
            <PlusOutlined style={{ marginRight: 6 }} /> Tạo ticket
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div className="stat-card stat-card--blue">
          <span className="stat-card__label">Đang chờ phản hồi</span>
          <strong className="stat-card__value">24</strong>
        </div>
        <div className="stat-card stat-card--green">
          <span className="stat-card__label">Đang online</span>
          <strong className="stat-card__value">08</strong>
        </div>
        <div className="stat-card stat-card--amber">
          <span className="stat-card__label">Đã xử lý hôm nay</span>
          <strong className="stat-card__value">156</strong>
        </div>
        <div className="stat-card stat-card--rose">
          <span className="stat-card__label">Đánh giá hài lòng</span>
          <strong className="stat-card__value">94%</strong>
        </div>
      </div>

      {/* Layout */}
      <div className="layout">
        {/* Sidebar */}
        <div className="panel">
          <div className="sidebar-top">
            <div className="search-box">
              <SearchOutlined style={{ color: "#b0b6cc", fontSize: 14 }} />
              <input type="text" placeholder="Tìm theo tên, SĐT, mã đơn..." />
            </div>
            <div className="filters">
              {filters.map((f) => (
                <button
                  key={f}
                  className={`filter-btn${activeFilter === f ? " active" : ""}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="conv-list">
            {roomchat.map((item) => (
              <div
                key={item?._id}
                className={`conv-item${activeConv === item?._id ? " active" : ""}`}
                onClick={() => setActiveConv(item?._id)}
              >
                <div className={`avatar ${item?.avatarClass}`}>
                  <img src={item?.avatar} alt="" />
                  <span className={`sdot ${item?.status}`} />
                </div>
                <div className="conv-body">
                  <div className="conv-row">
                    <span className="conv-name">{item?.fullname}</span>
                    <span className="conv-time">{formatCustom(item?.createdAt)}</span>
                  </div>
                  <div className="conv-row">
                    <span className="conv-msg">{item.lastMessage}</span>
                    {item?.unread > 0 && <span className="badge">{item?.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat */}
        <div className="panel">
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="chat-av-lg">
                <img src={user?.avatar} alt="" />
                <span className="sdot online" />
              </div>
              <div>
                <div className="chat-user-name">{user?.fullname ? user?.fullname : ""}</div>
                <div className="chat-user-sub">Khách hàng thân thiết &nbsp;·&nbsp; Đơn gần nhất #VLX1024</div>
              </div>
            </div>
            <div className="chat-actions">
              <button className="icon-btn"><PhoneOutlined /></button>
              <button className="icon-btn"><PaperClipOutlined /></button>
              <button className="icon-btn"><MoreOutlined /></button>
            </div>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
            <div className="date-div"><span>Hôm nay</span></div>
            {messages.map((msg) => (
              <div key={msg.createdAt || msg.timestamp} className={`bubble-row${msg.sender === "admin" ? " admin" : ""}`}>
                <div className={`bubble ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span>{formatCustom(msg.createdAt || msg.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="typing-indicator">
            {typing?.typing && typing?.sender !== "admin" ? (
                <div className="typing-content">
                    <span className="user-name">Người dùng</span> đang nhập
                    <div className="dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            ) : ""}
        </div>
          <div className="chat-footer">
            <div className="quick-actions">
              {quickReplies.map((q) => (
                <button key={q.label} className="qa-btn" onClick={() => setInputText(q.label)}>
                  {q.label}
                </button>
              ))}
            </div>
            <div className="compose">
              <button className="compose-add"><PlusOutlined /></button>
              <textarea
                ref={textareaRef}
                placeholder="Nhập nội dung phản hồi cho khách hàng..."
                rows={1}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
              />
              <button className="send-btn" onClick={handleSend}>
                Gửi <SendOutlined style={{ fontSize: 12, marginLeft: 4 }} />
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="panel">
          <div className="chat-detail">
            <div className="detail-card">
              <h4>Thông tin khách hàng</h4>
              <ul>
                <li><span className="lbl">Họ tên</span><strong>{user?.fullname ? user?.fullname : "Chưa cập nhật"}</strong></li>
                <li><span className="lbl">Số điện thoại</span><strong>{user?.phone ? user?.phone : "Chưa cập nhật"}</strong></li>
                <li><span className="lbl">Email</span><strong>{user?.email ? user?.email : "Chưa cập nhật"}</strong></li>
                <li>
                  <span className="lbl">Phân loại</span>
                  <strong>
                    <span className="vip-badge">
                      <StarFilled style={{ fontSize: 10, marginRight: 4 }} /> {formatMember(user?.member ? user?.member : "Chưa có hạng")}
                    </span>
                  </strong>
                </li>
              </ul>
            </div>

            <div className="detail-card">
              <h4>Đơn hàng gần đây</h4>
              {orders?.map(item => (
                <div className="order-item" key={item.code}>
                  <div>
                    <strong>#{item.code}</strong>
                    <p>{item.finalPrice.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <span className="tag tag-warn">{formatStatusOrder(item.status)}</span>
                </div>
              ))}
            </div>

            <div className="detail-card">
              <h4>Ghi chú nội bộ</h4>
              <textarea placeholder="Nhập ghi chú cho team admin..." />
              <button className="btn btn-primary btn-full">Lưu ghi chú</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportChat;