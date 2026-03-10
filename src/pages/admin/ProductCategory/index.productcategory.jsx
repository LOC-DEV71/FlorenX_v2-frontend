import "./Categories.scss";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { CgMathPlus } from "react-icons/cg";
import { Statistic } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { MdDeleteOutline } from "react-icons/md";
import SEO from "../../../utils/SEO";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function Categories() {
  const categoryList = [
    {
      id: 1,
      title: "Điện thoại",
      slug: "dien-thoai",
      thumbnail: "https://via.placeholder.com/40",
      position: 1,
      parent: "Không có",
      totalProduct: 24,
      status: "active",
      featured: "yes"
    },
    {
      id: 2,
      title: "Laptop",
      slug: "laptop",
      thumbnail: "https://via.placeholder.com/40",
      position: 2,
      parent: "Không có",
      totalProduct: 18,
      status: "active",
      featured: "no"
    },
    {
      id: 3,
      title: "Phụ kiện",
      slug: "phu-kien",
      thumbnail: "https://via.placeholder.com/40",
      position: 3,
      parent: "Điện tử",
      totalProduct: 40,
      status: "inactive",
      featured: "no"
    }
  ];

  return (
    <div className="category-page">
      <SEO title="Quản lý danh mục" />

      <h2 className="category-page__title">Quản Lý Danh Mục</h2>

      <div className="category-stats">
        <div className="stat-card stat-total">
          <p><BsCalendarCheck /> Total Categories</p>
          <Statistic value={128} formatter={formatter} />
        </div>

        <div className="stat-card stat-active">
          <p><BsCheck2Circle /> Active Categories</p>
          <Statistic value={96} formatter={formatter} />
        </div>

        <div className="stat-card stat-out">
          <p><RiErrorWarningLine /> Parent Categories</p>
          <Statistic value={18} formatter={formatter} />
        </div>

        <div className="stat-card stat-low">
          <p><CiWarning /> Child Categories</p>
          <Statistic value={110} formatter={formatter} />
        </div>
      </div>

      <div className="category-filters">
        <div className="search">
          <SearchOutlined />
          <input placeholder="Tìm tên danh mục hoặc slug..." />
        </div>

        <select>
          <option>Trạng thái: Tất cả</option>
          <option>Hoạt động</option>
          <option>Không hoạt động</option>
        </select>

        <select>
          <option>-- Sắp xếp theo --</option>
          <option>Tên A-Z</option>
          <option>Tên Z-A</option>
          <option>Vị trí thấp đến cao</option>
          <option>Vị trí cao đến thấp</option>
        </select>

        <button className="reset">
          <MdDeleteOutline /> Xóa lọc
        </button>

        <select>
          <option>-- Chọn hành động --</option>
          <option>Chuyển thành hoạt động</option>
          <option>Chuyển thành không hoạt động</option>
          <option>Thay đổi vị trí danh mục</option>
          <option>Xóa nhiều danh mục</option>
        </select>

        <button className="activity">Áp dụng</button>

        <Link className="create" to="/admin/categories/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="category-table">
          <div className="table-header">
            <div>
              <input type="checkbox" />
            </div>
            <div className="col-category">Danh mục</div>
            <div>Vị trí</div>
            <div>Danh mục cha</div>
            <div>Số SP</div>
            <div>Trạng thái</div>
            <div>Nổi bật</div>
            <div>Hành động</div>
          </div>

          {categoryList.map((item) => (
            <div className="table-row" key={item.id}>
              <span className={item.featured === "yes" ? "yes featured" : "no featured"}>
                {item.featured === "yes" ? "Nổi bật" : ""}
              </span>

              <div className="category-checkbox">
                <input type="checkbox" />
              </div>

              <div className="category-info col-category">
                <div className="category-images">
                  <img src={item.thumbnail} alt={item.title} />
                </div>

                <div>
                  <p className="category-name">{item.title}</p>
                  <span className="category-sub">{item.slug}</span>
                </div>
              </div>

              <div>
                <input
                  type="number"
                  defaultValue={item.position}
                  style={{ width: 60, textAlign: "center" }}
                />
              </div>

              <div>{item.parent}</div>
              <div>{item.totalProduct}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === "active" && "Hoạt động"}
                  {item.status === "inactive" && "Không hoạt động"}
                </span>
              </div>

              <div>{item.featured === "yes" ? "Có" : "Không"}</div>

              <div className="actions">
                <Link className="edit" to={`/admin/categories/update/${item.slug}`}>
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

export default Categories;