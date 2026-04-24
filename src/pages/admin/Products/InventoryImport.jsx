import "./InventoryImport.scss";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline, MdOutlineKeyboardBackspace } from "react-icons/md";
import { getListInventoryImport } from "../../../services/admin/InventoryTransaction.service";
import { renderpagination } from "../../../utils/pagination";
import SEO from "../../../utils/SEO";
import { getWarehouseList } from "../../../services/admin/warehouse.service";

function InventoryImportList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [warehouses, setWarehouses] = useState([]);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const warehouse = searchParams.get("warehouse") || "";
    const import_price = searchParams.get("import_price") || "";
    const sort = searchParams.get("sort") || "";
    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const res = await getListInventoryImport({ page, limit, warehouse, import_price, sort, search });
                if (res?.data?.code) {
                    setData(res?.data?.data);
                    setPagination(res?.data?.pagination);
                }
            } catch (err) {
                console.error(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit, warehouse, import_price, sort, search]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getWarehouseList();
                setWarehouses(res?.data?.warehouse || []);
            } catch (err) {
                console.log(err?.response?.data?.message);
            }
        };

        fetchApi();
    }, []);

    return (
        <div className="inventory-import-list-page">
            <SEO title={"Danh sách nhập kho"} />

            <div className="inventory-import-list-page__header">
                <div>
                    <h2>Danh sách nhập kho</h2>
                    <p>Quản lý các phiếu nhập kho sản phẩm</p>
                </div>

                <div className="inventory-import-list-page__actions">
                    <Link to={"/admin/products"} className="come-back">
                        <MdOutlineKeyboardBackspace /> Quay Lại
                    </Link>
                    <Link
                        className="inventory-audit-create-btn"
                        to={"/admin/products/inventory/import/create"}
                    >
                        + Tạo phiếu nhập
                    </Link>
                </div>
            </div>

            {/* FILTER UI ONLY */}
            <div className="admin-toolbar inventory-import-toolbar">
                <div className="admin-toolbar__filters">
                    <div className="admin-search">
                        <SearchOutlined />
                        <input placeholder="Tìm mã nhập..." onChange={e => 
                            setSearchParams({
                                page: 1,
                                limit,
                                search: e.target.value
                            })
                        } value={search}/>
                    </div>

                    <select value={warehouse} onChange={e => setSearchParams({
                        limit,
                        page: 1,
                        warehouse: e.target.value
                    })}>
                        <option value="">Kho: Tất cả</option>
                        {warehouses.map(item => (
                            <option value={item._id} key={item._id}>{item.name}</option>
                        ))}
                    </select>

                    <select value={import_price} onChange={e => setSearchParams({
                        limit,
                        page: 1,
                        import_price: e.target.value
                    })}>
                        <option value="">Mức giá nhập: Tất cả</option>
                        <option value="low">Thấp đến cao</option>
                        <option value="high">Cao đến thấp</option>
                    </select>

                    <select value={sort} onChange={e => setSearchParams({
                        limit,
                        page: 1,
                        sort: e.target.value
                    })}>
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
                        <div>Mã nhập</div>
                        <div className="admin-col-product">Sản phẩm</div>
                        <div>Kho</div>
                        <div>Giá nhập</div>
                        <div>Số lượng</div>
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
                                  <div className="skeleton-line skeleton-line--md"></div>
                                  <div className="skeleton-line skeleton-line--sm"></div>
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
                                      <span className="inventory-import-price">
                                          {item.import_price.toLocaleString("vi-VN")}đ
                                      </span>
                                  </div>

                                  <div>
                                      <span className="inventory-import-quantity">
                                          {item.quantity}
                                      </span>
                                  </div>

                                  <div className="admin-actions">
                                      <Link
                                          to={`/admin/inventory-import/${item._id}`}
                                          className="admin-edit"
                                      >
                                          Chi tiết
                                      </Link>
                                  </div>
                              </div>
                          ))}

                    {renderpagination(pagination, setSearchParams, limit, sort, "", warehouse, import_price, search)}
                </div>
            </div>
        </div>
    );
}

export default InventoryImportList;