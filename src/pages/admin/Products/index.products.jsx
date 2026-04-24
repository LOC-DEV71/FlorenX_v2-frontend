import "./Products.scss";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic, Skeleton } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline, MdKeyboardArrowDown } from "react-icons/md";
import SEO from "../../../utils/SEO";
import { useState, useEffect, useRef } from "react";
import { getProducts, changeMulti } from "../../../services/admin/product.admin.service";
import { error, success, confirm } from "../../../utils/notift";
import { getListCategory } from "../../../services/admin/product.category.admin";
import { renderCategoryOptions } from "../../../utils/buildTree";
import { renderpagination } from "../../../utils/pagination";

const formatter = (value) => (
    <CountUp end={value} duration={2} separator="," />
);

function Products() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [typeChange, setTypeChange] = useState("");
    const [changePosition, setChangePosition] = useState({});
    const [selectId, setSelectId] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();
    const [totalProduct, setTotalProduct] = useState("");
    const [productsActive, setProductsActive] = useState("");
    const [countOutStock, setCountOutStock] = useState("");
    const [countLowStock, setCountLowStock] = useState("");
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openInventoryMenu, setOpenInventoryMenu] = useState(false);

    const inventoryMenuRef = useRef(null);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const sort = searchParams.get("sort") || "";
    const sortByCategory = searchParams.get("sortByCategory") || "";

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);

                const res = await getProducts({ page, limit, sort, sortByCategory });
                setData(res.data.products);
                setPagination(res.data.pagination);
                setTotalProduct(res.data.totalProduct);
                setProductsActive(res.data.productsActive);
                setCountOutStock(res.data.countOutStock);
                setCountLowStock(res.data.countLowStock);
            } catch (err) {
                console.log(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit, sort, reload, sortByCategory]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getListCategory();
                if (res.data.code) {
                    setCategory(res.data.categories);
                }
            } catch (err) {
                error(err.response?.data?.message);
            }
        };

        fetchApi();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                inventoryMenuRef.current &&
                !inventoryMenuRef.current.contains(event.target)
            ) {
                setOpenInventoryMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChangeMulti = async () => {
        try {
            if (!typeChange) {
                error("Vui lòng chọn hành động");
                return;
            }

            if (typeChange !== "position" && selectId.length === 0) {
                error("Vui lòng chọn ít nhất một sản phẩm");
                return;
            }

            if (typeChange === "delete") {
                const ok = await confirm(
                    "Xoá sản phẩm?",
                    "Sản phẩm bị xóa sẽ chuyển vào thùng rác"
                );

                if (!ok) return;

                const res = await changeMulti({ selectId, typeChange });
                if (res.data.code) {
                    success(res.data.message);
                } else {
                    error(res.data.message);
                }
            } else if (typeChange === "position") {
                const positions = Object.keys(changePosition).map((id) => ({
                    id,
                    position: changePosition[id]
                }));

                if (positions.length === 0) {
                    error("Vui lòng nhập vị trí cần thay đổi");
                    return;
                }

                const res = await changeMulti({
                    typeChange,
                    positions
                });

                if (res.data.code) {
                    success(res.data.message);
                } else {
                    error(res.data.message);
                }
            } else {
                const res = await changeMulti({
                    selectId,
                    typeChange
                });

                if (res.data.code) {
                    success(res.data.message);
                } else {
                    error(res.data.message);
                }
            }

            setChangePosition({});
            setSelectId([]);
            setTypeChange("");
            setReload((prev) => !prev);
        } catch (err) {
            error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleDeleteOne = async (id) => {
        try {
            const ok = await confirm(
                "Xoá sản phẩm?",
                "Sản phẩm bị xoá sẽ chuyển vào thùng rác"
            );

            if (!ok) return;

            const res = await changeMulti({
                selectId: [id],
                typeChange: "delete"
            });

            if (res.data.code) {
                success(res.data.message);
                setReload((prev) => !prev);
                setSelectId((prev) => prev.filter((item) => item !== id));
            } else {
                error(res.data.message);
            }
        } catch (err) {
            error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectId(data.map((item) => item._id));
        } else {
            setSelectId([]);
        }
    };

    const handleCategoryChange = (value) => {
        const nextParams = {
            page: 1,
            limit
        };

        if (sort) nextParams.sort = sort;
        if (value) nextParams.sortByCategory = value;

        setSearchParams(nextParams);
    };

    const handleSortChange = (value) => {
        const nextParams = {
            page: 1,
            limit
        };

        if (value) nextParams.sort = value;
        if (sortByCategory) nextParams.sortByCategory = sortByCategory;

        setSearchParams(nextParams);
    };

    return (
        <div className="admin-product-page">
            <SEO title="Quản lý sản phẩm" />
            <h2 className="admin-product-page__title">Quản Lý Sản Phẩm</h2>

            <div className="admin-product-stats">
                <div className="admin-stat-card admin-stat-total">
                    <p><BsCalendarCheck /> Total Products</p>
                    {loading ? (
                        <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
                    ) : (
                        <Statistic value={totalProduct} formatter={formatter} />
                    )}
                </div>

                <div className="admin-stat-card admin-stat-active">
                    <p><BsCheck2Circle /> Active Products</p>
                    {loading ? (
                        <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
                    ) : (
                        <Statistic value={productsActive} formatter={formatter} />
                    )}
                </div>

                <div className="admin-stat-card admin-stat-out">
                    <p><RiErrorWarningLine /> Out of Stock</p>
                    {loading ? (
                        <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
                    ) : (
                        <Statistic value={countOutStock} formatter={formatter} />
                    )}
                </div>

                <div className="admin-stat-card admin-stat-low">
                    <p><CiWarning /> Low Stock</p>
                    {loading ? (
                        <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
                    ) : (
                        <Statistic value={countLowStock} formatter={formatter} />
                    )}
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="admin-toolbar__filters">
                    <div className="admin-search">
                        <SearchOutlined />
                        <input placeholder="Tìm tên sản phẩm hoặc slug..." />
                    </div>

                    <select
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        value={sortByCategory}
                    >
                        <option value="">Danh mục: Tất cả</option>
                        {renderCategoryOptions(category)}
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="">-- Sắp xếp theo --</option>
                        <option value="position-asc">Sắp xếp theo vị trí thấp đến cao</option>
                        <option value="position-desc">Sắp xếp theo vị trí cao đến thấp</option>
                        <option value="price-asc">Sắp xếp theo giá thấp đến cao</option>
                        <option value="price-desc">Sắp xếp theo giá cao đến thấp</option>
                        <option value="title-asc">Sắp xếp theo tên A-Z</option>
                        <option value="title-desc">Sắp xếp theo tên Z-A</option>
                        <option value="featured-yes">Sản phẩm nổi bậc</option>
                        <option value="featured-no">Sản phẩm không nổi bậc</option>
                    </select>

                    <select
                        onChange={(e) => setTypeChange(e.target.value)}
                        value={typeChange}
                    >
                        <option value="">-- Chọn hành động --</option>
                        <option value="active">Chuyển thành hoạt động</option>
                        <option value="inactive">Chuyển thành không hoạt động</option>
                        <option value="position">Thay đổi vị trí sản phẩm</option>
                        <option value="delete">Xóa nhiều sản phẩm</option>
                    </select>
                </div>

                <div className="admin-toolbar__actions">
                    <button
                        className="admin-reset"
                        onClick={() => navigate("/admin/products")}
                    >
                        <MdDeleteOutline /> Xóa lọc
                    </button>

                    <button className="admin-activity" onClick={handleChangeMulti}>
                        Áp dụng
                    </button>

                    <Link className="admin-create" to="/admin/products/create">
                        <CgMathPlus /> Tạo mới
                    </Link>

                    <div className="admin-inventory-menu" ref={inventoryMenuRef}>
                        <button
                            type="button"
                            className={`admin-inventory-trigger ${openInventoryMenu ? "is-open" : ""}`}
                            onClick={() => setOpenInventoryMenu((prev) => !prev)}
                        >
                            Nghiệp vụ kho
                            <MdKeyboardArrowDown />
                        </button>

                        {openInventoryMenu && (
                            <div className="admin-inventory-dropdown">
                                <Link
                                    to="/admin/products/inventory/import/list"
                                    className="inventory-item inventory-item--import"
                                    onClick={() => setOpenInventoryMenu(false)}
                                >
                                    Nhập kho
                                </Link>

                                <Link
                                    to="/admin/products/inventory/export/list"
                                    className="inventory-item inventory-item--export"
                                    onClick={() => setOpenInventoryMenu(false)}
                                >
                                    Xuất kho
                                </Link>

                                <Link
                                    to="/admin/products/inventory/transfer"
                                    className="inventory-item inventory-item--transfer"
                                    onClick={() => setOpenInventoryMenu(false)}
                                >
                                    Chuyển kho
                                </Link>

                                <Link
                                    to="/admin/products/inventory/audit/list"
                                    className="inventory-item inventory-item--audit"
                                    onClick={() => setOpenInventoryMenu(false)}
                                >
                                    Kiểm kê
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <div className="admin-product-table">
                    <div className="admin-table-header">
                        <div>
                            <input
                                type="checkbox"
                                checked={data.length > 0 && data.length === selectId.length}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </div>
                        <div className="admin-col-product">Sản phẩm</div>
                        <div>Vị trí</div>
                        <div>Danh mục</div>
                        <div>Giá</div>
                        <div>Số lượng</div>
                        <div>Trạng thái</div>
                        <div>Giảm giá</div>
                        <div>Hành động</div>
                    </div>

                    {loading
                        ? Array(limit).fill(0).map((_, i) => (
                            <div className="admin-table-row" key={i}>
                                <div>
                                    <Skeleton.Avatar active shape style={{ width: 15, height: 15 }} />
                                </div>

                                <div className="admin-product-info admin-col-product">
                                    <Skeleton.Image active style={{ width: 50, height: 50 }} />
                                    <div>
                                        <Skeleton.Input active style={{ width: 200, height: 60, marginBottom: 20 }} />
                                        <Skeleton.Input active style={{ width: 30, height: 20 }} />
                                    </div>
                                </div>

                                <Skeleton.Input active size="small" />
                                <Skeleton.Input active size="small" />
                                <Skeleton.Input active size="small" />
                                <Skeleton.Input active size="small" />
                                <Skeleton.Input active size="small" />
                                <Skeleton.Input active size="small" />
                            </div>
                        ))
                        : data.map((item) => (
                            <div className="admin-table-row" key={item._id}>
                                <span
                                    className={
                                        item.featured === "yes"
                                            ? "admin-yes admin-featured"
                                            : "admin-no admin-featured"
                                    }
                                >
                                    {item.featured === "yes" ? "Nổi bật" : ""}
                                </span>

                                <div className="admin-product-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectId.includes(item._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectId((prev) => [...prev, item._id]);
                                            } else {
                                                setSelectId((prev) =>
                                                    prev.filter((id) => id !== item._id)
                                                );
                                            }
                                        }}
                                    />
                                </div>

                                <div className="admin-product-info admin-col-product">
                                    <div className="admin-product-images">
                                        <img src={item.thumbnail} alt={item.title} />
                                    </div>

                                    <div>
                                        <p className="admin-product-name">{item.title}</p>
                                        <span className="admin-product-sub">Sample product</span>
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        defaultValue={item.position}
                                        style={{ width: 60, textAlign: "center" }}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);

                                            setChangePosition((prev) => ({
                                                ...prev,
                                                [item._id]: value
                                            }));
                                        }}
                                    />
                                </div>

                                <div>category</div>
                                <div>{item.price.toLocaleString("VN-vi")}đ</div>
                                <div>{item.stock}</div>

                                <div>
                                    <span className={`admin-status ${item.status}`}>
                                        {item.status === "active" && "active"}
                                        {item.status === "inactive" && "inactive"}
                                    </span>
                                </div>

                                <div>
                                    {item.discountPercentage
                                        ? `${item.discountPercentage} %`
                                        : "Không có"}
                                </div>

                                <div className="admin-actions">
                                    <Link className="admin-edit" to={`/admin/products/update/${item.slug}`}>
                                        Edit
                                    </Link>
                                    <button
                                        className="admin-delete"
                                        onClick={() => handleDeleteOne(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                    {renderpagination(pagination, setSearchParams, limit, sort, sortByCategory)}
                </div>
            </div>
        </div>
    );
}

export default Products;