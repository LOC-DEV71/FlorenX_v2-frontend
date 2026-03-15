import { useState } from "react"
import "./create.role.scss"
import { error, success } from "../../../utils/notift";
import { createRole } from "../../../services/admin/roles.admin.service";
import TinyEditor from "../../../utils/tinyEditor";
import SEO from "../../../utils/SEO";
function CreateRole() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    id: ""
  });
  const handleCreateRole = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        ...(form.slug ? { slug: form.slug } : {})
      };

      const res = await createRole(payload);

      if (res.data.code) {
        success(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="role-page">
      <SEO title="Tạo nhóm quyền" />
      <div className="role-container">
        <div className="role-card">
          <div className="role-card__top">
            <div>
              <p className="role-eyebrow">Administration</p>
              <h1 className="role-title">Tạo nhóm quyền</h1>
              <p className="role-subtitle">
                Khởi tạo nhóm quyền mới và cấu hình các quyền truy cập cho quản trị viên.
              </p>
            </div>

            <div className="role-badge">Role Management</div>
          </div>

          <div className="role-layout">
            <div className="role-main">
              <div className="form-section">
                <div className="section-heading">
                  <h2>Thông tin nhóm quyền</h2>
                  <p>Nhập các thông tin cơ bản của nhóm quyền.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group full">
                    <label htmlFor="title">Tên nhóm quyền</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Ví dụ: Quản trị viên hệ thống"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label htmlFor="slug">Slug: (có thể không nhập)</label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      placeholder="Ví dụ: quan-tri-vien-he-thong"
                      value={form.slug}
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>

                  <div className="form-group full">
                    <label htmlFor="description">Mô tả</label>
                    <TinyEditor
                      value={form.description}
                      onChange={(content) => setForm({ ...form, description: content })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="role-side">
              <div className="summary-card">
                <h3>Tóm tắt cấu hình</h3>

                <div className="summary-item">
                  <span className="summary-label">Title</span>
                  <span className="summary-value">{form.title ? form.title : "Tên nhóm quyền"}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Slug</span>
                  <span className="summary-value">{form.slug ? form.slug : "role-slug"}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">Description</span>
                  <span className="summary-value" dangerouslySetInnerHTML={{__html: form.description}} />
                </div>
                <div className="summary-note">
                  Hãy kiểm tra lại nhóm quyền trước khi lưu để tránh cấp sai quyền truy cập.
                </div>
              </div>

              <div className="action-card">
                <button type="button" className="btn btn-outline" onClick={() => setForm({ title: "", description: "", slug: "" })}>Làm mới</button>
                <button className="btn btn-primary" onClick={handleCreateRole}>Tạo nhóm quyền</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateRole