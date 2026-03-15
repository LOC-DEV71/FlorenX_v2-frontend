import "./Products.scss";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons"
import SEO from "../../../utils/SEO";
import { useState } from "react";
import { getProducts, changeMulti } from "../../../services/admin/product.admin.service";
import { useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { renderpagination } from "../../../utils/pagination";
import { Skeleton } from "antd";
import { error, success, confirm  } from "../../../utils/notift";
import { getListCategory } from "../../../services/admin/product.category.admin";
import { renderCategoryOptions } from "../../../utils/buildTree";
const formatter = (value) => (
    <CountUp end={value} duration={2} separator="," />
);

function Products() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([])
    const [typeChange, setTypeChange] = useState("");
    const [changePosition, setChangePosition] = useState({});
    const [selectId, setSelectId] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const [reload, setReload] = useState(false)
    const navigate = useNavigate();
    const [totalProduct, setTotalProduct] = useState("")
    const [productsActive, setProductsActive] = useState("")
    const [countOutStock, setCountOutStock] = useState("")
    const [countLowStock, setCountLowStock] = useState("")
    const [category, setCategory] = useState([])

    const [loading, setLoading] = useState(false);

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
                setTotalProduct(res.data.totalProduct)
                setProductsActive(res.data.productsActive)
                setCountOutStock(res.data.countOutStock)
                setCountLowStock(res.data.countLowStock)

            } catch (error) {
                console.log(error.response?.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [page, limit, sort, reload, sortByCategory]);

    const handleChangeMulti = async () => {
        try {

            if (typeChange === "delete") {
                const ok = await confirm(
                    "Xoá sản phẩm?",
                    "Sản phẩm bị xóa sẽ chuyển vào thùng rác"
                );

                if (!ok) return;
                const res = await changeMulti({selectId, typeChange})
                if(res.data.code){
                    success(res.data.message)
                }
            }

            if (typeChange === "position") {

                const positions = Object.keys(changePosition).map(id => ({
                    id,
                    position: changePosition[id]
                }));

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
            setReload(prev => !prev);

        } catch (error) {
            console.log(error.response?.data.message);
        }
    };

    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getListCategory();
                if(res.data.code){
                    setCategory(res.data.categories)
                }
            }
            fetchApi()
        } catch (err) {
            error(err.response?.data?.message)
        }
    }, [])

    return (

        <div className="product-page">
            <SEO
                title="Quản lý sản phẩm"
            />
            <h2 className="product-page__title">Quản Lý Sản Phẩm</h2>

            {/* Stats */}
            <div className="product-stats">

                <div className="stat-card stat-total">
                    <p><BsCalendarCheck /> Total Products</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={totalProduct} formatter={formatter} />}
                </div>

                <div className="stat-card stat-active">
                    <p><BsCheck2Circle /> Active Products</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={productsActive} formatter={formatter} />}
                </div>

                <div className="stat-card stat-out">
                    <p><RiErrorWarningLine /> Out of Stock</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={countOutStock} formatter={formatter} />}
                </div>

                <div className="stat-card stat-low">
                    <p><CiWarning /> Low Stock</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={countLowStock} formatter={formatter} />}
                </div>

            </div>

            {/* Filters */}
            <div className="product-filters">
                <div className="search">
                    <SearchOutlined />
                    <input placeholder="Tìm tên sản phẩm hoặc slug..." />
                </div>

                <select
                    onChange={e =>
                        setSearchParams({
                            page: 1,
                            limit,
                            sort: e.target.value,
                            sortByCategory: e.target.value
                        })
                    }
                    value={sortByCategory}
                >
                    <option>Danh mục: Tất cả</option>
                    {renderCategoryOptions(category)}
                </select>

                <select
                    value={sort}
                    onChange={e =>
                        setSearchParams({
                            page: 1,
                            limit,
                            sort: e.target.value
                        })
                    }
                >
                    <option value={""}>-- Sắp xếp theo --</option>
                    <option value={"position-asc"}>Sắp xếp theo vị trí thấp đến cao</option>
                    <option value={"position-desc"}>Sắp xếp theo vị trí cao đến thấp</option>
                    <option value={"price-asc"}>Sắp xếp theo giá thấp đến cao</option>
                    <option value={"price-desc"}>Sắp xếp theo giá cao đến thấp</option>
                    <option value={"title-asc"}>Sắp xếp theo tên A-Z</option>
                    <option value={"title-desc"}>Sắp xếp theo tên Z-A</option>
                    <option value={"featured-yes"}>Sản phẩm nổi bậc</option>
                    <option value={"featured-no"}>Sản phẩm không nổi bậc</option>
                </select>

                <button className="reset"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                ><MdDeleteOutline /> Xóa lọc</button>


                <select
                    onChange={e => setTypeChange(e.target.value)}
                    value={typeChange}
                >
                    <option value="">-- Chọn hành động --</option>
                    <option value="active">Chuyển thành hoạt động</option>
                    <option value="inactive">Chuyển thành không hoạt động</option>
                    <option value="position">Thay đổi vị trí sản phẩm</option>
                    <option value="delete">Xóa nhiều sản phẩm</option>
                </select>

                <button className="activity" onClick={handleChangeMulti}>Áp dụng</button>

                <Link className="create" to={"/admin/products/create"}>
                    <CgMathPlus /> Tạo mới
                </Link>
            </div>

            {/* Table */}
            <div className="table-wrapper">

                <div className="product-table">

                    <div className="table-header">
                        <div>
                            <input
                                type="checkbox"
                                checked={data.length && data.length === selectId.length}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectId(data.map(i => i._id))
                                    } else {
                                        setSelectId([])
                                    }
                                }}
                            />
                        </div>
                        <div className="col-product">Sản phẩm</div>
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
                            <div className="table-row" key={i}>
                                <div><Skeleton.Avatar active shape style={{ width: 15, height: 15 }} /></div>

                                <div className="product-info col-product">
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
                            <div className="table-row" key={item._id}>
                                <span className={item.featured === "yes" ? "yes featured" : "no featured"}>{item.featured === "yes" ? "Nổi bật" : ""}</span>
                                <div className="product-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectId.includes(item._id)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectId(prev => [...prev, item._id])
                                            } else {
                                                setSelectId(prev =>
                                                    prev.filter(id => id != item._id)
                                                )
                                            }
                                        }}
                                    />
                                </div>
                                <div className="product-info col-product">



                                    <div className="product-images">
                                        <img src={item.thumbnail} alt={item.title} />
                                    </div>

                                    <div>
                                        <p className="product-name">{item.title}</p>
                                        <span className="product-sub">Sample product</span>
                                    </div>

                                </div>

                                <div>
                                    <input
                                        type="number"
                                        defaultValue={item.position}
                                        style={{ width: 60, textAlign: "center" }}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);

                                            setChangePosition(prev => ({
                                                ...prev,
                                                [item._id]: value
                                            }))
                                        }}
                                    />
                                </div>

                                <div>category</div>
                                <div>{item.price.toLocaleString("VN-vi")}đ</div>
                                <div>{item.stock}</div>

                                <div>
                                    <span className={`status ${item.status}`}>
                                        {item.status === "active" && "active"}
                                        {item.status === "inactive" && "inactive"}
                                    </span>
                                </div>

                                <div>{item.discountPercentage ? `${item.discountPercentage} %` : "Không có"}</div>

                                <div className="actions">
                                    <Link className="edit" to={`/admin/products/update/${item.slug}`}>Edit</Link>
                                    <button className="delete">Delete</button>
                                </div>

                            </div>
                        ))
                    }


                    {renderpagination(pagination, setSearchParams, limit, sort, sortByCategory)}

                </div>

            </div>

        </div>
    );
}

export default Products;