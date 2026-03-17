import React from "react";
import "./NewsCategoryCreate.scss";

const NewsCategoryCreate = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Tạo danh mục bài viết</h1>
          <p>Thiết lập thông tin cơ bản cho danh mục tin tức.</p>
        </div>

        <div className="page-header__actions">
          <button className="btn btn--outline" type="button">
            Hủy
          </button>
          <button className="btn btn--primary" type="button">
            Lưu danh mục
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
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="slug">Slug</label>
                  <input
                    id="slug"
                    type="text"
                    placeholder="vi-du-danh-muc"
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="description">Mô tả</label>
                  <textarea
                    id="description"
                    rows="5"
                    placeholder="Nhập mô tả ngắn cho danh mục"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái</label>
                  <select id="status" defaultValue="active">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                <div className="preview-box__thumb">Thumbnail</div>
                <div className="preview-box__content">
                  <h3>Tên danh mục</h3>
                  <p>Mô tả ngắn của danh mục sẽ hiển thị tại đây.</p>
                  <span className="badge">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCategoryCreate;