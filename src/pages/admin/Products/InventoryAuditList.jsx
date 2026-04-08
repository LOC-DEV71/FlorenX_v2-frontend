import "./InventoryAuditList.scss";
import SEO from "../../../utils/SEO";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { renderpagination } from "../../../utils/pagination";
import { formatCustom } from "../../../utils/formatCustomDate";
import { getInventoryAuditList } from "../../../services/admin/inventoryAudit.service";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import LoadingSpinner from "../../../utils/LoadingSpinner";

function InventoryAuditList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);

                const res = await getInventoryAuditList({ page, limit, search });
                if (res?.data?.code) {
                    setData(res?.data?.audits || []);
                    setPagination(res?.data?.pagination || {});
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit, search, sort]);

    const clearParams = () => {
        navigate("/admin/products/inventory/audit/list");
    };

    return (
        <div className="inventory-audit-list-page">
            <SEO title="Danh sách kiểm kê kho" />

            <div className="inventory-audit-list-page__top">
                <div>
                    <h2 className="inventory-audit-list-page__title">
                        Danh sách kiểm kê kho
                    </h2>
                    <p className="inventory-audit-list-page__desc">
                        Quản lý các phiếu kiểm kê và xem nhanh thông tin kiểm kê kho.
                    </p>
                </div>

                <Link
                    to="/admin/products/inventory/audit/create"
                    className="inventory-audit-create-btn"
                >
                    + Tạo phiếu kiểm kê
                </Link>
            </div>

            <div className="admin-toolbar">
                <div className="admin-toolbar__filters">
                    <div className="admin-search">
                        <SearchOutlined />
                        <input
                            placeholder="Tìm theo mã kiểm kê ( KK-20260408-094546-6303 )"
                            onChange={(e) => {
                                setSearchParams({
                                    page: 1,
                                    limit,
                                    search: e.target.value,
                                });
                            }}
                            value={search}
                        />
                    </div>

                    <select value={sort} onChange={(e) => {
                        const params = {
                            page: 1,
                            limit,
                            sort: e.target.value,
                        };

                        if (search) {
                            params.search = search;
                        }

                        setSearchParams(params);
                    }}>
                        <option value="">-- Sắp xếp theo --</option>
                        <option value="new">Mới nhất</option>
                        <option value="old">Cũ nhất</option>
                    </select>
                </div>

                <div className="admin-toolbar__actions">
                    <button className="admin-reset" onClick={clearParams}>
                        <MdDeleteOutline /> Xóa lọc
                    </button>
                </div>
            </div>

            <div className="inventory-audit-table-wrapper">
                <div className="inventory-audit-table">
                    <div className="inventory-audit-table__header">
                        <div>Mã kiểm kê</div>
                        <div>Ngày kiểm</div>
                        <div>Thuộc kho</div>
                        <div>Người kiểm</div>
                        <div>View</div>
                    </div>

                    {loading ? (
                        <div className="inventory-audit-table__loading">
                            <LoadingSpinner />
                        </div>
                    ) : data.length > 0 ? (
                        data.map((item) => (
                            <div className="inventory-audit-table__row" key={item._id}>
                                <div className="inventory-audit-code">
                                    {item.code}
                                </div>

                                <div className="inventory-audit-date">
                                    {formatCustom(item.audit_date)}
                                </div>

                                <div className="inventory-audit-warehouse">
                                    {item.warehouse.name}
                                </div>

                                <div className="inventory-audit-user">
                                    {item.created_by}
                                </div>

                                <div className="inventory-audit-actions">
                                    <Link
                                        to={`/admin/products/inventory/audit/detail/${item.code || item._id}`}
                                        className="inventory-audit-view"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="inventory-audit-empty">
                            Không có phiếu kiểm kê nào
                        </div>
                    )}

                    {!loading && renderpagination(pagination, setSearchParams, limit)}
                </div>
            </div>
        </div>
    );
}

export default InventoryAuditList;