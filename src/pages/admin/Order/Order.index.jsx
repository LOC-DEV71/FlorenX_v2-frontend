import { Statistic, Skeleton } from "antd";
import "./Order.index.scss";
import { useEffect, useState, useCallback } from "react";
import {
    BsCheck2Circle,
    BsClockHistory,
    BsTruck
} from "react-icons/bs";
import { MdDoneAll, MdDeleteOutline } from "react-icons/md";
import SEO from "../../../utils/SEO";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
    listOrder,
    updateOrderStatus
} from "../../../services/admin/order.admin.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { renderpagination } from "../../../utils/pagination";
import { useSocket } from "../../../Socket/useSocket";

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
    const [newOrderIds, setNewOrderIds] = useState("")
    const socket = useSocket();

    const [stats, setStats] = useState({
        pending: 0,
        confirmed: 0,
        shipped: 0,
        done: 0
    });

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const sort = searchParams.get("sort") || "";
    const keyword = searchParams.get("search") || "";

    useEffect(() => {
        console.log("Admin socket ID:", socket.id) 
        socket.on("server_return_order", (data) => {
            setOrders(prev => [data.order, ...prev]);
            setNewOrderIds(prev => [...prev, data.order._id])
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

                const { doneOrder, pendingOrder, comfirmOrder, shippedOrder } = res.data.status;
                setStats({
                    pending: pendingOrder,
                    confirmed: comfirmOrder,
                    shipped: shippedOrder,
                    done: doneOrder
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
        setSearchParams({
            page: 1,
            limit,
            sort,
            sortByCategory: value,
            search
        });
    };

    const statusMap = {
        pending: "Chưa xác nhận",
        confirmed: "Đã xác nhận",
        shipped: "Đang giao",
        done: "Hoàn thành",
        cancel: "Đã huỷ"
    };

    const navigate = useNavigate();

    return (
        <div className="orders-page">
            <SEO title="Quản đơn hàng" />

            <h2 className="admin-product-page__title">
                Quản lý đơn hàng
            </h2>

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
            </div>

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
                            setSearchParams({
                                page: 1,
                                limit,
                                sort: e.target.value,
                                search: keyword
                            })
                        }
                    >
                        <option value="">-- Sắp xếp --</option>
                        <option value="price-asc">Giá ↑</option>
                        <option value="price-desc">Giá ↓</option>
                    </select>

                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        <option value="">-- Hành động --</option>
                        <option value="confirmed">Xác nhận</option>
                        <option value="shipped">Vận chuyển</option>
                        <option value="done">Hoàn thành</option>
                        <option value="cancel">Hủy đơn</option>
                    </select>
                </div>

                <div className="admin-toolbar__actions">
                    <button
                        className="admin-reset"
                        onClick={() => {
                            setChecked([]);
                            setSearch("");
                            window.location.href = ("/admin/orders/")
                        }}
                    >
                        <MdDeleteOutline /> Xóa lọc
                    </button>

                    <button
                        className="admin-activity"
                        onClick={handleAction}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            <div className="orders-table">
                <div className="orders-header">
                    <div>
                        <input
                            type="checkbox"
                            checked={checked.length === orders.length && orders.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setChecked(orders.map(o => o._id));
                                } else {
                                    setChecked([]);
                                }
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
                        <div className="orders-row" key={i}>
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
                            <Skeleton.Input active size="small" />
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
                            <div>#{o.code}</div>
                            <div>{o.fullname}</div>
                            <div>{o.phone}</div>
                            <div className="ellipsis">{o.address}</div>
                            <div>{o.finalPrice?.toLocaleString("vi-VN")} VNĐ</div>
                            <div>{formatCustom(o.createdAt)}</div>
                            <div>
                                <span className={`status ${o.status}`}>
                                    {statusMap[o.status]}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>

            {renderpagination(pagination, setSearchParams, limit, sort, sortStatus, "", "", keyword)}

            {selected && (
                <div
                    className="order-drawer-overlay"
                    onClick={() => setSelected(null)}
                >
                    <div
                        className="order-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Chi tiết đơn hàng</h2>

                        <div className="info">
                            <p><b>Mã:</b> {selected.code}</p>
                            <p><b>Khách:</b> {selected.fullname}</p>
                            <p><b>SĐT:</b> {selected.phone}</p>
                            <p><b>Email:</b> {selected.email}</p>
                            <p><b>Địa chỉ:</b> {selected.address}</p>
                            <p><b>Thanh toán:</b> {selected.pay}</p>
                            <p><b>Voucher:</b> {selected.voucher}</p>
                        </div>

                        <div className="product-list">
                            {selected?.products?.map((p, i) => (
                                <div key={i} className="product-item">
                                    <img src={p.thumbnail} alt="" />
                                    <div>
                                        <p>{p.title}</p>
                                        <span>
                                            SL: {p.quantity} | Giá: {p.finalPrice.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="total">
                            <p>Tổng: {selected.totalPrice?.toLocaleString()}đ</p>
                            <p>Voucher: -{selected.voucherDiscount?.toLocaleString()}đ</p>
                            <p>Giảm TV: -{selected.memberDiscount?.toLocaleString()}đ</p>
                            <h3>Thanh toán: {selected.finalPrice?.toLocaleString()}đ</h3>
                        </div>

                        <button onClick={() => setSelected(null)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;