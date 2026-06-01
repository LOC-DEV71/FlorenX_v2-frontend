import { useState, useEffect } from "react";
import "./DetailNews.scss";

const MOCK_CATEGORIES = [
  { slug: "tin-tuc-cong-nghe", label: "Tin Tức Công Nghệ" },
  { slug: "danh-gia-san-pham", label: "Đánh Giá Sản Phẩm" },
  { slug: "gaming", label: "Gaming" },
  { slug: "laptop-pc", label: "Laptop & PC" },
  { slug: "man-hinh-ban-phim", label: "Màn Hình & Bàn Phím" },
];

const MOCK_NEWS = [
  {
    _id: "1",
    title: "MSI mang 'siêu máy tính' AI về Việt Nam: Hiệu năng gấp đôi 4.2 tỷ...",
    slug: "msi-sieu-may-tinh-ai-viet-nam",
    slug_category: "tin-tuc-cong-nghe",
    thumbnail: "https://images.unsplash.com/photo-1593640408182-31c228bdab65?w=600&q=80",
    description: "MSI vừa ra mắt dòng laptop AI mới nhất tại thị trường Việt Nam với hiệu năng vượt trội so với thế hệ trước.",
    views: 1240,
    createdAt: "2026-05-20T08:00:00Z",
  },
  {
    _id: "2",
    title: "Màn hình gaming đầu tiên trên thế giới đạt refresh rate 500Hz chính thức ra mắt",
    slug: "man-hinh-gaming-500hz",
    slug_category: "man-hinh-ban-phim",
    thumbnail: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80",
    description: "ASUS ROG Swift Pro PG248QP chính thức ra mắt với tốc độ làm mới 500Hz, phá vỡ kỷ lục trước đó.",
    views: 980,
    createdAt: "2026-05-18T10:00:00Z",
  },
  {
    _id: "3",
    title: "Intel Arc B580 review: GPU tầm trung đáng mua nhất 2026?",
    slug: "intel-arc-b580-review",
    slug_category: "danh-gia-san-pham",
    thumbnail: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80",
    description: "Intel Arc B580 gây bất ngờ với hiệu năng ổn định và giá cạnh tranh, đe dọa trực tiếp vị trí của NVIDIA RTX 4060.",
    views: 2100,
    createdAt: "2026-05-15T12:00:00Z",
  },
  {
    _id: "4",
    title: "Top 5 laptop gaming dưới 30 triệu đáng mua nhất 2026",
    slug: "top-5-laptop-gaming-duoi-30-trieu",
    slug_category: "laptop-pc",
    thumbnail: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
    description: "Tổng hợp những chiếc laptop gaming hiệu năng tốt nhất trong phân khúc dưới 30 triệu đồng hiện nay.",
    views: 3400,
    createdAt: "2026-05-12T09:00:00Z",
  },
  {
    _id: "5",
    title: "Bàn phím cơ Switch mới của Razer: Nhanh hơn, êm hơn và bền hơn",
    slug: "razer-switch-moi-2026",
    slug_category: "man-hinh-ban-phim",
    thumbnail: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80",
    description: "Razer ra mắt thế hệ switch cơ học mới với độ bền cao hơn, độ trễ thấp hơn và tiếng gõ mượt hơn.",
    views: 760,
    createdAt: "2026-05-10T14:00:00Z",
  },
  {
    _id: "6",
    title: "PC Gaming tự build vs pre-built: Cái nào đáng tiền hơn?",
    slug: "pc-gaming-tu-build-vs-prebuilt",
    slug_category: "gaming",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    description: "So sánh chi tiết giữa việc tự build PC và mua PC pre-built trong bối cảnh giá linh kiện năm 2026.",
    views: 1890,
    createdAt: "2026-05-08T11:00:00Z",
  },
];

