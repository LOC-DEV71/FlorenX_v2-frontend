import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder, updateOrderStatus } from "../../../services/admin/order.admin.service";
import { FiCheckCircle, FiXCircle, FiTruck, FiFlag, FiPackage } from "react-icons/fi";
import {
    RiUserLine,
    RiPhoneLine,
    RiMailLine,
    RiBankCardLine,
    RiCoupon3Line,
    RiMapPinLine,
    RiReceiptLine,
} from "react-icons/ri";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import "./OrderDetail.scss";

const STATUS_CONFIG = {
    pending:   { label: "Chờ xác nhận", color: "#b45309", bg: "#fef3c7" },
    confirmed: { label: "Đã xác nhận",  color: "#1d4ed8", bg: "#dbeafe" },
    shipped:   { label: "Đang giao",    color: "#6d28d9", bg: "#ede9fe" },
    done:      { label: "Hoàn thành",   color: "#065f46", bg: "#d1fae5" },
    cancel:    { label: "Đã huỷ",       color: "#b91c1c", bg: "#fee2e2" },
    suspicious:{ label: "Khả nghi",     color: "#b91c1c", bg: "#fee2e2" },
};

const PAY_LABEL = {
    cod:    "Thanh toán khi nhận hàng",
    paypal: "PayPal",
};

const fmt = (n) =>
    n != null ? new Intl.NumberFormat("vi-VN").format(n) + " ₫" : "—";

const ACTIONS = {
    pending: [
        { label: "Xác nhận đơn",       nextStatus: "confirmed", icon: <FiCheckCircle />, className: "btn--confirm" },
        { label: "Huỷ đơn",            nextStatus: "cancel",    icon: <FiXCircle />,     className: "btn--cancel" },
    ],
    suspicious: [
        { label: "Bỏ qua & Xác nhận",  nextStatus: "confirmed", icon: <FiCheckCircle />, className: "btn--confirm" },
        { label: "Huỷ đơn (Gian lận)", nextStatus: "cancel",    icon: <FiXCircle />,     className: "btn--cancel" },
    ],
    confirmed: [
        { label: "Chuyển vận chuyển",  nextStatus: "shipped",   icon: <FiTruck />,       className: "btn--ship" },
    ],
    shipped: [
        { label: "Hoàn thành",         nextStatus: "done",      icon: <FiFlag />,        className: "btn--done" },
    ],
};

