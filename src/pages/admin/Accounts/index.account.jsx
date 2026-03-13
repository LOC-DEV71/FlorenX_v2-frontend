import "./AccountAdmin.scss";
import { Link } from "react-router-dom";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaUserShield, FaUserSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function AccountAdmin() {
  const accounts = [
    {
      id: 1,
      fullName: "Lộc Lâm",
      email: "1945musictrending@gmail.com",
      phone: "0987654321",
      role: "admin",
      status: "active",
      createdAt: "13/03/2026",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      id: 2,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0912345678",
      role: "staff",
      status: "inactive",
      createdAt: "10/03/2026",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: 3,
      fullName: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0909009009",
      role: "admin",
      status: "active",
      createdAt: "08/03/2026",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

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

        <select defaultValue="">
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select defaultValue="">
          <option value="">-- Sắp xếp theo --</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>

        <button className="reset">
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select defaultValue="">
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển thành hoạt động</option>
          <option value="inactive">Chuyển thành không hoạt động</option>
          <option value="delete">Xoá nhiều tài khoản</option>
        </select>

        <button className="activity">Áp dụng</button>

        <Link className="create" to="/admin/accounts/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="account-table">
          <div className="table-header">
            <div>
              <input type="checkbox" />
            </div>
            <div className="col-account">Tài khoản</div>
            <div>Số điện thoại</div>
            <div>Vai trò</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {accounts.map((item) => (
            <div className="table-row" key={item.id}>
              <div className="account-checkbox">
                <input type="checkbox" />
              </div>

              <div className="account-info col-account">
                <img src={item.avatar} alt={item.fullName} />
                <div>
                  <p className="account-name">{item.fullName}</p>
                  <span className="account-sub">{item.email}</span>
                </div>
              </div>

              <div>{item.phone}</div>

              <div>
                <span className={`role ${item.role}`}>
                  {item.role === "admin" ? "Admin" : "Staff"}
                </span>
              </div>

              <div>{item.createdAt}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              <div className="actions">
                <Link className="edit" to={`/admin/accounts/edit/${item.id}`}>
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