const MOCK_ARTICLE = {
  _id: "1",
  title: "MSI mang 'siêu máy tính' AI về Việt Nam: Hiệu năng gấp đôi 4.2 tỷ...",
  slug: "msi-sieu-may-tinh-ai-viet-nam",
  slug_category: "tin-tuc-cong-nghe",
  thumbnail: "https://images.unsplash.com/photo-1593640408182-31c228bdab65?w=1200&q=80",
  content: `
    <p>MSI vừa chính thức ra mắt dòng laptop AI cao cấp tại thị trường Việt Nam, đánh dấu bước tiến quan trọng trong phân khúc máy tính hiệu suất cao dành cho người dùng sáng tạo nội dung và game thủ chuyên nghiệp.</p>
    <h2>Thông số kỹ thuật nổi bật</h2>
    <p>Được trang bị bộ vi xử lý Intel Core Ultra 9 185H mới nhất, kết hợp với card đồ họa NVIDIA GeForce RTX 4090 Laptop GPU, dòng máy mới của MSI đạt hiệu năng AI lên tới 120 TOPS — vượt xa hầu hết các đối thủ cạnh tranh trong cùng phân khúc.</p>
    <p>Màn hình 16 inch với tấm nền Mini-LED 4K 120Hz mang đến trải nghiệm hình ảnh sắc nét và chân thực. Độ phủ màu 100% DCI-P3 giúp máy phù hợp cho cả công việc đồ họa chuyên nghiệp lẫn giải trí gaming.</p>
    <h2>Hiệu năng AI vượt trội</h2>
    <p>Nhờ tích hợp NPU chuyên dụng, laptop có thể xử lý các tác vụ AI như chỉnh sửa ảnh thông minh, tạo video AI và dịch ngôn ngữ thời gian thực mà không ảnh hưởng đến hiệu năng CPU/GPU chính.</p>
    <p>MSI cũng bổ sung phần mềm AI Engine độc quyền, cho phép tự động tối ưu hóa hiệu suất tùy theo tác vụ — từ gaming, render 3D đến chỉnh sửa video 8K.</p>
    <h2>Giá bán và phân phối</h2>
    <p>Sản phẩm được phân phối chính hãng qua hệ thống đại lý MSI trên toàn quốc với mức giá từ 65 triệu đồng. Veltrix Gear là một trong những đơn vị đầu tiên được phân phối dòng sản phẩm cao cấp này tại Việt Nam.</p>
  `,
  views: 1240,
  createdAt: "2026-05-20T08:00:00Z",
  createdBy: { fullname: "Admin Veltrix" },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function DetailNews() {
  const [activeCategory, setActiveCategory] = useState("tin-tuc-cong-nghe");
  const [selectedNews, setSelectedNews] = useState(null);
  const [article, setArticle] = useState(MOCK_ARTICLE);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNews = MOCK_NEWS.filter((n) => n.slug_category === activeCategory);

  const handleSelectCategory = (slug) => {
    setActiveCategory(slug);
    setSelectedNews(null);
    setSidebarOpen(false);
  };

  const handleSelectNews = (news) => {
    setSelectedNews(news);
    setArticle({ ...MOCK_ARTICLE, ...news, content: MOCK_ARTICLE.content });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeCategoryLabel =
    MOCK_CATEGORIES.find((c) => c.slug === activeCategory)?.label || "Danh mục";


    const [categoryNews, setCategoryNews] =useState([]);


  return (
    <div className="detail-news">
      {/* Breadcrumb */}
      <div className="dn-breadcrumb">
        <span>HOME</span>
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
            {MOCK_CATEGORIES.map((cat) => (
              <li
                key={cat.slug}
                className={`dn-cat-item ${activeCategory === cat.slug ? "active" : ""}`}
                onClick={() => handleSelectCategory(cat.slug)}
              >
                <span className="cat-bar" />
                {cat.label}
                <span className="cat-count">
                  {MOCK_NEWS.filter((n) => n.slug_category === cat.slug).length}
                </span>
              </li>
            ))}
          </ul>

          {/* Recent Posts */}
          <div className="dn-sidebar__section">
            <span className="sidebar-title">BÀI MỚI NHẤT</span>
            <ul className="dn-recent">
              {MOCK_NEWS.slice(0, 4).map((n) => (
                <li
                  key={n._id}
                  className={`dn-recent-item ${selectedNews?._id === n._id ? "active" : ""}`}
                  onClick={() => handleSelectNews(n)}
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
          {selectedNews ? (
            /* Article Detail View */
            <div className="dn-article">
              <button className="dn-back-btn" onClick={() => setSelectedNews(null)}>
                ← Quay lại danh sách
              </button>

              <div className="article-meta">
                <span className="article-category">{activeCategoryLabel}</span>
                <span className="article-date">{formatDate(article.createdAt)}</span>
                <span className="article-views">👁 {article.views.toLocaleString()}</span>
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

              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Related articles */}
              <div className="dn-related">
                <h3 className="related-heading">BÀI VIẾT LIÊN QUAN</h3>
                <div className="related-grid">
                  {MOCK_NEWS.filter(
                    (n) => n.slug_category === activeCategory && n._id !== article._id
                  )
                    .slice(0, 2)
                    .map((n) => (
                      <div
                        key={n._id}
                        className="related-card"
                        onClick={() => handleSelectNews(n)}
                      >
                        <img src={n.thumbnail} alt={n.title} />
                        <div className="related-info">
                          <p className="related-title">{n.title}</p>
                          <p className="related-date">{formatDate(n.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            /* News List View */
            <div className="dn-list">
              <div className="dn-list__header">
                <h2 className="list-heading">{activeCategoryLabel}</h2>
                <span className="list-count">{filteredNews.length} bài viết</span>
              </div>

              {filteredNews.length === 0 ? (
                <div className="dn-empty">Chưa có bài viết nào trong danh mục này.</div>
              ) : (
                <div className="news-grid">
                  {/* Featured first card */}
                  {filteredNews.slice(0, 1).map((n) => (
                    <div
                      key={n._id}
                      className="news-card news-card--featured"
                      onClick={() => handleSelectNews(n)}
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
                          <span className="card-views">👁 {n.views.toLocaleString()}</span>
                          <span className="card-read">Đọc thêm →</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Remaining cards */}
                  {filteredNews.slice(1).map((n) => (
                    <div
                      key={n._id}
                      className="news-card"
                      onClick={() => handleSelectNews(n)}
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
                          <span className="card-views">👁 {n.views.toLocaleString()}</span>
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