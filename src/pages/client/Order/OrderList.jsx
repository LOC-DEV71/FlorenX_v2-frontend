import { useEffect, useState } from "react";
import "./OrderList.scss";
import { getList } from "../../../services/client/order.service";
import { error } from "../../../utils/notift";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", color: "orange" },
  confirmed: { label: "Đã xác nhận", color: "blue" },
  shipped: { label: "Đang giao", color: "info" },
  done: { label: "Hoàn thành", color: "green" },
  cancel: { label: "Đã huỷ", color: "red" },
};

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipped", label: "Đang giao" },
  { key: "done", label: "Hoàn thành" },
  { key: "cancel", label: "Đã huỷ" },
];

function formatPrice(n) {
  return Number(n || 0).toLocaleString("vi-VN") + "₫";
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

const PAY_LABEL = { cod: "COD", paypal: "PayPal" };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    color: "info",
  };

  return (
    <span className={`vx-badge vx-badge--${cfg.color}`}>{cfg.label}</span>
  );
}

function OrderCard({ order, onViewDetail, onReview }) {
  const thumb = order.products?.[0]?.thumbnail;

  return (
    <div className="vx-card">
      <div className="vx-card__head">
        <div className="vx-card__id">
          <div className="vx-card__id-dot" />
          {order.code}
        </div>

        <div className="vx-card__meta">
          <span className="vx-card__date">{formatDate(order.createdAt)}</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="vx-card__body">
        <img src={thumb} alt="product" className="vx-card__thumb" />

        <div className="vx-items">
          {order.products?.map((p, i) => (
            <div key={i} className="vx-item">
              <span className="vx-item__name">{p.title}</span>
              <span className="vx-item__qty">x{p.quantity}</span>
              <span className="vx-item__price">{formatPrice(p.finalPrice)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="vx-card__foot">
        <div className="vx-card__total">
          <span>Thanh toán</span>
          <strong>{formatPrice(order.finalPrice)}</strong>
        </div>

        <div className="vx-card__actions">
          {order.status === "done" && (
            <button className="vx-btn vx-btn--ghost">Mua lại</button>
          )}

          {order.status === "done" && (
            <button
              className="vx-btn vx-btn--ghost"
              onClick={() => onReview(order)}
            >
              Đánh giá sản phẩm
            </button>
          )}

          {order.status === "pending" && (
            <button className="vx-btn vx-btn--danger">Huỷ đơn</button>
          )}

          <button
            className="vx-btn vx-btn--primary"
            onClick={() => onViewDetail(order)}
          >
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
    <div className="vx-overlay" onClick={onClose}>
      <div className="vx-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vx-modal__head">
          <span className="vx-modal__title">Chi tiết đơn hàng</span>
          <button className="vx-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="vx-modal__body">
          <p className="vx-section-label">Thông tin đơn</p>

          <div className="vx-detail-row">
            <span>Mã đơn hàng</span>
            <strong>{order.code}</strong>
          </div>

          <div className="vx-detail-row">
            <span>Ngày đặt</span>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>

          <div className="vx-detail-row">
            <span>Trạng thái</span>
            <StatusBadge status={order.status} />
          </div>

          <div className="vx-detail-row">
            <span>Thanh toán</span>
            <strong>{PAY_LABEL[order.pay]}</strong>
          </div>

          <div className="vx-divider" />

          <p className="vx-section-label">Sản phẩm</p>

          {order.products?.map((p, i) => (
            <Link
              key={i}
              className="vx-product-card"
              to={`/products/detail/${p.slug}`}
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="vx-product-card__thumb"
              />
              <div className="vx-product-card__info">
                <span className="vx-product-card__title">{p.title}</span>
              </div>
              <div className="vx-product-card__price">
                <span className="vx-product-card__price-final">
                  {formatPrice(p.finalPrice * p.quantity)}
                </span>
              </div>
            </Link>
          ))}

          <div className="vx-divider" />

          <div className="vx-detail-row vx-detail-row--total">
            <span>Thanh toán</span>
            <strong>{formatPrice(order.finalPrice)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({
  open,
  product,
  form,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!open || !product) return null;
  return (
    <div className="vx-overlay" onClick={onClose}>
      <div
        className="vx-modal vx-review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="vx-modal__head">
          <span className="vx-modal__title">Đánh giá sản phẩm</span>
          <button className="vx-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="vx-modal__body">
          <div className="vx-review-product">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="vx-review-product__thumb"
            />
            <div className="vx-review-product__info">
              <div className="vx-review-product__title">{product.title}</div>
            </div>
          </div>

          <div className="vx-divider" />

          <div className="vx-form-group">
            <label className="vx-form-label">Tên của bạn</label>
            <input
              type="text"
              className="vx-form-input"
              placeholder="Nhập tên của bạn"
              value={form.user_name}
              onChange={(e) =>
                onChange({ ...form, user_name: e.target.value })
              }
            />
          </div>

          <div className="vx-form-group">
            <label className="vx-form-label">Tiêu đề</label>
            <input
              type="text"
              className="vx-form-input"
              placeholder="Nhập tiêu đề đánh giá..."
              value={form.title}
              onChange={(e) =>
                onChange({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className="vx-form-group">
            <label className="vx-form-label">Nội dung</label>
            <textarea
              className="vx-form-textarea"
              rows={5}
              placeholder="Chia sẻ cảm nhận của bạn..."
              value={form.comment}
              onChange={(e) =>
                onChange({ ...form, comment: e.target.value })
              }
            />
          </div>

          <div className="vx-review-actions">
            <button className="vx-btn vx-btn--ghost" onClick={onClose}>
              Huỷ
            </button>
            <button className="vx-btn vx-btn--primary" onClick={onSubmit}>
              Gửi đánh giá
            </button>
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
  const [mockOrders, setMckOrders] = useState([]);

  const [reviewModal, setReviewModal] = useState({
    open: false,
    product: null,
  });

  const [reviewForm, setReviewForm] = useState({
    product_ids: [],
    user_name: "",
    title: "",
    comment: "",
  });

  const handleOpenReview = (order) => {
    setReviewModal({
      open: true,
      product: order.products?.[0] || null,
    });

    setReviewForm({
      product_ids: order.products?.map(
        (item) => item._id || item.id || item.product_id
      ) || [],
      user_name: "",
      title: "",
      comment: "",
    });
  };

  const handleCloseReview = () => {
    setReviewModal({
      open: false,
      product: null,
    });

    setReviewForm({
      product_ids: [],
      user_name: "",
      title: "",
      comment: "",
    });
  };

  const handleSubmitReview = async () => {
    const payload = {
      product_ids: reviewForm.product_ids,
      user_name: reviewForm.user_name,
      title: reviewForm.title,
      comment: reviewForm.comment,
    };

    console.log("Review payload:", payload);

    // await createReview(payload);

    handleCloseReview();
  };

  const filtered = mockOrders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const keyword = search.toLowerCase();

    const matchSearch =
      o.code?.toLowerCase().includes(keyword) ||
      o.products?.some((p) =>
        p.title?.toLowerCase().includes(keyword)
      );

    return matchTab && matchSearch;
  });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getList();
        if (res?.data?.code) {
          setMckOrders(res?.data?.orders || []);
        }
      } catch (err) {
        console.log(err.response?.data?.message);
        error(err.response?.data?.message);
      }
    };

    fetchApi();
  }, []);


  return (
    <div className="vx-page">
      <main className="vx-main">
        <div className="vx-page-header">
          <h2 className="vx-page-title">
            Đơn hàng <span>của tôi</span>
          </h2>
          <span className="vx-count-pill">
            {filtered.length} đơn hàng
          </span>
        </div>

        <div className="vx-search">
          <input
            placeholder="Tìm kiếm theo mã đơn hoặc tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="vx-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`vx-tab ${
                activeTab === tab.key ? "vx-tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="vx-list">
          {filtered.length === 0 ? (
            <div className="vx-empty">
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order.id || order._id}
                order={order}
                onViewDetail={setSelectedOrder}
                onReview={handleOpenReview}
              />
            ))
          )}
        </div>
      </main>

      <DetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <ReviewModal
        open={reviewModal.open}
        product={reviewModal.product}
        form={reviewForm}
        onChange={setReviewForm}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

export default OrderList;