import { useEffect, useState } from "react"
import "./create.role.scss"
import { error, success } from "../../../utils/notift";
import { getRoleBySlug, updateRole } from "../../../services/admin/roles.admin.service";
import TinyEditor from "../../../utils/tinyEditor";
import SEO from "../../../utils/SEO";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
function UpdateRole() {
    const [form, setForm] = useState({
        title: "",
        slug: "",
        description: "",
        id: ""
    });
    const [loading, setLoading] = useState(true)
    const { slug } = useParams();
    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getRoleBySlug(slug);
                const data = res.data.role;
                if (res.data.code) {
                    setForm({
                        title: data.title,
                        slug: data.slug,
                        description: data.description,
                        id: data._id
                    })
                }
            }
            fetchApi()
        } catch (err) {
            error(err.response?.data.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleUpdateRole = async () => {
        try {
            const payLoad = {
                title: form.title,
                description: form.description,
                id: form.id,
                ...(form.slug ? { slug: form.slug } : {})
            }
            const res = await updateRole({slug, payLoad})
            if(res.data.code){
                success(res.data.message)
            }
        } catch (err) {
            error(err.response?.data.message)
        }
    }

    console.log(form)
    return (
        <div className="role-page">
            <SEO title="Cập nhật nhóm quyền" />
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
                                            value={loading ? "Đang tải..." : form.title}
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
                                            value={loading ? "Đang tải..." : form.slug}
                                            onChange={e => setForm({ ...form, slug: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group full">
                                        <label htmlFor="description">Mô tả</label>
                                        <TinyEditor
                                            value={loading ? "Đang tải..." : form.description}
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
                                    <span className="summary-value" dangerouslySetInnerHTML={{ __html: form.description }} />
                                </div>
                                <div className="summary-note">
                                    Hãy kiểm tra lại nhóm quyền trước khi lưu để tránh cấp sai quyền truy cập.
                                </div>
                            </div>

                            <div className="action-card">
                                <button className="btn btn-primary" onClick={handleUpdateRole}>Cập nhật nhóm quyền</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateRole