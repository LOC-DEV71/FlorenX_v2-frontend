import React, { useEffect, useRef, useState } from "react";
import "./NewsCreate.scss";
import TinyEditor from "../../../utils/tinyEditor";
import { error, success } from "../../../utils/notift";
import { getList } from "../../../services/admin/news.category.service";
import { createNews } from "../../../services/admin/news.service";

const NewsCreate = () => {
  const [categories, setCategories] = useState([])
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
  const [thumbnailPreview, setThumbnailPreview] =useState(null)
  const fileInputRef = useRef(null);
  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: type === "file" ? files[0] || null : value,
    }));
  };

  const handleEditorChange = (value) => {
    setForm((prev) => ({
      ...prev,
      content: value,
    }));
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getList();
        if(res.data.code){
          setCategories(res.data.categories)
        }
      } catch (err) {
        error(err.response?.data?.message)
      }
    }
    fetchApi();
  }, [])
  const handleClearThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hanldeCreateNews = async () => {
    try {
      const formData = new FormData();

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      Object.keys(form).forEach(key => {
        if (key === "slug" && !form.slug) return;
        formData.append(key, form[key]);
      });

      const res = await createNews(formData);
      if(res.data.code){
        success(res.data.message)
      }
    } catch (err) {
      error(err.response?.data?.message)
    }
  }
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Tạo bài viết</h1>
          <p>Soạn nội dung bài viết và cấu hình hiển thị.</p>
        </div>

        <div className="page-header__actions">
          <button className="btn btn--primary" type="button" onClick={hanldeCreateNews}>
            Đăng bài
          </button>
        </div>
      </div>

      <div className="admin-form-layout">
        <div className="admin-form-main">
          <div className="card">
            <div className="card__header">
              <h2>Thông tin bài viết</h2>
            </div>

            <div className="card__body">
              <div className="form-grid">
                <div className="form-group form-group--full">
                  <label htmlFor="title">Tiêu đề bài viết</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Nhập tiêu đề bài viết"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    placeholder="slug-bai-viet"
                    value={form.slug}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="description">Mô tả ngắn</label>
                  <textarea
                    id="description"
                    rows="4"
                    placeholder="Nhập đoạn mô tả ngắn cho bài viết"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="content">Nội dung</label>
                  <TinyEditor
                    id="content"
                    rows="12"
                    placeholder="Nhập nội dung bài viết..."
                    value={form.content}
                    onChange={handleEditorChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="slug_category">Danh mục</label>
                  <select
                    id="slug_category"
                    value={form.slug_category}
                    onChange={handleChange}
                  >
                    <option value="">
                      Chọn danh mục
                    </option>
                    {categories && categories.map(item => (
                      <option value={item.slug}>{item.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Xuất bản</option>
                    <option value="hidden">Ẩn</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="featured">Bài viết nổi bật</label>
                  <select
                    id="featured"
                    value={form.featured}
                    onChange={handleChange}
                  >
                    <option value="no">Không</option>
                    <option value="yes">Có</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="views">Lượt xem</label>
                  <input
                    id="views"
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

        <div className="admin-form-side">
          <div className="card">
            <div className="card__header">
              <h2>Xem nhanh</h2>
            </div>

            <div className="card__body">
              <div className="preview-box">
                <div className="preview-box__thumb">
                  {thumbnailPreview ?
                    <>
                      <span onClick={handleClearThumbnail}>X</span>
                      <img src={thumbnailPreview} alt="thumbnail" />
                    </>:
                    <>Thumbnail</>
                  }
                </div>

                <div className="preview-box__upload">
                  <label
                    htmlFor="thumbnailFile"
                    className="preview-box__upload-label"
                  >
                    Chọn ảnh thumbnail
                  </label>
                  <input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if(file){
                        setThumbnail(file)
                        setThumbnailPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>

                <div className="preview-box__content">
                  <h3>{form.title || "Tiêu đề bài viết"}</h3>
                  <p>
                    {form.description ||
                      "Mô tả ngắn của bài viết sẽ hiển thị tại đây để preview nhanh."}
                  </p>
                  <div className="preview-meta">
                    <span className="badge">{form.status}</span>
                    <span className="meta-text">{form.views} lượt xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h2>Lưu ý</h2>
            </div>

            <div className="card__body">
              <ul className="info-list">
                <li>Category là field bắt buộc theo schema.</li>
                <li>Status mặc định nên để draft.</li>
                <li>PublishedAt chỉ cần khi bài viết được xuất bản.</li>
                <li>Featured dùng để đánh dấu bài ưu tiên hiển thị.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCreate;