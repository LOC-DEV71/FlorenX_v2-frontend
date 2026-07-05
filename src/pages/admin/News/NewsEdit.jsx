import React, { useEffect, useRef, useState } from "react";
import "./NewsCreate.scss";
import TinyEditor from "../../../utils/tinyEditor";
import { error, success } from "../../../utils/notift";
import { getList } from "../../../services/admin/news.category.service";
import { getNewsBySlug, updateNews } from "../../../services/admin/news.service";
import { useParams, useNavigate } from "react-router-dom";
import {
  RiArticleLine,
  RiSaveLine,
  RiUploadCloud2Line,
  RiCloseLine,
  RiImageLine,
  RiEyeLine,
  RiBookmarkLine,
  RiInformationLine,
  RiAlertLine,
} from "react-icons/ri";

const STATUS_CONFIG = {
  draft: { label: "Nháp", color: "#92400e", bg: "#fef3c7" },
  published: { label: "Xuất bản", color: "#065f46", bg: "#d1fae5" },
  hidden: { label: "Ẩn", color: "#4b5563", bg: "#f3f4f6" },
};

const NewsEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    slug_category: "",
    status: "draft",
    featured: "no",
    views: 0,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const submitBtnRef = useRef(null);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "file" ? files[0] || null : value,
    }));
  };

  const handleEditorChange = (value) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getList();
        if (res.data.code) setCategories(res.data.categories);
      } catch (err) {
        error(err.response?.data?.message);
      }
    };
    fetchApi();

    const fetchNewsDetail = async () => {
      try {
        const res = await getNewsBySlug(slug);
        if (res.data.code === 200) {
          const newsData = res.data.data;
          setForm({
            title: newsData.title || "",
            slug: newsData.slug || "",
            description: newsData.description || "",
            content: newsData.content || "",
            slug_category: newsData.slug_category || "",
            status: newsData.status || "draft",
            featured: newsData.featured ? "yes" : "no",
            views: newsData.views || 0,
          });
          if (newsData.thumbnail) {
            setThumbnailPreview(newsData.thumbnail);
          }
        }
      } catch (err) {
        error("Không thể tải thông tin bài viết");
      }
    };
    if (slug) {
      fetchNewsDetail();
    }
  }, [slug]);

  const handleClearThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUpdateNews = async () => {
    if (!form.title.trim()) return error("Vui lòng nhập tiêu đề bài viết");
    if (!form.slug_category) return error("Vui lòng chọn danh mục");

    setLoading(true);
    try {
      const formData = new FormData();
      if (thumbnail instanceof File) formData.append("thumbnail", thumbnail);
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      const res = await updateNews(slug, formData);
      if (res.data.code === 200) {
        success("Cập nhật bài viết thành công!");
        navigate("/admin/news");
      }
    } catch (err) {
      error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = STATUS_CONFIG[form.status] || STATUS_CONFIG.draft;

  return (
    <div className="nc-page">
      <div className="nc-header">
        <div className="nc-header__left">
          <div className="nc-header__icon">
            <RiArticleLine />
          </div>
          <div>
            <h1 className="page-title">Chỉnh Sửa Bài Viết</h1>
            <p className="page-subtitle">Cập nhật nội dung và thiết lập cho bài viết</p>
          </div>
        </div>
        <div className="nc-header__actions">
          <button
            ref={submitBtnRef}
            className={`nc-btn nc-btn--primary${loading ? " nc-btn--loading" : ""}`}
            type="button"
            onClick={handleUpdateNews}
            disabled={loading}
          >
            {loading ? (
              <span className="nc-btn__spinner" />
            ) : (
              <RiSaveLine className="nc-btn__icon" />
            )}
            {loading ? "Đang lưu..." : "Cập nhật bài viết"}
          </button>
        </div>
      </div>

      <div className="nc-layout">
        <div className="nc-main">
          <div className="nc-card">
            <div className="nc-card__header">
              <RiBookmarkLine className="nc-card__header-icon" />
              <h2>Thông tin bài viết</h2>
            </div>
            <div className="nc-card__body">
              <div className="nc-form-grid">

                <div className="nc-field nc-field--full">
                  <label className="nc-label" htmlFor="title">
                    Tiêu đề bài viết <span className="nc-label__required">*</span>
                  </label>
                  <input
                    id="title"
                    className="nc-input"
                    type="text"
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="nc-field nc-field--full">
                  <label className="nc-label" htmlFor="slug">
                    Slug URL
                    <span className="nc-label__hint">Để trống sẽ tự động tạo từ tiêu đề</span>
                  </label>
                  <div className="nc-input-prefix-wrap">
                    <span className="nc-input-prefix">/bai-viet/</span>
                    <input
                      id="slug"
                      className="nc-input nc-input--with-prefix"
                      type="text"
                      placeholder="slug-bai-viet"
                      value={form.slug}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="nc-field nc-field--full">
                  <label className="nc-label" htmlFor="description">
                    Mô tả ngắn
                    <span className="nc-label__count">{form.description.length} ký tự</span>
                  </label>
                  <textarea
                    id="description"
                    className="nc-textarea"
                    rows="4"
                    placeholder="Đoạn mô tả ngắn sẽ hiển thị trong kết quả tìm kiếm và danh sách bài viết..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Content */}
                <div className="nc-field nc-field--full">
                  <label className="nc-label" htmlFor="content">Nội dung bài viết</label>
                  <div className="nc-editor-wrap">
                    <TinyEditor
                      id="content"
                      value={form.content}
                      onChange={handleEditorChange}
                    />
                  </div>
                </div>

                {/* Row: Category + Status */}
                <div className="nc-field">
                  <label className="nc-label" htmlFor="slug_category">
                    Danh mục <span className="nc-label__required">*</span>
                  </label>
                  <select
                    id="slug_category"
                    className="nc-select"
                    value={form.slug_category}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((item) => (
                      <option key={item.slug} value={item.slug}>{item.title}</option>
                    ))}
                  </select>
                </div>

                <div className="nc-field">
                  <label className="nc-label" htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    className="nc-select"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>

                <div className="nc-field">
                  <label className="nc-label" htmlFor="featured">Bài viết nổi bật</label>
                  <select
                    id="featured"
                    className="nc-select"
                    value={form.featured}
                    onChange={handleChange}
                  >
                    <option value="no">Không nổi bật</option>
                    <option value="yes">Đánh dấu nổi bật</option>
                  </select>
                </div>

                <div className="nc-field">
                  <label className="nc-label" htmlFor="views">Lượt xem ban đầu</label>
                  <input
                    id="views"
                    className="nc-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.views}
                    onChange={handleChange}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="nc-side">

          {/* Thumbnail Upload */}
          <div className="nc-card">
            <div className="nc-card__header">
              <RiImageLine className="nc-card__header-icon" />
              <h2>Ảnh đại diện</h2>
            </div>
            <div className="nc-card__body">
              {thumbnailPreview ? (
                <div className="nc-thumb-preview">
                  <img src={thumbnailPreview} alt="thumbnail" className="nc-thumb-preview__img" />
                  <button className="nc-thumb-preview__remove" onClick={handleClearThumbnail}>
                    <RiCloseLine />
                  </button>
                  <div className="nc-thumb-preview__overlay">
                    <span>Nhấn X để thay đổi</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`nc-dropzone${dragOver ? " nc-dropzone--over" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RiUploadCloud2Line className="nc-dropzone__icon" />
                  <p className="nc-dropzone__title">Kéo thả hoặc nhấn để tải ảnh</p>
                  <p className="nc-dropzone__sub">PNG, JPG, WEBP tối đa 5MB</p>
                  <input
                    ref={fileInputRef}
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="nc-card">
            <div className="nc-card__header">
              <RiEyeLine className="nc-card__header-icon" />
              <h2>Xem trước</h2>
            </div>
            <div className="nc-card__body">
              <div className="nc-preview">
                <div className="nc-preview__thumb">
                  {thumbnailPreview
                    ? <img src={thumbnailPreview} alt="" />
                    : <span><RiImageLine /> Chưa có ảnh</span>
                  }
                </div>
                <div className="nc-preview__body">
                  <h3 className="nc-preview__title">
                    {form.title || "Tiêu đề bài viết sẽ hiển thị tại đây"}
                  </h3>
                  <p className="nc-preview__desc">
                    {form.description || "Mô tả ngắn sẽ hiển thị tại đây để người đọc nắm bắt nhanh nội dung."}
                  </p>
                  <div className="nc-preview__meta">
                    <span
                      className="nc-badge"
                      style={{ color: statusInfo.color, background: statusInfo.bg }}
                    >
                      {statusInfo.label}
                    </span>
                    {form.featured === "yes" && (
                      <span className="nc-badge nc-badge--featured">⭐ Nổi bật</span>
                    )}
                    <span className="nc-preview__views">
                      <RiEyeLine /> {Number(form.views).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="nc-card nc-card--tips">
            <div className="nc-card__header">
              <RiInformationLine className="nc-card__header-icon nc-card__header-icon--info" />
              <h2>Lưu ý khi tạo bài</h2>
            </div>
            <div className="nc-card__body">
              <ul className="nc-tips">
                <li className="nc-tips__item">
                  <RiAlertLine className="nc-tips__icon" />
                  <span><strong>Danh mục</strong> là trường bắt buộc theo schema.</span>
                </li>
                <li className="nc-tips__item">
                  <RiAlertLine className="nc-tips__icon" />
                  <span><strong>Trạng thái</strong> mặc định nên để <em>Nháp</em> cho đến khi hoàn thiện.</span>
                </li>
                <li className="nc-tips__item">
                  <RiAlertLine className="nc-tips__icon" />
                  <span><strong>Slug</strong> tự động sinh từ tiêu đề nếu để trống.</span>
                </li>
                <li className="nc-tips__item">
                  <RiAlertLine className="nc-tips__icon" />
                  <span><strong>Nổi bật</strong> dùng để ưu tiên hiển thị trên trang chủ.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsEdit;