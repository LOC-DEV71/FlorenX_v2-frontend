import React from "react";
import "./NewsCreate.scss";

const NewsCreate = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Tạo bài viết</h1>
          <p>Soạn nội dung bài viết và cấu hình hiển thị.</p>
        </div>

        <div className="page-header__actions">
          <button className="btn btn--outline" type="button">
            Lưu nháp
          </button>
          <button className="btn btn--primary" type="button">
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
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    placeholder="slug-bai-viet"
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="excerpt">Mô tả ngắn</label>
                  <textarea
                    id="excerpt"
                    rows="4"
                    placeholder="Nhập đoạn mô tả ngắn cho bài viết"
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="content">Nội dung</label>
                  <textarea
                    id="content"
                    rows="12"
                    placeholder="Nhập nội dung bài viết..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="categoryId">Danh mục</label>
                  <select id="categoryId" defaultValue="">
                    <option value="" disabled>
                      Chọn danh mục
                    </option>
                    <option value="1">Tin công nghệ</option>
                    <option value="2">Khuyến mãi</option>
                    <option value="3">Hướng dẫn</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select id="status" defaultValue="draft">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="featured">Bài viết nổi bật</label>
                  <select id="featured" defaultValue="false">
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="views">Lượt xem</label>
                  <input
                    id="views"
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deleted">Đánh dấu xóa</label>
                  <select id="deleted" defaultValue="false">
                    <option value="false">Không</option>
                    <option value="true">Có</option>
                  </select>
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
                <div className="preview-box__thumb">Thumbnail</div>

                <div className="preview-box__upload">
                  <label htmlFor="thumbnailFile" className="preview-box__upload-label">
                    Chọn ảnh thumbnail
                  </label>
                  <input
                    id="thumbnailFile"
                    type="file"
                    accept="image/*"
                  />
                </div>

                <div className="preview-box__content">
                  <h3>Tiêu đề bài viết</h3>
                  <p>
                    Mô tả ngắn của bài viết sẽ hiển thị tại đây để preview nhanh.
                  </p>
                  <div className="preview-meta">
                    <span className="badge">Draft</span>
                    <span className="meta-text">0 lượt xem</span>
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