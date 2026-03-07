import "./Products.scss";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic } from "antd";
import CountUp from "react-countup";
import {SearchOutlined} from "@ant-design/icons"

const formatter = (value) => (
    <CountUp end={value} duration={2} separator="," />
);

const product = [
    {
        id: 1,
        name: "Premium Quartz Watch",
        sku: "WATCH-772",
        category: "Electronics",
        price: 199,
        stock: 124,
        status: "active",
        created: "Oct 12, 2023",
        images: ["/products/watch.jpg"]
    },
    {
        id: 2,
        name: "Wireless Headphones",
        sku: "AUD-042",
        category: "Electronics",
        price: 249,
        stock: 12,
        status: "low",
        created: "Nov 04, 2023",
        images: ["/products/headphone1.jpg", "/products/headphone2.jpg"]
    }
];

function Products() {
    return (
        <div className="product-page">

            <h2 className="product-page__title">Quản Lý Sản Phẩm</h2>

            {/* Stats */}
            <div className="product-stats">

                <div className="stat-card stat-total">
                    <p><BsCalendarCheck /> Total Products</p>
                    <Statistic value={1128} formatter={formatter} />
                </div>

                <div className="stat-card stat-active">
                    <p><BsCheck2Circle /> Active Products</p>
                    <Statistic value={1050} formatter={formatter} />
                </div>

                <div className="stat-card stat-out">
                    <p><RiErrorWarningLine /> Out of Stock</p>
                    <Statistic value={42} formatter={formatter} />
                </div>

                <div className="stat-card stat-low">
                    <p><CiWarning /> Low Stock</p>
                    <Statistic value={18} formatter={formatter} />
                </div>

            </div>

            {/* Filters */}
            <div className="product-filters">
                <div className="search">
                    <SearchOutlined/>
                    <input placeholder="Search product name, SKU..." />
                </div>

                <select>
                    <option>Category: All</option>
                </select>

                <select>
                    <option>Status: All</option>
                </select>

                <input placeholder="Min Price" />
                <input placeholder="Max Price" />

                <button>Reset</button>

                <Link className="create" to={"/admin/products/create"}>
                    <CgMathPlus /> Tạo mới
                </Link>
            </div>

            {/* Table */}
            <div className="table-wrapper">

                <div className="product-table">

                    <div className="table-header">
                        <div><input type="checkbox" /></div>
                        <div className="col-product">Product</div>
                        <div>SKU</div>
                        <div>Category</div>
                        <div>Price</div>
                        <div>Stock</div>
                        <div>Status</div>
                        <div>Created</div>
                        <div>Action</div>
                    </div>

                    {product.map((p) => (
                        <div className="table-row" key={p.id}>

                            <div className="product-info col-product">

                                <div className="product-checkbox">
                                    <input type="checkbox" />
                                </div>

                                <div className="product-images">
                                    {p.images.map((img, i) => (
                                        <img key={i} src={img} alt="" />
                                    ))}
                                </div>

                                <div>
                                    <p className="product-name">{p.name}</p>
                                    <span className="product-sub">Sample product</span>
                                </div>

                            </div>

                            <div>{p.sku}</div>
                            <div>{p.category}</div>
                            <div>${p.price}</div>
                            <div>{p.stock}</div>

                            <div>
                                <span className={`status ${p.status}`}>
                                    {p.status === "active" && "ACTIVE"}
                                    {p.status === "low" && "LOW STOCK"}
                                </span>
                            </div>

                            <div>{p.created}</div>

                            <div className="actions">
                                <button>Edit</button>
                                <button>Delete</button>
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default Products;