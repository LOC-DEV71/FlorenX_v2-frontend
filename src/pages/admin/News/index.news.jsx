import "./NewsAdmin.scss";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Statistic, message } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaRegNewspaper, FaEyeSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";
import Thumbnail from "../../../assets/banner/avatar-none.jpg";
import { getNews, changeMultiNews } from "../../../services/admin/news.service";
import { renderpagination } from "../../../utils/pagination";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function NewsAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [newsList, setNewsList] = useState([]);
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    featuredNews: 0,
    hiddenNews: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionType, setActionType] = useState("");
  const [pagination, setPagination] = useState(null);

  const [keywordInput, setKeywordInput] = useState(
    searchParams.get("keyword") || ""
  );

  const filters = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 5,
      keyword: searchParams.get("keyword") || "",
      category: searchParams.get("category") || "",
      status: searchParams.get("status") || "",
      sort: searchParams.get("sort") || "newest"
    };
  }, [searchParams]);

  const limit = filters.limit;
  const sort = filters.sort;

  const updateQueryParams = (newValues) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newValues).forEach(([key, value]) => {
      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        value === false;

      if (isEmpty) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await getNews(filters);
      const data = res.data;

      if (data.code) {
        setNewsList(data.news || []);
        setStats({
          totalNews: data.totalNews || 0,
          publishedNews: data.publishedNews || 0,
          featuredNews: data.featuredNews || 0,
          hiddenNews: data.hiddenNews || 0
        });
        setPagination(data.pagination || null);
      } else {
        message.error(data.message || "Lấy danh sách bài viết thất bại");
      }
    } catch (error) {
      message.error("Lấy danh sách bài viết thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [searchParams]);

  useEffect(() => {
    setKeywordInput(filters.keyword);
  }, [filters.keyword]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(newsList.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleChangeMulti = async (typeChange) => {
    if (!typeChange) {
      message.warning("Vui lòng chọn hành động");
      return;
    }

    if (!selectedIds.length) {
      message.warning("Vui lòng chọn bài viết");
      return;
    }

    try {
      const res = await changeMultiNews({
        selectId: selectedIds,
        typeChange
      });

      if (res.data.code) {
        message.success(res.data.message);
        setSelectedIds([]);
        setActionType("");
        fetchNews();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Thao tác thất bại");
    }
  };

  const handleResetFilter = () => {
    setKeywordInput("");
    setSearchParams({
      page: "1",
      limit: "5",
      sort: "newest"
    });
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    updateQueryParams({
      keyword: keywordInput,
      page: 1
    });
  };

  const handleDeleteOne = async (id) => {
    try {
      const res = await changeMultiNews({
        selectId: [id],
        typeChange: "delete"
      });

      if (res.data.code) {
        message.success(res.data.message);
        fetchNews();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Xóa bài viết thất bại");
    }
  };

  return (
    <div className="news-admin-page">
      <SEO title="Quản lý bài viết" />

      <h2 className="news-admin-page__title">Quản Lý Bài Viết</h2>

      <div className="news-stats">
        <div className="stat-card stat-total">
          <p>
            <BsCalendarCheck /> Tổng bài viết
          </p>
          <Statistic value={stats.totalNews} formatter={formatter} />
        </div>

        <div className="stat-card stat-published">
          <p>
            <BsCheck2Circle /> Đã xuất bản
          </p>
          <Statistic value={stats.publishedNews} formatter={formatter} />
        </div>

        <div className="stat-card stat-news">
          <p>
            <FaRegNewspaper /> Bài nổi bật
          </p>
          <Statistic value={stats.featuredNews} formatter={formatter} />
        </div>

        <div className="stat-card stat-hidden">
          <p>
            <FaEyeSlash /> Đã ẩn
          </p>
          <Statistic value={stats.hiddenNews} formatter={formatter} />
        </div>
      </div>

      <div className="news-filters">
        <form className="search" onSubmit={handleSubmitSearch}>
          <SearchOutlined />
          <input
            placeholder="Tìm tiêu đề bài viết..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </form>

        <select
          value={filters.category}
          onChange={(e) =>
            updateQueryParams({
              category: e.target.value,
              page: 1
            })
          }
        >
          <option value="">Danh mục: Tất cả</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Tài chính">Tài chính</option>
          <option value="Du lịch">Du lịch</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            updateQueryParams({
              status: e.target.value,
              page: 1
            })
          }
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
          <option value="hidden">Đã ẩn</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) =>
            updateQueryParams({
              sort: e.target.value,
              page: 1
            })
          }
        >
          <option value="newest">-- Sắp xếp theo --</option>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="title-asc">Tên A-Z</option>
          <option value="title-desc">Tên Z-A</option>
        </select>

        <button className="reset" onClick={handleResetFilter} type="button">
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
        >
          <option value="">-- Chọn hành động --</option>
          <option value="publish">Xuất bản</option>
          <option value="hidden">Ẩn bài viết</option>
          <option value="delete">Xoá bài viết</option>
          <option value="featured">Đánh dấu nổi bật</option>
          <option value="unfeatured">Bỏ nổi bật</option>
        </select>

        <button
          className="activity"
          onClick={() => handleChangeMulti(actionType)}
          type="button"
        >
          Áp dụng
        </button>

        <Link className="create" to="/admin/news/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="table-wrapper">
        <div className="news-table">
          <div className="table-header">
            <div>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  newsList.length > 0 && selectedIds.length === newsList.length
                }
              />
            </div>
            <div className="col-news">Bài viết</div>
            <div>Danh mục</div>
            <div>Tác giả</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {!loading && newsList.length > 0 ? (
            newsList.map((item) => (
              <div className="table-row" key={item._id}>
                <div className="news-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                  />
                </div>

                <div className="news-info col-news">
                  <img src={item.thumbnail || Thumbnail} alt={item.title} />
                  <div>
                    <p className="news-name">{item.title}</p>
                    <span className="news-sub">{item.slug}</span>
                  </div>
                </div>

                <div>{item.category || "Chưa có"}</div>
                <div>{item.author || "Admin"}</div>
                <div>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                    : ""}
                </div>

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
                  <Link className="edit" to={`/admin/news/edit/${item.slug}`}>
                    Edit
                  </Link>
                  <button
                    className="delete"
                    type="button"
                    onClick={() => handleDeleteOne(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="table-row">
              <div className="col-news">
                {loading ? "Đang tải dữ liệu..." : "Không có bài viết nào"}
              </div>
            </div>
          )}
        </div>

        {renderpagination(pagination, setSearchParams, limit, sort, "")}
      </div>
    </div>
  );
}

export default NewsAdmin;