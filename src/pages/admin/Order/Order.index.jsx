import { Statistic, Skeleton } from "antd";
import "./Order.index.scss";
import { useEffect, useState, useCallback } from "react";
import {
    BsCheck2Circle,
    BsClockHistory,
    BsTruck
} from "react-icons/bs";
import { MdDoneAll, MdDeleteOutline, MdClose, MdReceipt } from "react-icons/md";
import { FiPackage, FiAlertTriangle } from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiUserLine, RiPhoneLine, RiMailLine, RiBankCardLine, RiCoupon3Line } from "react-icons/ri";
import SEO from "../../../utils/SEO";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
    listOrder,
    updateOrderStatus
} from "../../../services/admin/order.admin.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { renderpagination } from "../../../utils/pagination";
import { useSocket } from "../../../Socket/useSocket";
import formatTimeAgo from "../../../utils/formatTimeAgo";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null);
    const [checked, setChecked] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({});
    const [action, setAction] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [sortStatus, setSortStatus] = useState("")
    const [newOrderIds, setNewOrderIds] = useState([])
    const socket = useSocket();

    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        shipped: 0,
        done: 0,
        suspicious: 0
    });

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const sort = searchParams.get("sort") || "";
    const keyword = searchParams.get("search") || "";

    useEffect(() => {
        socket.on("server_return_order", (data) => {
            setOrders(prev => [data.data.order, ...prev]);
            setNewOrderIds(prev => [...prev, data.data.order._id])
        })
        return () => socket.off("server_return_order")
    }, [])

    useEffect(() => {
        setSearch(keyword);
    }, [keyword]);

    const toggleCheck = (id) => {
        setChecked((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : [...prev, id]
        );
    };

    const fetchApi = useCallback(async () => {
        try {
            setLoading(true);
            const res = await listOrder({ page, limit, sort, search: keyword, sortStatus });
            if (res?.data?.code) {
                const ordersData = res.data.orders || [];
                setOrders(ordersData);
                setPagination(res.data.pagination);
                const { doneOrder, pendingOrder, comfirmOrder, shippedOrder, suspiciousOrder } = res.data.status;
                setStats({
                    pending: pendingOrder,
                    confirmed: comfirmOrder,
                    shipped: shippedOrder,
                    done: doneOrder,
                    suspicious: suspiciousOrder
                });
            }
        } catch (error) {
            console.log(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }, [page, limit, sort, keyword, sortStatus]);

    useEffect(() => {
        fetchApi();
    }, [fetchApi]);

    const handleSearch = () => {
        setSearchParams({ page: 1, limit, sort, search });
    };

    const handleAction = async () => {
        if (!action || checked.length === 0) return;
        try {
            await updateOrderStatus({ ids: checked, action });
            await fetchApi();
            setChecked([]);
            setAction("");
        } catch (err) {
            console.log(err);
        }
    };

    const handleFilterStatus = (value) => {
        setSortStatus(value);
        setSearchParams({ page: 1, limit, sort, sortByCategory: value, search });
    };

    const statusMap = {
        pending: "Chưa xác nhận",
        confirmed: "Đã xác nhận",
        shipped: "Đang giao",
        done: "Hoàn thành",
        cancel: "Đã huỷ",
        suspicious: "Khả nghi"
    };

    const navigate = useNavigate();

    return (
        <div className="orders-page">
            <SEO title="Quản đơn hàng" />

            <h2 className="admin-product-page__title">Quản lý đơn hàng</h2>

            {/* Stats */}
            <div className="admin-product-stats">
                <div
                    className={`admin-stat-card admin-stat-pending ${sortStatus === "pending" ? "status-active" : ""}`}
                    onClick={() => handleFilterStatus("pending")}
                >
                    <p><BsClockHistory /> Chưa xác nhận</p>
                    {loading ? <Skeleton.Input active size="small" /> : <Statistic value={stats.pending} />}
                </div>
                <div
                    className={`admin-stat-card admin-stat-confirmed ${sortStatus === "confirmed" ? "status-active" : ""}`}
                    onClick={() => handleFilterStatus("confirmed")}
                >
                    <p><BsCheck2Circle /> Đã xác nhận</p>
                    {loading ? <Skeleton.Input active size="small" /> : <Statistic value={stats.confirmed} />}
                </div>
                <div
                    className={`admin-stat-card admin-stat-shipped ${sortStatus === "shipped" ? "status-active" : ""}`}
                    onClick={() => handleFilterStatus("shipped")}
                >
                    <p><BsTruck /> Đang giao</p>
                    {loading ? <Skeleton.Input active size="small" /> : <Statistic value={stats.shipped} />}
                </div>
                <div
                    className={`admin-stat-card admin-stat-done ${sortStatus === "done" ? "status-active" : ""}`}
                    onClick={() => handleFilterStatus("done")}
                >
                    <p><MdDoneAll /> Hoàn thành</p>
                    {loading ? <Skeleton.Input active size="small" /> : <Statistic value={stats.done} />}
                </div>
                <div
                    className={`admin-stat-card admin-stat-suspicious ${sortStatus === "suspicious" ? "status-active" : ""}`}
                    onClick={() => handleFilterStatus("suspicious")}
                >
                    <p style={{color: "#b91c1c"}}><FiAlertTriangle /> Khả nghi</p>
                    {loading ? <Skeleton.Input active size="small" /> : <Statistic value={stats.suspicious} />}
                </div>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-toolbar__filters">
                    <div className="admin-search">
                        <SearchOutlined />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Tìm mã, tên, SĐT..."
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) =>
                            setSearchParams({ page: 1, limit, sort: e.target.value, search: keyword })
                        }
                    >
                        <option value="">-- Sắp xếp --</option>
                        <option value="price-asc">Giá ↑</option>
                        <option value="price-desc">Giá ↓</option>
                    </select>
                    <select value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="">-- Hành động --</option>
                        <option value="confirmed">Xác nhận</option>
                        <option value="shipped">Vận chuyển</option>
                        <option value="done">Hoàn thành</option>
                        <option value="cancel">Hủy đơn</option>
                        <option value="suspicious">Khả nghi</option>
                    </select>
                </div>
                <div className="admin-toolbar__actions">
                    <button
                        className="admin-reset"
                        onClick={() => {
                            setChecked([]);
                            setSearch("");
                            window.location.href = "/admin/orders/";
                        }}
                    >
                        <MdDeleteOutline /> Xóa lọc
                    </button>
                    <button className="admin-activity" onClick={handleAction}>Áp dụng</button>
                </div>
            </div>

            {/* Table */}
            <div className="orders-table">
                <div className="orders-header">
                    <div>
                        <input
                            type="checkbox"
                            checked={checked.length === orders.length && orders.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) setChecked(orders.map(o => o._id));
                                else setChecked([]);
                            }}
                        />
                    </div>
                    <div>Mã đơn</div>
                    <div>Tên</div>
                    <div>SĐT</div>
                    <div>Địa chỉ</div>
                    <div>Tổng đơn</div>
                    <div>Ngày đặt</div>
                    <div>Trạng thái</div>
                </div>

                {loading
                    ? Array(limit).fill(0).map((_, i) => (
                        <div className="orders-row skeleton-row" key={i}>
                            {Array(8).fill(0).map((_, j) => (
                                <Skeleton.Input key={j} active size="small" />
                            ))}
                        </div>
                    ))
                    : orders.map((o) => (
                        <div
                            key={o._id}
                            className={`orders-row ${newOrderIds.includes(o._id) ? "new-order" : ""}`}
                            onClick={() => setSelected(o)}
                        >
                            <div onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={checked.includes(o._id)}
                                    onChange={() => toggleCheck(o._id)}
                                />
                            </div>
                            <div className="order-code">#{o.code}</div>
                            <div>{o.fullname}</div>
                            <div>{o.phone}</div>
                            <div className="ellipsis">{o.address}</div>
                            <div className="order-price">{o.finalPrice?.toLocaleString("vi-VN")} ₫</div>
                            <div className="order-date">{formatTimeAgo(o.createdAt)}</div>
                            <div>
                                <span className={`status status--${o.status}`}>
                                    {statusMap[o.status]}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>

            {renderpagination(pagination, setSearchParams, limit, sort, sortStatus, "", "", keyword)}

            {/* Modal */}
            {selected && (
                <div className="order-modal-overlay" onClick={() => setSelected(null)}>
                    <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="order-modal__header">
                            <div className="order-modal__title">
                                <MdReceipt className="title-icon" />
                                <div>
                                    <h2>Chi tiết đơn hàng</h2>
                                    <span className="order-modal__code">#{selected.code}</span>
                                </div>
                            </div>
                            <div className="order-modal__header-right">
                                <span className={`status status--${selected.status} status--lg`}>
                                    {statusMap[selected.status]}
                                </span>
                                <button className="modal-close-btn" onClick={() => setSelected(null)}>
                                    <MdClose />
                                </button>
                            </div>
                        </div>

                        <div className="order-modal__body">
                            {/* Customer info */}
                            <div className="modal-section">
                                <h3 className="modal-section__title">Thông tin khách hàng</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <RiUserLine className="info-icon" />
                                        <div>
                                            <span className="info-label">Họ tên</span>
                                            <span className="info-value">{selected.fullname}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <RiPhoneLine className="info-icon" />
                                        <div>
                                            <span className="info-label">Số điện thoại</span>
                                            <span className="info-value">{selected.phone}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <RiMailLine className="info-icon" />
                                        <div>
                                            <span className="info-label">Email</span>
                                            <span className="info-value">{selected.email}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <HiOutlineLocationMarker className="info-icon" />
                                        <div>
                                            <span className="info-label">Địa chỉ</span>
                                            <span className="info-value">{selected.address}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <RiBankCardLine className="info-icon" />
                                        <div>
                                            <span className="info-label">Thanh toán</span>
                                            <span className="info-value">{selected.pay}</span>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <RiCoupon3Line className="info-icon" />
                                        <div>
                                            <span className="info-label">Voucher</span>
                                            <span className="info-value">{selected.voucher || "Không có"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="modal-section">
                                <h3 className="modal-section__title">
                                    <FiPackage style={{ marginRight: 6 }} />
                                    Sản phẩm ({selected?.products?.length || 0})
                                </h3>
                                <div className="product-list">
                                    {selected?.products?.map((p, i) => (
                                        <Link to={`/admin/products/detail/${p.slug}`} key={i} className="product-item">
                                            <img src={p.thumbnail} alt={p.title} />
                                            <div className="product-item__info">
                                                <p className="product-item__title">{p.title}</p>
                                                <div className="product-item__meta">
                                                    <span className="product-qty">SL: {p.quantity}</span>
                                                    <span className="product-price">{p.finalPrice.toLocaleString()}₫</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="modal-section order-summary">
                                <h3 className="modal-section__title">Tổng kết</h3>
                                <div className="summary-rows">
                                    <div className="summary-row">
                                        <span>Tạm tính</span>
                                        <span>{selected.totalPrice?.toLocaleString()}₫</span>
                                    </div>
                                    <div className="summary-row discount">
                                        <span>Giảm voucher</span>
                                        <span>-{selected.voucherDiscount?.toLocaleString()}₫</span>
                                    </div>
                                    <div className="summary-row discount">
                                        <span>Giảm thành viên</span>
                                        <span>-{selected.memberDiscount?.toLocaleString()}₫</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Thanh toán</span>
                                        <span>{selected.finalPrice?.toLocaleString()}₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-modal__footer">
                            <button className="btn-close" onClick={() => setSelected(null)}>
                                <MdClose /> Đóng
                            </button>
                            <Link className="btn-detail" to={`/admin/orders/${selected.code}`}>
                                Xem chi tiết đầy đủ
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;