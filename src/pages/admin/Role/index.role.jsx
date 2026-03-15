import "./Roles.scss";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic, Skeleton } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import SEO from "../../../utils/SEO";
import { useEffect, useState } from "react";
import { confirm, error } from "../../../utils/notift";
import { changeMulti, getListRolesIndex } from "../../../services/admin/roles.admin.service";

const formatter = (value) => (
    <CountUp end={value} duration={2} separator="," />
);

function Roles() {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);


    const [pagination, setPagination] = useState([])
    const [typeChange, setTypeChange] = useState("");
    const [selectId, setSelectId] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const [reload, setReload] = useState(false)
    const navigate = useNavigate();
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const sort = searchParams.get("sort") || "";
    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getListRolesIndex({sort, limit, page});
                if (res.data.code) {
                    setRoles(res.data.roles)
                }
            }
            fetchApi()
        } catch (err) {
            error(err.response?.data.message)
        } finally {
            setLoading(false)
        }
    }, [reload, sort, limit, page])



    const handleChangeMulti = async () => {
        try {

            if (typeChange === "delete") {
                const ok = await confirm(
                    "Xoá sản phẩm?",
                    "Sản phẩm bị xóa sẽ chuyển vào thùng rác"
                );

                if (!ok) return;
                const res = await changeMulti({ selectId, typeChange })
                if (res.data.code) {
                    success(res.data.message)
                }
            }

            setSelectId([]);
            setTypeChange("");
            setReload(prev => !prev);

        } catch (error) {
            console.log(error.response?.data.message);
        }
    };

    return (
        <div className="product-page">
            <h2 className="product-page__title">Quản Lý nhóm quyền</h2>
            <SEO title="Quản lý nhóm quyền" />
            {/* Stats */}
            <div className="product-stats">
                <div className="stat-card stat-total">
                    <p><BsCalendarCheck /> Total Roles</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={12} formatter={formatter} />}
                </div>

                <div className="stat-card stat-active">
                    <p><BsCheck2Circle /> Active Roles</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={8} formatter={formatter} />}
                </div>

                <div className="stat-card stat-out">
                    <p><RiErrorWarningLine /> Inactive Roles</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={4} formatter={formatter} />}
                </div>

                <div className="stat-card stat-low">
                    <p><CiWarning /> System Roles</p>
                    {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={3} formatter={formatter} />}
                </div>
            </div>

            {/* Filters */}
            <div className="product-filters">
                <div className="search">
                    <SearchOutlined />
                    <input placeholder="Tìm tên role hoặc slug..." />
                </div>

                <select>
                    <option>Tất cả role</option>
                </select>

                <select
                    onChange={e => setSearchParams({
                        page: 1,
                        limit,
                        sort: e.target.value
                    })}
                >
                    <option value="">-- Sắp xếp theo --</option>
                    <option value="title-asc">Sắp xếp theo tên A-Z</option>
                    <option value="title-desc">Sắp xếp theo tên Z-A</option>
                    <option value="slug-asc">Sắp xếp theo slug A-Z</option>
                    <option value="slug-desc">Sắp xếp theo slug Z-A</option>
                </select>

                <button className="reset">
                    <MdDeleteOutline /> Xóa lọc
                </button>

                <select
                    onChange={e => setTypeChange(e.target.value)}
                    value={typeChange}
                >
                    <option value="" >-- Chọn hành động --</option>
                    <option value="delete">Xóa nhiều role</option>
                </select>

                <button className="activity" onClick={handleChangeMulti}>Áp dụng</button>

                <Link className="create" to={"/admin/roles/create"}>
                    <CgMathPlus /> Tạo mới
                </Link>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <div className="product-table">
                    <div className="table-header role-table-header">
                        <div>
                            <input
                                type="checkbox"
                                checked={roles.length > 0 && roles.length === selectId.length}
                                onChange={e => {
                                    if (e.target.checked) {
                                        setSelectId(roles.map(item => item._id))
                                    } else {
                                        setSelectId([])
                                    }
                                }}
                            />
                        </div>
                        <div className="col-product">Title</div>
                        <div>Description</div>
                        <div>Slug</div>
                        <div>Edit</div>
                        <div>Delete</div>
                    </div>

                    {loading
                        ? Array(5).fill(0).map((_, i) => (
                            <div className="table-row role-table-row" key={i}>
                                <div>
                                    <Skeleton.Avatar active shape style={{ width: 15, height: 15 }} />
                                </div>

                                <div className="product-info col-product">
                                    <Skeleton.Input active style={{ width: 180, height: 20 }} />
                                </div>

                                <Skeleton.Input active style={{ width: "90%", height: 20 }} />
                                <Skeleton.Input active style={{ width: "80%", height: 20 }} />
                                <Skeleton.Button active size="small" />
                                <Skeleton.Button active size="small" />
                            </div>
                        ))
                        : roles.map((item) => (
                            <div className="table-row role-table-row" key={item._id}>
                                <div className="product-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectId.includes(item._id)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectId(prev => [...prev, item._id])
                                            } else {
                                                setSelectId(prev => prev.filter(i => i != item._id))
                                            }
                                        }}
                                    />
                                </div>

                                <div className="product-info col-product">
                                    <div>
                                        <p className="product-name">{item.title}</p>
                                    </div>
                                </div>

                                <div className="role-description" dangerouslySetInnerHTML={{ __html: item.description }} />
                                <div>{item.slug}</div>

                                <div className="actions">
                                    <Link className="edit" to={`/admin/roles/update/${item.slug}`}>Edit</Link>
                                </div>

                                <div className="actions">
                                    <button className="delete">Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Roles;