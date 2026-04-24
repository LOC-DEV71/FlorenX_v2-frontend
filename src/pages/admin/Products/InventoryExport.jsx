import "./InventoryImport.scss";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import { getListInventoryExport } from "../../../services/admin/InventoryTransaction.service";
import { renderpagination } from "../../../utils/pagination";

function InventoryExportList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const res = await getListInventoryExport({ page, limit });
                if (res?.data?.code) {
                    setData(res?.data?.data || []);
                    setPagination(res?.data?.pagination || false);
                }
            } catch (err) {
                console.error(err?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit]);

    return (
        <div className="inventory-import-list-page inventory-export-list-page">
            <div className="inventory-import-list-page__header">
                <div>
                    <h2>Danh sách xuất kho</h2>
                    <p>Quản lý các phiếu xuất kho sản phẩm</p>
                </div>

                <div className="inventory-import-list-page__actions">
                    <Link
                        className="inventory-audit-create-btn"
                        to={"/admin/products/inventory/export/create"}
                    >
                        + Tạo phiếu xuất
                    </Link>
                </div>
            </div>

            {/* FILTER UI ONLY */}
            <div className="admin-toolbar inventory-export-toolbar">
                <div className="admin-toolbar__filters">
                    <div className="admin-search">
                        <SearchOutlined />
                        <input placeholder="Tìm mã xuất, tên sản phẩm hoặc mã đơn..." />
                    </div>

                    <select defaultValue="">
                        <option value="">Kho: Tất cả</option>
                        <option value="kho-1">Kho 1</option>
                        <option value="kho-2">Kho 2</option>
                    </select>

                    <select defaultValue="">
                        <option value="">Trạng thái: Tất cả</option>
                        <option value="completed">Đã xuất</option>
                        <option value="pending">Chờ xử lý</option>
                    </select>

                    <select defaultValue="">
                        <option value="">-- Sắp xếp theo --</option>
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="quantity-asc">Số lượng tăng dần</option>
                        <option value="quantity-desc">Số lượng giảm dần</option>
                    </select>
                </div>

                <div className="admin-toolbar__actions">
                    <button
                        className="admin-reset"
                        onClick={() => setSearchParams({ page: 1, limit })}
                    >
                        <MdDeleteOutline /> Xóa lọc
                    </button>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <div className="admin-product-table inventory-import-admin-table">
                    <div className="admin-table-header inventory-import-table-header">
                        <div>Mã xuất</div>
                        <div className="admin-col-product">Sản phẩm</div>
                        <div>Kho</div>
                        <div>Số lượng</div>
                        <div>Mã đơn hàng</div>
                        <div>Chi tiết</div>
                    </div>

                    {loading
                        ? Array(5).fill(0).map((_, i) => (
                            <div
                                className="admin-table-row inventory-import-table-row"
                                key={i}
                            >
                                <div className="inventory-import-ref">
                                    <div className="skeleton-line skeleton-line--md"></div>
                                    <div className="skeleton-line skeleton-line--sm"></div>
                                </div>

                                <div className="admin-product-info admin-col-product">
                                    <div className="inventory-import-thumb-skeleton"></div>
                                    <div>
                                        <div className="skeleton-line skeleton-line--lg"></div>
                                        <div className="skeleton-line skeleton-line--sm"></div>
                                    </div>
                                </div>

                                <div className="skeleton-line skeleton-line--md"></div>
                                <div className="skeleton-line skeleton-line--sm"></div>
                                <div className="skeleton-line skeleton-line--md"></div>
                                <div className="skeleton-btn"></div>
                            </div>
                        ))
                        : data.map((item) => (
                            <div
                                className="admin-table-row inventory-import-table-row"
                                key={item._id}
                            >
                                <div className="inventory-import-ref">
                                    <strong>{item.ref_id}</strong>
                                    <span>
                                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>

                                <div className="admin-product-info admin-col-product">
                                    <div className="admin-product-images">
                                        <img
                                            src={item.product?.thumbnail}
                                            alt={item.product?.title}
                                        />
                                    </div>

                                    <div>
                                        <p className="admin-product-name">
                                            {item.product?.title}
                                        </p>
                                        <span className="admin-product-sub">
                                            {item.product?.slug}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <span className="inventory-import-warehouse">
                                        {item.warehouse?.name}
                                    </span>
                                </div>

                                <div>
                                    <span className="inventory-import-quantity">
                                        {item.quantity}
                                    </span>
                                </div>

                                <div>
                                    <span className="inventory-import-quantity inventory-import-quantity--order">
                                        {item?.ref_name}
                                    </span>
                                </div>

                                <div className="admin-actions">
                                    <Link
                                        to={`/admin/inventory-export/${item._id}`}
                                        className="admin-edit"
                                    >
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}

                    {renderpagination(pagination, setSearchParams, limit)}
                </div>
            </div>
        </div>
    );
}

export default InventoryExportList;