import "./create.category.scss";
import SEO from "../../../utils/SEO";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { CgMathPlus } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import TinyEditor from "../../../utils/tinyEditor";
import { createProductCategory, getListCategory } from "../../../services/admin/product.category.admin";
import { success, error } from "../../../utils/notift";
import { renderCategoryOptions } from "../../../utils/buildTree";
import LoadingOverlay from "../../../utils/LoadingOverlay";

function CreateCategory() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        slug: "",
        position: "",
        parent_id: "",
        status: "active",
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getListCategory();
                if (res.data.code) setCategories(res.data.categories);
            } catch (err) {
                console.error(err.response?.data.message);
            }
        };
        fetchApi();
    }, []);

    const handleCreateCategory = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (key === "parent_id" && !form[key]) return;
                if (key === "position" && !form[key]) return;
                formData.append(key, form[key]);
            });
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const res = await createProductCategory(formData);
            if (res.data.code) {
                success(res.data.message);
                navigate("/admin/categories");
            }
        } catch (err) {
            error(err.response?.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClearThumb = () => {
        setThumbnailPreview(null);
        setThumbnail(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="cc-page">
            {loading && <LoadingOverlay title="Đang tạo danh mục" />}
            <SEO title="Tạo danh mục" />

            <div className="cc-page__header">
                <div>
                    <p className="cc-page__eyebrow">Veltrix Gear</p>
                    <h2 className="cc-page__title">Tạo Danh Mục</h2>
                    <p className="cc-page__desc">Thêm danh mục mới cho hệ thống quản trị</p>
                </div>
                <Link to="/admin/categories" className="cc-back-btn">
                    <MdOutlineKeyboardBackspace />
                    Quay lại
                </Link>
            </div>

            <div className="cc-layout">
                <div className="cc-main">
                    <div className="cc-card">
                        <div className="cc-card__header">
                            <h3>Thông tin danh mục</h3>
                            <p>Nhập các thông tin cơ bản của danh mục</p>
                        </div>

                        <div className="cc-form-grid">
                            <div className="cc-form-group cc-form-group--full">
                                <label>Tên danh mục</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên danh mục..."
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div className="cc-form-group">
                                <label>Slug</label>
                                <input
                                    type="text"
                                    placeholder="vi-du-danh-muc"
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                />
                            </div>

                            <div className="cc-form-group">
                                <label>Vị trí</label>
                                <input
                                    type="number"
                                    placeholder="Tự động +1 nếu để trống"
                                    onChange={e => setForm({ ...form, position: e.target.value })}
                                />
                            </div>

                            <div className="cc-form-group">
                                <label>Danh mục cha</label>
                                <select
                                    value={form.parent_id}
                                    onChange={e => setForm({ ...form, parent_id: e.target.value })}
                                >
                                    <option value="">-- Chọn danh mục cha --</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                            </div>

                            <div className="cc-form-group">
                                <label>Trạng thái</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>

                            <div className="cc-form-group cc-form-group--full">
                                <label>Mô tả ngắn</label>
                                <TinyEditor onChange={(content) => setForm({ ...form, description: content })} />
                            </div>
                        </div>
                    </div>

                    <div className="cc-card">
                        <div className="cc-card__header">
                            <h3>Ảnh danh mục</h3>
                            <p>Tải ảnh đại diện cho danh mục</p>
                        </div>

                        <div className="cc-upload-zone">
                            <div className="cc-upload-zone__icon">
                                <FiUploadCloud />
                            </div>
                            <p className="cc-upload-zone__title">Kéo thả ảnh vào đây</p>
                            <span className="cc-upload-zone__sub">Hoặc bấm để chọn từ máy tính</span>
                            <label htmlFor="cc-thumbnail" className="cc-upload-btn">Chọn ảnh</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="cc-thumbnail"
                                className="cc-file-input"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setThumbnail(file);
                                    setThumbnailPreview(URL.createObjectURL(file));
                                }}
                            />
                        </div>

                        {thumbnailPreview && (
                            <div className="cc-thumb-preview">
                                <button
                                    type="button"
                                    className="cc-thumb-preview__remove"
                                    onClick={handleClearThumb}
                                >
                                    ✕
                                </button>
                                <img src={thumbnailPreview} alt="thumbnail preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="cc-sidebar">
                    <div className="cc-card">
                        <div className="cc-card__header">
                            <h3>Thiết lập nhanh</h3>
                            <p>Các tùy chọn hiển thị cho danh mục</p>
                        </div>

                        <div className="cc-toggle-list">
                            <label className="cc-toggle-item">
                                <div>
                                    <span className="cc-toggle-item__label">Nổi bật</span>
                                    <span className="cc-toggle-item__desc">Hiển thị danh mục nổi bật</span>
                                </div>
                                <input type="checkbox" />
                            </label>

                            <label className="cc-toggle-item">
                                <div>
                                    <span className="cc-toggle-item__label">Hiển thị trang chủ</span>
                                    <span className="cc-toggle-item__desc">Cho phép xuất hiện ở trang chủ</span>
                                </div>
                                <input type="checkbox" />
                            </label>

                            <label className="cc-toggle-item">
                                <div>
                                    <span className="cc-toggle-item__label">Tự động sinh slug</span>
                                    <span className="cc-toggle-item__desc">Tạo slug từ tên danh mục</span>
                                </div>
                                <input type="checkbox" />
                            </label>
                        </div>
                    </div>

                    <div className="cc-card cc-sticky">
                        <div className="cc-card__header">
                            <h3>Hành động</h3>
                            <p>Lưu hoặc hủy thao tác tạo mới</p>
                        </div>

                        <div className="cc-actions">
                            <button className="cc-btn cc-btn--primary" onClick={handleCreateCategory}>
                                <CgMathPlus />
                                Tạo danh mục
                            </button>
                            <Link to="/admin/categories" className="cc-btn cc-btn--danger">
                                Hủy bỏ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;