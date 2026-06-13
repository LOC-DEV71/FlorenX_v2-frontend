import React, { useEffect, useRef, useState } from "react";
import "./NewsCreate.scss";
import TinyEditor from "../../../utils/tinyEditor";
import { error, success } from "../../../utils/notift";
import { getList } from "../../../services/admin/news.category.service";
import { createNews } from "../../../services/admin/news.service";
import { useLocation } from "react-router-dom";
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

const NewsCreate = () => {
  const location = useLocation();
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

  // 🤖 Robot Mode States
  const [robotMode, setRobotMode] = useState(false);
  const [robotStep, setRobotStep] = useState('');
  const [robotDraft, setRobotDraft] = useState(null);

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

  // Utility: Typewriter effect for a form field
  const typewriterField = (fieldName, text, speed = 20) => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        setForm(prev => ({ ...prev, [fieldName]: text.slice(0, i + 1) }));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  };

  // Utility: Smooth scroll to an element
  const scrollToField = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Utility: Wait ms
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

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

    // 🤖 Robot Mode: Detect autoMode from location.state
    if (location.state && location.state.autoMode && location.state.draftPayload) {
      setRobotDraft(location.state.draftPayload);
      setRobotMode(true);
      window.history.replaceState({}, document.title);
    } else if (location.state && location.state.draftPayload) {
      // Fallback: instant fill (không có animation)
      const draft = location.state.draftPayload;
      setForm(prev => ({
        ...prev,
        title: draft.title || "",
        slug_category: draft.slug_category || "",
        description: draft.description || "",
        content: draft.content || "",
      }));
      if (draft.thumbnailUrl) {
        setThumbnail(draft.thumbnailUrl);
        setThumbnailPreview(draft.thumbnailUrl);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🤖 Robot Mode: Sequential auto-fill with animation
  useEffect(() => {
    if (!robotMode || !robotDraft) return;

    const runRobot = async () => {
      await wait(1000);

      // Step 1: Typewriter Title
      setRobotStep('📝 Đang nhập tiêu đề...');
      scrollToField('#title');
      document.querySelector('#title')?.focus();
      await wait(300);
      await typewriterField('title', robotDraft.title || '', 25);
      await wait(500);

      // Step 2: Typewriter Description
      setRobotStep('💬 Đang nhập mô tả...');
      scrollToField('#description');
      document.querySelector('#description')?.focus();
      await wait(300);
      await typewriterField('description', robotDraft.description || '', 15);
      await wait(500);

      // Step 3: Auto-select Category
      setRobotStep('📂 Đang chọn danh mục...');
      scrollToField('#slug_category');
      await wait(300);
      setForm(prev => ({ ...prev, slug_category: robotDraft.slug_category || '' }));
      await wait(800);

      // Step 4: Set Content (TinyMCE)
      setRobotStep('✍️ Đang điền nội dung bài viết...');
      scrollToField('.nc-editor-wrap');
      await wait(500);
      setForm(prev => ({ ...prev, content: robotDraft.content || '' }));
      await wait(1000);

      // Step 5: Set Thumbnail
      if (robotDraft.thumbnailUrl) {
        setRobotStep('🖼️ Đang thiết lập ảnh đại diện...');
        scrollToField('.nc-dropzone');
        await wait(300);
        setThumbnail(robotDraft.thumbnailUrl);
        setThumbnailPreview(robotDraft.thumbnailUrl);
        await wait(800);
      }

      // Step 6: Set Status = published
      setRobotStep('⚙️ Đang cài đặt trạng thái...');
      scrollToField('#status');
      await wait(300);
      setForm(prev => ({ ...prev, status: robotDraft.status || 'published' }));
      await wait(500);

      // Step 7: Set Featured = yes
      setRobotStep('⭐ Đánh dấu nổi bật...');
      scrollToField('#featured');
      await wait(300);
      setForm(prev => ({ ...prev, featured: robotDraft.featured || 'yes' }));
      await wait(800);

      // Step 8: Auto-click Submit
      setRobotStep('🚀 Đang đăng bài viết...');
      scrollToField('.nc-header__actions');
      await wait(600);
      
      setRobotMode(false);
      setRobotStep('');
      setRobotDraft(null);

      if (submitBtnRef.current) {
        submitBtnRef.current.click();
      }
    };

    runRobot();
  }, [robotMode, robotDraft]);


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

  const handleCreateNews = async () => {
    if (!form.title.trim()) return error("Vui lòng nhập tiêu đề bài viết");
    if (!form.slug_category) return error("Vui lòng chọn danh mục");

    setLoading(true);
    try {
      const formData = new FormData();
      if (thumbnail) formData.append("thumbnail", thumbnail);
      Object.keys(form).forEach((key) => {
        if (key === "slug" && !form.slug) return;
        formData.append(key, form[key]);
      });
      const res = await createNews(formData);
      if (res.data.code) success(res.data.message);
    } catch (err) {
      error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = STATUS_CONFIG[form.status] || STATUS_CONFIG.draft;

  return (
    <div className="nc-page">
      {/* 🤖 Robot Mode Overlay */}
      {robotMode && (
        <div className="robot-overlay">
          <div className="robot-overlay__content">
            <div className="robot-overlay__pulse"></div>
            <span className="robot-overlay__icon">🤖</span>
            <div className="robot-overlay__text">
              <strong>Veltrix AI đang thao tác</strong>
              <span>{robotStep}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="nc-header">
        <div className="nc-header__left">
          <div className="nc-header__icon">
            <RiArticleLine />
          </div>
          <div>
            <h1 className="nc-header__title">Tạo bài viết mới</h1>
            <p className="nc-header__sub">Soạn nội dung và cấu hình hiển thị bài viết</p>
          </div>
        </div>
        <div className="nc-header__actions">
          <button
            ref={submitBtnRef}
            className={`nc-btn nc-btn--primary${loading ? " nc-btn--loading" : ""}${robotMode ? " robot-highlight" : ""}`}
            type="button"
            onClick={handleCreateNews}
            disabled={loading}
          >
            {loading ? (
              <span className="nc-btn__spinner" />
            ) : (
              <RiSaveLine className="nc-btn__icon" />
            )}
            {loading ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="nc-layout">
        {/* Main */}
        <div className="nc-main">
          <div className="nc-card">
            <div className="nc-card__header">
              <RiBookmarkLine className="nc-card__header-icon" />
              <h2>Thông tin bài viết</h2>
            </div>
            <div className="nc-card__body">
              <div className="nc-form-grid">

                {/* Title */}
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

                {/* Slug */}
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

export default NewsCreate;