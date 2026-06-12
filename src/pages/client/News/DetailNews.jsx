import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategories, getDetailBySlug, getRecentNews, getByCategory } from "../../../services/client/news.service";
import SEO from "../../../utils/SEO";
import "./DetailNews.scss";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function DetailNews() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  
  // State for determining view mode
  const [viewMode, setViewMode] = useState("loading"); // "loading", "detail", "list", "error"
  
  // Data states
  const [article, setArticle] = useState(null);
  const [categoryNews, setCategoryNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Fetch initial sidebar data (Categories & Recent)
  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [catRes, recentRes] = await Promise.all([
          getCategories(),
          getRecentNews()
        ]);
        if (catRes.data?.code) {
          setCategories(catRes.data.categories || []);
        }
        if (recentRes.data?.code) {
          setRecentNews(recentRes.data.news || []);
        }
      } catch (error) {
        console.error("Lỗi fetch sidebar data:", error);
      }
    };
    fetchSidebarData();
  }, []);

  useEffect(() => {
    const resolveSlug = async () => {
      if (!slug) return;
      setViewMode("loading");
      setSidebarOpen(false);

      try {
        const detailRes = await getDetailBySlug(slug);
        
        if (detailRes.data?.code && detailRes.data?.news) {
          setArticle(detailRes.data.news);
          setViewMode("detail");
          setActiveCategory(categories.find(c => c.slug === detailRes.data.news.slug_category) || null);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch (error) {
      }

      try {
        const catRes = await getByCategory(slug);
        if (catRes.data?.code) {
          setCategoryNews(catRes.data.news || []);
          setActiveCategory(categories.find(c => c.slug === slug) || { title: "Danh mục", slug });
          setViewMode("list");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch (error) {
        setViewMode("error");
      }
    };

    resolveSlug();
  }, [slug, categories]); 


  const handleSelectCategory = (catSlug) => {
    navigate(`/news/${catSlug}`);
    setSidebarOpen(false);
  };

  const handleSelectNews = (newsSlug) => {
    navigate(`/news/${newsSlug}`);
    setSidebarOpen(false);
  };

  const activeCategoryLabel = activeCategory?.title || "Danh mục";

  return (
    <div className="detail-news">
      <SEO title={article ? article.title : `Veltrix - ${activeCategoryLabel}`} />
      
      {/* Breadcrumb */}
      <div className="dn-breadcrumb">
        <Link to="/">HOME</Link>
        <span className="sep">/</span>
        <span>BÀI VIẾT</span>
        <span className="sep">/</span>
        <span className="active">{activeCategoryLabel.toUpperCase()}</span>
      </div>

      <div className="dn-layout">
        {/* ===== SIDEBAR ===== */}
        <aside className={`dn-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="dn-sidebar__header">
            <span className="sidebar-title">DANH MỤC</span>
          </div>

          <ul className="dn-categories">
            {categories.map((cat) => (
              <li
                key={cat.slug}
                className={`dn-cat-item ${activeCategory?.slug === cat.slug ? "active" : ""}`}
                onClick={() => handleSelectCategory(cat.slug)}
              >
                <span className="cat-bar" />
                {cat.title}
              </li>
            ))}
          </ul>

          {/* Recent Posts */}
          <div className="dn-sidebar__section">
            <span className="sidebar-title">BÀI MỚI NHẤT</span>
            <ul className="dn-recent">
              {recentNews.map((n) => (
                <li
                  key={n._id}
                  className={`dn-recent-item ${article?._id === n._id ? "active" : ""}`}
                  onClick={() => handleSelectNews(n.slug)}
                >
                  <img src={n.thumbnail} alt={n.title} />
                  <div>
                    <p className="recent-title">{n.title}</p>
                    <p className="recent-date">{formatDate(n.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="dn-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="dn-main">
          {viewMode === "loading" && (
            <div className="dn-loading">Đang tải dữ liệu...</div>
          )}

          {viewMode === "error" && (
            <div className="dn-empty">Không tìm thấy trang yêu cầu.</div>
          )}

          {viewMode === "detail" && article && (
            /* Article Detail View */
            <div className="dn-article">
              <button className="dn-back-btn" onClick={() => navigate(-1)}>
                ← Quay lại
              </button>

              <div className="article-meta">
                <span className="article-category">{activeCategoryLabel}</span>
                <span className="article-date">{formatDate(article.createdAt)}</span>
                <span className="article-views">👁 {article.views?.toLocaleString()}</span>
              </div>

              <h1 className="article-title">{article.title}</h1>

              {article.createdBy && (
                <div className="article-author">
                  <div className="author-avatar">{article.createdBy.fullname?.[0] || "A"}</div>
                  <span>{article.createdBy.fullname}</span>
                </div>
              )}

              <div className="article-thumbnail-wrap">
                <img src={article.thumbnail} alt={article.title} className="article-thumb" />
              </div> 

              <div className="article-description">
                <p>{article.description}</p>
              </div>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

            </div>
          )}

          {viewMode === "list" && (
            /* News List View */
            <div className="dn-list">
              <div className="dn-list__header">
                <h2 className="list-heading">{activeCategoryLabel}</h2>
                <span className="list-count">{categoryNews.length} bài viết</span>
              </div>

              {categoryNews.length === 0 ? (
                <div className="dn-empty">Chưa có bài viết nào trong danh mục này.</div>
              ) : (
                <div className="news-grid">
                  {/* Featured first card */}
                  {categoryNews.slice(0, 1).map((n) => (
                    <div
                      key={n._id}
                      className="news-card news-card--featured"
                      onClick={() => handleSelectNews(n.slug)}
                    >
                      <div className="card-thumb-wrap">
                        <img src={n.thumbnail} alt={n.title} />
                        <span className="card-category">{activeCategoryLabel}</span>
                      </div>
                      <div className="card-body">
                        <p className="card-date">{formatDate(n.createdAt)}</p>
                        <h3 className="card-title">{n.title}</h3>
                        <p className="card-desc">{n.description}</p>
                        <div className="card-footer">
                          <span className="card-views">👁 {n.views?.toLocaleString()}</span>
                          <span className="card-read">Đọc thêm →</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Remaining cards */}
                  {categoryNews.slice(1).map((n) => (
                    <div
                      key={n._id}
                      className="news-card"
                      onClick={() => handleSelectNews(n.slug)}
                    >
                      <div className="card-thumb-wrap">
                        <img src={n.thumbnail} alt={n.title} />
                        <span className="card-category">{activeCategoryLabel}</span>
                      </div>
                      <div className="card-body">
                        <p className="card-date">{formatDate(n.createdAt)}</p>
                        <h3 className="card-title">{n.title}</h3>
                        <p className="card-desc">{n.description}</p>
                        <div className="card-footer">
                          <span className="card-views">👁 {n.views?.toLocaleString()}</span>
                          <span className="card-read">Đọc thêm →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        className="dn-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Mở danh mục"
      >
        ☰ Danh mục
      </button>
    </div>
  );
}

export default DetailNews;