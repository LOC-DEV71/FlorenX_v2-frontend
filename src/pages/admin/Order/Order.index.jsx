import { Statistic } from "antd";
import "./Order.index.scss";
import { useEffect, useState, useCallback } from "react";
import {
    BsCheck2Circle,
    BsClockHistory,
    BsTruck
} from "react-icons/bs";
import { MdDoneAll, MdDeleteOutline } from "react-icons/md";
import SEO from "../../../utils/SEO";
import { Link, useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import {
    listOrder,
    updateOrderStatus
} from "../../../services/admin/order.admin.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { renderpagination } from "../../../utils/pagination";



function Orders() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState(null);
    const [checked, setChecked] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState({});
    const [action, setAction] = useState("");
    const [search, setSearch] = useState("");

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
            const res = await listOrder({ page, limit, sort, search: keyword });

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
        }
    }, [page, limit, sort, keyword]);

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

    const statusMap = {
        pending: "Chưa xác nhận",
        confirmed: "Đã xác nhận",
        shipped: "Đang giao",
        done: "Hoàn thành",
        cancel: "Đã huỷ"
    };


    return (
        <div className="orders-page">
            <SEO title="Quản đơn hàng" />

            <h2 className="admin-product-page__title">
                Quản lý đơn hàng
            </h2>

            {/* STATS */}
            <div className="admin-product-stats">
                <div className="admin-stat-card admin-stat-pending">
                    <p><BsClockHistory /> Chưa xác nhận</p>
                    <Statistic value={stats.pending} />
                </div>
                <div className="admin-stat-card admin-stat-confirmed">
                    <p><BsCheck2Circle /> Đã xác nhận</p>
                    <Statistic value={stats.confirmed} />
                </div>
                <div className="admin-stat-card admin-stat-shipping">
                    <p><BsTruck /> Đang giao</p>
                    <Statistic value={stats.shipped} />
                </div>
                <div className="admin-stat-card admin-stat-done">
                    <p><MdDoneAll /> Hoàn thành</p>
                    <Statistic value={stats.done} />
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="admin-toolbar">
                <div className="admin-toolbar__filters">

                    {/* SEARCH */}
                    <div className="admin-search">
                        <SearchOutlined />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="Tìm mã, tên, SĐT..."
                        />
                    </div>

                    {/* SORT */}
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

                    {/* ACTION */}
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        <option value="">-- Hành động --</option>
                        <option value="confirm">Xác nhận</option>
                        <option value="cancel">Hủy đơn</option>
                    </select>
                </div>

                <div className="admin-toolbar__actions">
                    <button
                        className="admin-reset"
                        onClick={() => {
                            setChecked([]);
                            setSearch("");
                            setSearchParams({});
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

            {/* TABLE */}
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

                {orders.map((o) => (
                    <div
                        key={o._id}
                        className="orders-row"
                        onClick={() => setSelected(o)}
                    >
                        <div onClick={(e) => e.stopPropagation()}>
                            <input
                                type="checkbox"
                                checked={checked.includes(o._id)}
                                onChange={() => toggleCheck(o._id)}
                            />
                        </div>
                        <div>{o.code}</div>
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

            {/* PAGINATION */}
            {renderpagination(pagination, setSearchParams, limit, sort, "", "", "", keyword)}

            {/* DRAWER */}
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