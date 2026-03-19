import "./NewsCategoryCreate.scss";
import SEO from "../../../utils/SEO";
import { error, success } from "../../../utils/notift";
import { updateNewsCategory, getBySlug } from "../../../services/admin/news.category.service";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
const UpdateNewsCategory = () => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    id: "",
    status: "active",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleClearThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateNewsCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("id", form.id);
      formData.append("status", form.status);

      if (form.slug) {
        formData.append("slug", form.slug);
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await updateNewsCategory(formData);
      const data = res.data.newsCategory;
      if (res.data.code) {
        success(res.data.message)
        setForm(({
          title: data.title,
          slug: data.slug,
          description: data.description,
          status: data.status,
          id: data._id
        }))
      }
    } catch (err) {
      error(err.response?.data.message)
    }
  }
  const {slug} = useParams();

    useEffect(() => {
        const fetchApi = async () => {
        try {
            const res = await getBySlug(slug);
            const data = res.data.newsCategory;
            if(res.data.code){
                setForm({
                    title: data.title,
                    slug: data.slug,
                    description: data.description,
                    status: data.status,
                    id: data._id
                })
                setThumbnailPreview(data.thumbnail)
                setThumbnail(data.thumbnail)
            }
        } catch (err) {
            error(err.response?.data?.message)
        }
        }
        fetchApi()
    }, [])
  return (
    <div className="admin-page">
      <SEO title={"Tạo danh mục bài viết"} />

      <div className="page-header">
        <div>
          <h1>Tạo danh mục bài viết</h1>
          <p>Thiết lập thông tin cơ bản cho danh mục tin tức.</p>
        </div>

        <div className="page-header__actions">
          <button className="btn btn--primary" type="button" onClick={handleUpdateNewsCategory}>
            Cập nhật danh mục
          </button>
        </div>
      </div>

      <div className="admin-form-layout">
        <div className="admin-form-main">
          <div className="card">
            <div className="card__header">
              <h2>Thông tin danh mục</h2>
            </div>

            <div className="card__body">
              <div className="form-grid">
                <div className="form-group form-group--full">
                  <label htmlFor="title">Tên danh mục</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Nhập tên danh mục"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    placeholder="vi-du-danh-muc"
                    value={form.slug}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="description">Mô tả</label>
                  <textarea
                    id="description"
                    rows="5"
                    placeholder="Nhập mô tả ngắn cho danh mục"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm đóng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form-side">
          <div className="card">
            <div className="card__header">
              <h2>Gợi ý</h2>
            </div>

            <div className="card__body">
              <ul className="info-list">
                <li>Title và slug nên đồng bộ để dễ quản lý.</li>
                <li>Thumbnail nên dùng ảnh cùng tỉ lệ.</li>
                <li>Position dùng để sắp xếp thứ tự hiển thị.</li>
                <li>Status inactive để ẩn tạm danh mục.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h2>Xem nhanh</h2>
            </div>

            <div className="card__body">
              <div className="preview-box">
                {thumbnailPreview ? (
                  <div className="preview-box__thumb">
                    <span onClick={handleClearThumbnail}>x</span>
                    <img src={thumbnailPreview} alt="thumbnail" />
                  </div>
                ) : (
                  <div className="preview-box__thumb">Thumbnail</div>
                )}

                <div className="preview-box__upload">
                  <label
                    htmlFor="thumbnailFile"
                    className="preview-box__upload-label"
                  >
                    Chọn ảnh thumbnail
                  </label>
                  <input
                    ref={fileInputRef}
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </div>

                <div className="preview-box__content">
                  <h3>{form.title || "Tên danh mục"}</h3>
                  <p>
                    {form.description ||
                      "Mô tả ngắn của danh mục sẽ hiển thị tại đây."}
                  </p>
                  <span
                    className={`badge ${form.status !== "active" ? "badge--inactive" : ""
                      }`}
                  >
                    {form.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNewsCategory;