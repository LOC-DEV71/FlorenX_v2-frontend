import "./AccountAdmin.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaUserShield, FaUserSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";
import { useState } from "react";
import { useEffect } from "react";
import { confirm, error, success } from "../../../utils/notift";
import { getListAccount, changeMulti } from "../../../services/admin/account.admin.service";
import Avatar from "../../../assets/banner/avatar-none.jpg";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function AccountAdmin() {
  const [accounts, setAccounts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeChange, setTypeChange] = useState("");
  const [selectId, setSelectId] = useState([])
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const sort = searchParams.get("sort") || "";
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const fetchApi = async () => {

        const res = await getListAccount({page, limit, sort});
        if (res.data.code) {
          setAccounts(res.data.accounts)
        }
      }
      fetchApi()
    } catch (err) {
      error(error.response?.data.message)
    }
  }, [reload, page, limit, sort]);

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
        const res = await changeMulti({
          selectId,
          typeChange
        });

        if (res.data.code) {
          success(res.data.message);
        } else {
          error(res.data.message);
        }
        setSelectId([]);
        setTypeChange("");
        setReload(prev => !prev);

    } catch (error) {
      console.log(error.response?.data.message);
    }
  };

  return (
    <div className="account-admin-page">
      <SEO title="Quản lý tài khoản admin" />

      <h2 className="account-admin-page__title">Quản Lý Tài Khoản Admin</h2>

      <div className="account-stats">
        <div className="stat-card stat-total">
          <p>
            <BsCalendarCheck /> Total Accounts
          </p>
          <Statistic value={25} formatter={formatter} />
        </div>

        <div className="stat-card stat-active">
          <p>
            <BsCheck2Circle /> Active Accounts
          </p>
          <Statistic value={18} formatter={formatter} />
        </div>

        <div className="stat-card stat-admin">
          <p>
            <FaUserShield /> Admin Accounts
          </p>
          <Statistic value={7} formatter={formatter} />
        </div>

        <div className="stat-card stat-blocked">
          <p>
            <FaUserSlash /> Blocked Accounts
          </p>
          <Statistic value={4} formatter={formatter} />
        </div>
      </div>

      <div className="account-filters">
        <div className="search">
          <SearchOutlined />
          <input placeholder="Tìm tên tài khoản hoặc email..." />
        </div>

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
          <option value="">Trạng thái: Tất cả</option>
          <option value="status-active">Hoạt động</option>
          <option value="status-inactive">Không hoạt động</option>
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
          <option value="">-- Sắp xếp theo --</option>
          <option value="fullname-asc">Tên A-Z</option>
          <option value="fullname-desc">Tên Z-A</option>
        </select>

        <button className="reset" 
          onClick={() =>
            navigate("/admin/accounts")
          }>
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select
          value={typeChange}
          onChange={e => setTypeChange(e.target.value)}
        >
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển thành hoạt động</option>
          <option value="inactive">Chuyển thành không hoạt động</option>
          <option value="delete">Xoá nhiều tài khoản</option>
        </select>

        <button className="activity" onClick={handleChangeMulti}>Áp dụng</button>

        <Link className="create" to="/admin/accounts/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="account-table">
          <div className="table-header">
            <div>
              <input 
                type="checkbox" 
                checked={accounts.length > 0 && selectId.length === accounts.length}
                onChange={e => {
                  if(e.target.checked){
                    setSelectId(accounts.map(item => item._id))
                  } else {
                    setSelectId([])
                  }
                }}
              />
            </div>
            <div className="col-account">Tài khoản</div>
            <div>Số điện thoại</div>
            <div>Vai trò</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {accounts.map((item) => (
            <div className="table-row" key={item._id}>
              <div className="account-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectId.includes(item._id)}
                  onChange={e => {
                    if(e.target.checked){
                      setSelectId(prev => [...prev, item._id])
                    } else {
                      setSelectId(prev => prev.filter(id => id != item._id))
                    }
                  }}
                />
              </div>

              <div className="account-info col-account">
                <img src={item.avatar ? item.avatar : Avatar} alt={item.fullname} />
                <div>
                  <p className="account-name">{item.fullname}</p>
                  <span className="account-sub">{item.email}</span>
                </div>
              </div>

              <div>{item.phone}</div>

              <div>
                <span className={`role ${item.role_slug}`}>
                  {item.role_slug}
                </span>
              </div>

              <div>{item.createdAt}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              <div className="actions">
                <Link className="edit" to={`/admin/accounts/update/${item._id}`}>
                  Edit
                </Link>
                <button className="delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountAdmin;