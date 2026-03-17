import "./NewsCategoryAdmin.scss";
import { Link } from "react-router-dom";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaLayerGroup, FaEyeSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function NewsCategoryAdmin() {
  const categoryList = [
    {
      id: 1,
      name: "Công nghệ",
      slug: "cong-nghe",
      quantity: 24,
      createdAt: "15/03/2026",
      status: "active"
    },
    {
      id: 2,
      name: "Tài chính",
      slug: "tai-chinh",
      quantity: 18,
      createdAt: "14/03/2026",
      status: "active"
    },
    {
      id: 3,
      name: "Du lịch",
      slug: "du-lich",
      quantity: 12,
      createdAt: "13/03/2026",
      status: "inactive"
    },
    {
      id: 4,
      name: "Thể thao",
      slug: "the-thao",
      quantity: 9,
      createdAt: "12/03/2026",
      status: "active"
    }
  ];

  return (
    <div className="news-category-admin-page">
      <SEO title="Quản lý danh mục bài viết" />

      <h2 className="news-category-admin-page__title">Quản Lý Danh Mục Bài Viết</h2>

      <div className="category-stats">
        <div className="stat-card stat-total">
          <p>
            <BsCalendarCheck /> Tổng danh mục
          </p>
          <Statistic value={18} formatter={formatter} />
        </div>

        <div className="stat-card stat-active">
          <p>
            <BsCheck2Circle /> Đang hoạt động
          </p>
          <Statistic value={14} formatter={formatter} />
        </div>

        <div className="stat-card stat-category">
          <p>
            <FaLayerGroup /> Danh mục nổi bật
          </p>
          <Statistic value={5} formatter={formatter} />
        </div>

        <div className="stat-card stat-hidden">
          <p>
            <FaEyeSlash /> Tạm ẩn
          </p>
          <Statistic value={4} formatter={formatter} />
        </div>
      </div>

      <div className="category-filters">
        <div className="search">
          <SearchOutlined />
          <input placeholder="Tìm tên danh mục..." />
        </div>

        <select>
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select>
          <option value="">-- Sắp xếp theo --</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="newest">Mới nhất</option>
        </select>

        <button className="reset">
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select>
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển hoạt động</option>
          <option value="inactive">Chuyển không hoạt động</option>
          <option value="delete">Xoá danh mục</option>
        </select>

        <button className="activity">Áp dụng</button>

        <Link className="create" to="/admin/new-categories/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="category-table">
          <div className="table-header">
            <div>
              <input type="checkbox" />
            </div>
            <div className="col-category">Tên danh mục</div>
            <div>Slug</div>
            <div>Số bài viết</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {categoryList.map((item) => (
            <div className="table-row" key={item.id}>
              <div className="category-checkbox">
                <input type="checkbox" />
              </div>

              <div className="category-info col-category">
                <div className="category-thumb">{item.name.charAt(0)}</div>
                <div>
                  <p className="category-name">{item.name}</p>
                  <span className="category-sub">Danh mục bài viết</span>
                </div>
              </div>

              <div>{item.slug}</div>
              <div>{item.quantity}</div>
              <div>{item.createdAt}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              <div className="actions">
                <Link className="edit" to={`/admin/news-category/edit/${item.id}`}>
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

export default NewsCategoryAdmin;