function OrderDetail() {
    const { code } = useParams();
    const [order, setOrder]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getDetailOrder(code);
                if (res?.data?.code) setOrder(res.data.order);
            } catch (err) {
                console.log(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, [code]);

    const handleAction = async (nextStatus) => {
        if (acting) return;
        setActing(nextStatus);
        try {
            const res = await updateOrderStatus({ ids: [order._id], action: nextStatus });
            if (res?.data?.code) setOrder((prev) => ({ ...prev, status: nextStatus }));
        } catch (err) {
            console.log(err.response?.data?.message);
        } finally {
            setActing(null);
        }
    };

    if (loading) return (
        <div className="od-state">
            <div className="od-spinner" />
            <p>Đang tải đơn hàng…</p>
        </div>
    );

    if (!order) return (
        <div className="od-state od-state--empty">
            <FiPackage />
            <p>Không tìm thấy đơn hàng.</p>
        </div>
    );

    const status  = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
    const actions = ACTIONS[order.status] ?? [];

    return (
        <div className="od">
            {/* Heading */}
            <div className="od__heading">
                <div className="od__heading-left">
                    <Link to="/admin/orders" className="od__back">
                        <MdArrowBack /> Danh sách đơn
                    </Link>
                    <div className="od__title-block">
                        <RiReceiptLine className="od__title-icon" />
                        <div>
                            <p className="od__sub">ĐƠN HÀNG</p>
                            <h1 className="od__code">#{order.code}</h1>
                        </div>
                    </div>
                </div>

                <div className="od__heading-right">
                    {actions.map((a) => (
                        <button
                            key={a.nextStatus}
                            className={`od__btn ${a.className}`}
                            onClick={() => handleAction(a.nextStatus)}
                            disabled={!!acting}
                        >
                            {acting === a.nextStatus
                                ? <span className="od__btn-spinner" />
                                : a.icon
                            }
                            {a.label}
                        </button>
                    ))}

                    <span
                        className="od__badge"
                        style={{ color: status.color, background: status.bg }}
                    >
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="od__grid">

                {/* Left col */}
                <div className="od__col">

                    {/* Customer */}
                    <div className="od__card">
                        <h2 className="od__card-title">Khách hàng</h2>
                        <div className="od__info-grid">
                            <div className="od__info-item">
                                <RiUserLine className="od__info-icon" />
                                <div>
                                    <span className="od__info-label">Họ tên</span>
                                    <span className="od__info-value">{order.fullname || "—"}</span>
                                </div>
                            </div>
                            <div className="od__info-item">
                                <RiMailLine className="od__info-icon" />
                                <div>
                                    <span className="od__info-label">Email</span>
                                    <span className="od__info-value">{order.email || "—"}</span>
                                </div>
                            </div>
                            <div className="od__info-item">
                                <RiPhoneLine className="od__info-icon" />
                                <div>
                                    <span className="od__info-label">Điện thoại</span>
                                    <span className="od__info-value">{order.phone || "—"}</span>
                                </div>
                            </div>
                            <div className="od__info-item od__info-item--full">
                                <RiMapPinLine className="od__info-icon" />
                                <div>
                                    <span className="od__info-label">Địa chỉ</span>
                                    <span className="od__info-value">{order.address || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="od__card">
                        <h2 className="od__card-title">Thanh toán</h2>
                        <div className="od__info-grid">
                            <div className="od__info-item">
                                <RiBankCardLine className="od__info-icon" />
                                <div>
                                    <span className="od__info-label">Phương thức</span>
                                    <span className="od__info-value">{PAY_LABEL[order.pay] ?? order.pay}</span>
                                </div>
                            </div>
                            {order.voucher && (
                                <div className="od__info-item">
                                    <RiCoupon3Line className="od__info-icon od__info-icon--voucher" />
                                    <div>
                                        <span className="od__info-label">Voucher</span>
                                        <span className="od__info-value od__info-value--voucher">{order.voucher}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="od__card od__card--summary">
                        <h2 className="od__card-title">Tổng tiền</h2>
                        <ul className="od__summary">
                            <li>
                                <span>Tạm tính</span>
                                <span>{fmt(order.totalPrice)}</span>
                            </li>
                            {order.memberDiscount > 0 && (
                                <li className="od__summary-discount">
                                    <span>Giảm thành viên</span>
                                    <span>-{fmt(order.memberDiscount)}</span>
                                </li>
                            )}
                            {order.voucherDiscount > 0 && (
                                <li className="od__summary-discount">
                                    <span>Giảm voucher</span>
                                    <span>-{fmt(order.voucherDiscount)}</span>
                                </li>
                            )}
                            <li className="od__summary-total">
                                <span>Thành tiền</span>
                                <span>{fmt(order.finalPrice)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right col */}
                <div className="od__col">
                    <div className="od__card">
                        <h2 className="od__card-title">
                            <FiPackage style={{ marginRight: 6 }} />
                            Sản phẩm
                            <span className="od__count">{order.products?.length ?? 0}</span>
                        </h2>

                        <ul className="od__products">
                            {order.products?.map((p, i) => (
                                <li key={i} className="od__product">
                                    <div className="od__product-img">
                                        {p.thumbnail
                                            ? <img src={p.thumbnail} alt={p.title} />
                                            : <span>🖼</span>
                                        }
                                        {p.discountPercentage > 0 && (
                                            <em className="od__product-badge">-{p.discountPercentage}%</em>
                                        )}
                                    </div>

                                    <div className="od__product-body">
                                        <p className="od__product-name">{p.title}</p>
                                        <p className="od__product-meta">
                                            <span className="od__product-qty">× {p.quantity}</span>
                                            <span className="od__product-unit">{fmt(p.price)}</span>
                                        </p>
                                    </div>

                                    <p className="od__product-price">{fmt(p.finalPrice)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OrderDetail;