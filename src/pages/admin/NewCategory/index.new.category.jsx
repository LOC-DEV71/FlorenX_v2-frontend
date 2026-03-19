import "./NewsCategoryAdmin.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Statistic, Skeleton } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaLayerGroup, FaEyeSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";
import { useEffect, useState } from "react";
import { error, success, confirm } from "../../../utils/notift";
import {
  getNewsCategories,
  changeMultiNewsCategory
} from "../../../services/admin/news.category.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { renderpagination } from "../../../utils/pagination";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function NewsCategoryAdmin() {
  const [categoryList, setCategoryList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [totalCategory, setTotalCategory] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [featuredCategory, setFeaturedCategory] = useState(0);
  const [inactiveCategory, setInactiveCategory] = useState(0);

  const [selectId, setSelectId] = useState([]);
  const [typeChange, setTypeChange] = useState("");
  const [reload, setReload] = useState(false);

  const [keywordInput, setKeywordInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const sort = searchParams.get("sort") || "";
  const status = searchParams.get("status") || "";
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);

        const res = await getNewsCategories({
          page,
          limit,
          sort,
          status,
          keyword
        });

        if (res.data.code) {
          setCategoryList(res.data.newsCategory);
          setPagination(res.data.pagination);
          setTotalCategory(res.data.totalCategory);
          setActiveCategory(res.data.activeCategory);
          setFeaturedCategory(res.data.featuredCategory);
          setInactiveCategory(res.data.inactiveCategory);
        }
      } catch (err) {
        error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [page, limit, sort, status, keyword, reload]);

  const handleSearch = () => {
    const params = {
      page: 1,
      limit
    };

    if (sort) params.sort = sort;
    if (status) params.status = status;
    if (keywordInput.trim()) params.keyword = keywordInput.trim();

    setSearchParams(params);
  };

  const handleChangeMulti = async () => {
    try {
      if (!typeChange) {
        return error("Vui lòng chọn hành động");
      }

      if (!selectId.length) {
        return error("Vui lòng chọn danh mục");
      }

      if (typeChange === "delete") {
        const ok = await confirm(
          "Xoá danh mục?",
          "Danh mục bị xoá sẽ không thể khôi phục"
        );

        if (!ok) return;
      }

      const res = await changeMultiNewsCategory({
        selectId,
        typeChange
      });

      if (res.data.code) {
        success(res.data.message);
        setSelectId([]);
        setTypeChange("");
        setReload((prev) => !prev);
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message);
    }
  };

  return (
    <div className="category_news">
      <SEO title="Quản lý danh mục bài viết" />

      <h2 className="category_news__title">Quản Lý Danh Mục Bài Viết</h2>

      <div className="category_news__stats">
        <div className="category_news__stat-card category_news__stat-total">
          <p>
            <BsCalendarCheck /> Tổng danh mục
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={totalCategory} formatter={formatter} />
          )}
        </div>

        <div className="category_news__stat-card category_news__stat-active">
          <p>
            <BsCheck2Circle /> Đang hoạt động
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={activeCategory} formatter={formatter} />
          )}
        </div>

        <div className="category_news__stat-card category_news__stat-category">
          <p>
            <FaLayerGroup /> Danh mục nổi bật
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={featuredCategory} formatter={formatter} />
          )}
        </div>

        <div className="category_news__stat-card category_news__stat-hidden">
          <p>
            <FaEyeSlash /> Tạm ẩn
          </p>
          {loading ? (
            <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} />
          ) : (
            <Statistic value={inactiveCategory} formatter={formatter} />
          )}
        </div>
      </div>

      <div className="category_news__filters">
        <div className="category_news__search">
          <SearchOutlined />
          <input
            placeholder="Tìm tên danh mục..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              limit,
              ...(sort && { sort }),
              ...(keyword && { keyword }),
              ...(e.target.value && { status: e.target.value })
            })
          }
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSearchParams({
              page: 1,
              limit,
              ...(status && { status }),
              ...(keyword && { keyword }),
              ...(e.target.value && { sort: e.target.value })
            })
          }
        >
          <option value="">-- Sắp xếp theo --</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="createdAt-desc">Mới nhất</option>
          <option value="createdAt-asc">Cũ nhất</option>
        </select>

        <button
          className="category_news__reset"
          onClick={() => navigate("/admin/new-categories")}
        >
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select
          value={typeChange}
          onChange={(e) => setTypeChange(e.target.value)}
        >
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển hoạt động</option>
          <option value="inactive">Chuyển không hoạt động</option>
          <option value="delete">Xoá danh mục</option>
        </select>

        <button
          className="category_news__activity"
          onClick={handleChangeMulti}
        >
          Áp dụng
        </button>

        <Link
          className="category_news__create"
          to="/admin/new-categories/create"
        >
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="category_news__table-wrapper">
        <div className="category_news__table">
          <div className="category_news__table-header">
            <div>
              <input
                type="checkbox"
                checked={
                  categoryList.length > 0 &&
                  categoryList.length === selectId.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectId(categoryList.map((item) => item._id));
                  } else {
                    setSelectId([]);
                  }
                }}
              />
            </div>
            <div className="category_news__col-category">Tên danh mục</div>
            <div>Slug</div>
            <div>Số bài viết</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {loading
            ? Array(limit)
                .fill(0)
                .map((_, i) => (
                  <div className="category_news__table-row" key={i}>
                    <div>
                      <Skeleton.Avatar active shape style={{ width: 15, height: 15 }} />
                    </div>
                    <div className="category_news__info category_news__col-category">
                      <Skeleton.Image active style={{ width: 50, height: 50 }} />
                      <div>
                        <Skeleton.Input active style={{ width: 180, marginBottom: 10 }} />
                        <Skeleton.Input active style={{ width: 100, height: 20 }} />
                      </div>
                    </div>
                    <Skeleton.Input active size="small" />
                    <Skeleton.Input active size="small" />
                    <Skeleton.Input active size="small" />
                    <Skeleton.Input active size="small" />
                    <Skeleton.Input active size="small" />
                  </div>
                ))
            : categoryList.map((item) => (
                <div className="category_news__table-row" key={item._id}>
                  <div className="category_news__checkbox">
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

                  <div className="category_news__info category_news__col-category">
                    <div className="category_news__thumb">
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                    <div>
                      <p className="category_news__name">{item.title}</p>
                      <span className="category_news__sub">
                        Danh mục bài viết
                      </span>
                    </div>
                  </div>

                  <div>{item.slug}</div>
                  <div>{item?.quantity || 0}</div>
                  <div>{formatCustom(item.createdAt)}</div>

                  <div>
                    <span className={`category_news__status ${item.status}`}>
                      {item.status === "active"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </div>

                  <div className="category_news__actions">
                    <Link
                      className="category_news__edit"
                      to={`/admin/new-categories/update/${item.slug}`}
                    >
                      Edit
                    </Link>
                    <button className="category_news__delete">Delete</button>
                  </div>
                </div>
              ))}

          {renderpagination(
            pagination,
            setSearchParams,
            limit,
            sort,
            status
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsCategoryAdmin;