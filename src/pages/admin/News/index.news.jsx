import "./NewsAdmin.scss";
import { Link } from "react-router-dom";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaRegNewspaper, FaEyeSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";
import Thumbnail from "../../../assets/banner/avatar-none.jpg";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function NewsAdmin() {
  const newsList = [
    {
      id: 1,
      title: "Apple công bố sản phẩm mới trong sự kiện tháng 3",
      category: "Công nghệ",
      author: "Admin",
      createdAt: "15/03/2026",
      status: "published",
      thumbnail: Thumbnail
    },
    {
      id: 2,
      title: "Thị trường chứng khoán có nhiều biến động mạnh",
      category: "Tài chính",
      author: "Editor",
      createdAt: "14/03/2026",
      status: "draft",
      thumbnail: Thumbnail
    },
    {
      id: 3,
      title: "Top điểm đến du lịch nổi bật mùa hè năm nay",
      category: "Du lịch",
      author: "Admin",
      createdAt: "13/03/2026",
      status: "published",
      thumbnail: Thumbnail
    },
    {
      id: 4,
      title: "Xu hướng AI đang thay đổi ngành truyền thông",
      category: "Công nghệ",
      author: "Editor",
      createdAt: "12/03/2026",
      status: "hidden",
      thumbnail: Thumbnail
    }
  ];

  return (
    <div className="news-admin-page">
      <SEO title="Quản lý bài viết" />

      <h2 className="news-admin-page__title">Quản Lý Bài Viết</h2>

      <div className="news-stats">
        <div className="stat-card stat-total">
          <p>
            <BsCalendarCheck /> Tổng bài viết
          </p>
          <Statistic value={128} formatter={formatter} />
        </div>

        <div className="stat-card stat-published">
          <p>
            <BsCheck2Circle /> Đã xuất bản
          </p>
          <Statistic value={92} formatter={formatter} />
        </div>

        <div className="stat-card stat-news">
          <p>
            <FaRegNewspaper /> Bài nổi bật
          </p>
          <Statistic value={16} formatter={formatter} />
        </div>

        <div className="stat-card stat-hidden">
          <p>
            <FaEyeSlash /> Đã ẩn
          </p>
          <Statistic value={20} formatter={formatter} />
        </div>
      </div>

      <div className="news-filters">
        <div className="search">
          <SearchOutlined />
          <input placeholder="Tìm tiêu đề bài viết..." />
        </div>

        <select>
          <option value="">Danh mục: Tất cả</option>
          <option value="cong-nghe">Công nghệ</option>
          <option value="tai-chinh">Tài chính</option>
          <option value="du-lich">Du lịch</option>
        </select>

        <select>
          <option value="">Trạng thái: Tất cả</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
          <option value="hidden">Đã ẩn</option>
        </select>

        <select>
          <option value="">-- Sắp xếp theo --</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="title-asc">Tên A-Z</option>
        </select>

        <button className="reset">
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select>
          <option value="">-- Chọn hành động --</option>
          <option value="publish">Xuất bản</option>
          <option value="hidden">Ẩn bài viết</option>
          <option value="delete">Xoá bài viết</option>
        </select>

        <button className="activity">Áp dụng</button>

        <Link className="create" to="/admin/news/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="news-table">
          <div className="table-header">
            <div>
              <input type="checkbox" />
            </div>
            <div className="col-news">Bài viết</div>
            <div>Danh mục</div>
            <div>Tác giả</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {newsList.map((item) => (
            <div className="table-row" key={item.id}>
              <div className="news-checkbox">
                <input type="checkbox" />
              </div>

              <div className="news-info col-news">
                <img src={item.thumbnail} alt={item.title} />
                <div>
                  <p className="news-name">{item.title}</p>
                  <span className="news-sub">Slug bài viết demo</span>
                </div>
              </div>

              <div>{item.category}</div>
              <div>{item.author}</div>
              <div>{item.createdAt}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === "published"
                    ? "Đã xuất bản"
                    : item.status === "draft"
                    ? "Bản nháp"
                    : "Đã ẩn"}
                </span>
              </div>

              <div className="actions">
                <Link className="edit" to={`/admin/news/edit/${item.id}`}>
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

export default NewsAdmin;