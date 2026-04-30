import { useState } from "react";
import "./OrderList.scss";

const mockOrders = [
  {
    id: "ORD-20240001",
    date: "28/04/2026",
    status: "delivered",
    items: [
      { name: "Áo thun nam basic", qty: 2, price: 199000 },
      { name: "Quần jogger xám", qty: 1, price: 349000 },
    ],
    total: 747000,
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
  },
  {
    id: "ORD-20240002",
    date: "25/04/2026",
    status: "shipping",
    items: [{ name: "Giày sneaker trắng", qty: 1, price: 890000 }],
    total: 890000,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
  },
  {
    id: "ORD-20240003",
    date: "20/04/2026",
    status: "processing",
    items: [
      { name: "Túi da đeo chéo", qty: 1, price: 650000 },
      { name: "Ví da mini", qty: 1, price: 280000 },
    ],
    total: 930000,
    thumbnail: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop",
  },
  {
    id: "ORD-20240004",
    date: "15/04/2026",
    status: "cancelled",
    items: [{ name: "Kính mát unisex", qty: 1, price: 420000 }],
    total: 420000,
    thumbnail: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=80&h=80&fit=crop",
  },
  {
    id: "ORD-20240005",
    date: "10/04/2026",
    status: "delivered",
    items: [
      { name: "Mũ bucket xanh navy", qty: 1, price: 180000 },
      { name: "Áo hoodie oversize", qty: 1, price: 520000 },
    ],
    total: 700000,
    thumbnail: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=80&h=80&fit=crop",
  },
];

const STATUS_CONFIG = {
  delivered:  { label: "Đã giao",    color: "green"  },
  shipping:   { label: "Đang giao",  color: "blue"   },
  processing: { label: "Đang xử lý", color: "orange" },
  cancelled:  { label: "Đã huỷ",    color: "red"    },
};

const TABS = [
  { key: "all",        label: "Tất cả"     },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping",   label: "Đang giao"  },
  { key: "delivered",  label: "Đã giao"    },
  { key: "cancelled",  label: "Đã huỷ"    },
];

function formatPrice(n) {
  return n.toLocaleString("vi-VN") + "₫";
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`badge badge--${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onViewDetail }) {
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__id">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          {order.id}
        </div>
        <div className="card__meta">
          <span className="card__date">{order.date}</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="card__body">
        <img src={order.thumbnail} alt="product" className="card__thumb" />
        <div className="items-list">
          {order.items.map((item, i) => (
            <div key={i} className="item-row">
              <span className="item-row__name">{item.name}</span>
              <span className="item-row__qty">x{item.qty}</span>
              <span className="item-row__price">{formatPrice(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card__footer">
        <div className="card__total">
          <span>Tổng cộng:</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
        <div className="card__actions">
          {order.status === "delivered" && (
            <button className="btn btn--ghost">Mua lại</button>
          )}
          {order.status === "processing" && (
            <button className="btn btn--danger">Huỷ đơn</button>
          )}
          <button className="btn btn--primary" onClick={() => onViewDetail(order)}>
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>Chi tiết đơn hàng</h3>
          <button className="modal__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal__body">
          <div className="detail-row"><span>Mã đơn hàng</span><strong>{order.id}</strong></div>
          <div className="detail-row"><span>Ngày đặt</span><strong>{order.date}</strong></div>
          <div className="detail-row"><span>Trạng thái</span><StatusBadge status={order.status} /></div>
          <div className="divider" />
          <p className="section-label">Sản phẩm</p>
          {order.items.map((item, i) => (
            <div key={i} className="modal-item">
              <span>{item.name}</span>
              <span>x{item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="divider" />
          <div className="detail-row detail-row--total">
            <span>Tổng cộng</span>
            <strong className="total-amt">{formatPrice(order.total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderList() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = mockOrders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  return (
    <div className="order-page">
      <header className="topbar">
        <div className="topbar__left">
          <div className="avatar">HT</div>
          <div>
            <p className="topbar__username">Hoàng Tuấn</p>
            <p className="topbar__subtitle">Tài khoản của tôi</p>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="page-title">
          <h2>Đơn hàng của tôi</h2>
          <span className="count">{filtered.length} đơn</span>
        </div>

        <div className="search-wrap">
          <svg className="search-wrap__icon" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="search-wrap__input"
            placeholder="Tìm kiếm theo mã đơn hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? "tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="order-list">
          {filtered.length === 0 ? (
            <div className="empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderCard key={order.id} order={order} onViewDetail={setSelectedOrder} />
            ))
          )}
        </div>
      </main>

      <DetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

export default OrderList;