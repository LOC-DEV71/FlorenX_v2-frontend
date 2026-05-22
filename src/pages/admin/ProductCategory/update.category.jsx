import "./update.category.scss";
import SEO from "../../../utils/SEO";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import TinyEditor from "../../../utils/tinyEditor";
import { getCategoryBySlug, getListCategory, UpdateProductCategory } from "../../../services/admin/product.category.admin";
import { success, error } from "../../../utils/notift";
import { renderCategoryOptions } from "../../../utils/buildTree";
import LoadingOverlay from "../../../utils/LoadingOverlay";

function UpdateCategory() {
    const [form, setForm] = useState({
        id: "",
        title: "",
        description: "",
        slug: "",
        position: "",
        parent_id: "",
        status: "active",
    });
    const [categories, setCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const fileInputRef = useRef(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getListCategory();
                if (res.data.code) setCategories(res.data.categories);
            } catch (err) {
                console.error(err.response?.data.message);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await getCategoryBySlug(slug);
                const data = res.data.category;
                if (res.data.code) {
                    setForm({
                        _id: data._id,
                        title: data.title,
                        description: data.description,
                        slug: data.slug,
                        position: data.position,
                        parent_id: data.parent_id,
                        status: data.status,
                        thumbnail: data.thumbnail,
                    });
                    setThumbnailPreview(data.thumbnail);
                }
            } catch (err) {
                console.error(err.response?.data.message);
            }
        };
        fetchCategory();
    }, [slug]);

    const handleUpdateCategory = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (key === "parent_id" && !form[key]) return;
                if (key === "position" && !form[key]) return;
                formData.append(key, form[key]);
            });
            if (thumbnail) formData.append("thumbnail", thumbnail);

            const res = await UpdateProductCategory({ formData, slug });
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
        <div className="uc-page">
            {loading && <LoadingOverlay title="Đang cập nhật danh mục" />}
            <SEO title="Cập nhật danh mục" />

            <div className="uc-page__header">
                <div>
                    <p className="uc-page__eyebrow">Veltrix Gear</p>
                    <h2 className="uc-page__title">Cập nhật Danh Mục</h2>
                    <p className="uc-page__desc">Chỉnh sửa thông tin danh mục hiện có</p>
                </div>
                <Link to="/admin/categories" className="uc-back-btn">
                    <MdOutlineKeyboardBackspace />
                    Quay lại
                </Link>
            </div>

            <div className="uc-layout">
                <div className="uc-main">
                    <div className="uc-card">
                        <div className="uc-card__header">
                            <h3>Thông tin danh mục</h3>
                            <p>Chỉnh sửa các thông tin cơ bản của danh mục</p>
                        </div>

                        <div className="uc-form-grid">
                            <div className="uc-form-group uc-form-group--full">
                                <label>Tên danh mục</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    placeholder="Nhập tên danh mục..."
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                />
                            </div>

                            <div className="uc-form-group">
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    placeholder="vi-du-danh-muc"
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                />
                            </div>

                            <div className="uc-form-group">
                                <label>Vị trí</label>
                                <input
                                    type="number"
                                    value={form.position}
                                    placeholder="Tự động +1 nếu để trống"
                                    onChange={e => setForm({ ...form, position: e.target.value })}
                                />
                            </div>

                            <div className="uc-form-group">
                                <label>Danh mục cha</label>
                                <select
                                    value={form.parent_id}
                                    onChange={e => setForm({ ...form, parent_id: e.target.value })}
                                >
                                    <option value="">-- Chọn danh mục cha --</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                            </div>

                            <div className="uc-form-group">
                                <label>Trạng thái</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>

                            <div className="uc-form-group uc-form-group--full">
                                <label>Mô tả ngắn</label>
                                <TinyEditor
                                    value={form.description}
                                    onChange={(content) => setForm({ ...form, description: content })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="uc-card">
                        <div className="uc-card__header">
                            <h3>Ảnh danh mục</h3>
                            <p>Tải ảnh đại diện cho danh mục</p>
                        </div>

                        <div className="uc-upload-zone">
                            <div className="uc-upload-zone__icon">
                                <FiUploadCloud />
                            </div>
                            <p className="uc-upload-zone__title">Kéo thả ảnh vào đây</p>
                            <span className="uc-upload-zone__sub">Hoặc bấm để chọn từ máy tính</span>
                            <label htmlFor="uc-thumbnail" className="uc-upload-btn">Chọn ảnh</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="uc-thumbnail"
                                className="uc-file-input"
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
                            <div className="uc-thumb-preview">
                                <button
                                    type="button"
                                    className="uc-thumb-preview__remove"
                                    onClick={handleClearThumb}
                                >
                                    ✕
                                </button>
                                <img src={thumbnailPreview} alt="thumbnail preview" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="uc-sidebar">
                    <div className="uc-card">
                        <div className="uc-card__header">
                            <h3>Thiết lập nhanh</h3>
                            <p>Các tùy chọn hiển thị cho danh mục</p>
                        </div>

                        <div className="uc-toggle-list">
                            <label className="uc-toggle-item">
                                <div>
                                    <span className="uc-toggle-item__label">Nổi bật</span>
                                    <span className="uc-toggle-item__desc">Hiển thị danh mục nổi bật</span>
                                </div>
                                <input type="checkbox" />
                            </label>

                            <label className="uc-toggle-item">
                                <div>
                                    <span className="uc-toggle-item__label">Hiển thị trang chủ</span>
                                    <span className="uc-toggle-item__desc">Cho phép xuất hiện ở trang chủ</span>
                                </div>
                                <input type="checkbox" />
                            </label>
                        </div>
                    </div>

                    <div className="uc-card uc-sticky">
                        <div className="uc-card__header">
                            <h3>Hành động</h3>
                            <p>Lưu hoặc hủy thao tác cập nhật</p>
                        </div>

                        <div className="uc-actions">
                            <button className="uc-btn uc-btn--primary" onClick={handleUpdateCategory}>
                                Lưu thay đổi
                            </button>
                            <button className="uc-btn uc-btn--outline">Lưu bản nháp</button>
                            <Link to="/admin/categories" className="uc-btn uc-btn--danger">
                                Hủy bỏ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateCategory;