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

    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getListCategory();
                if (res.data.code) {
                    setCategories(res.data.categories)
                }
            }
            fetchApi();
        } catch (err) {
            console.error(err.response?.data.message)
        }
    }, [])

    const handleCreateCategory = async () => {
        try {
            const formData = new FormData();

            Object.keys(form).forEach((key) => {
                if (key === "parent_id" && !form[key]) return;
                if (key === "position" && !form[key]) return;
                formData.append(key, form[key]);
            });

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            const res = await createProductCategory(formData);
            if (res.data.code) {
                success(res.data.message);
                navigate("/admin/categories");
            }
        } catch (err) {
            error(err.response?.data.message);
        }
    };
    return (
        <div className="create-category-page">
            <SEO title="Tạo danh mục" />

            <div className="create-category-page__header">
                <div>
                    <p class="eyebrow">Veltrix Gear</p>
                    <h2 className="create-category-page__title">Tạo Danh Mục</h2>
                    <p className="create-category-page__desc">
                        Thêm danh mục mới cho hệ thống quản trị
                    </p>
                </div>

                <Link to="/admin/categories" className="back-link">
                    <MdOutlineKeyboardBackspace />
                    Quay lại
                </Link>
            </div>

            <div className="create-category-layout">
                <div className="create-category-main">
                    <div className="form-card">
                        <div className="form-card__header">
                            <h3>Thông tin danh mục</h3>
                            <p>Nhập các thông tin cơ bản của danh mục</p>
                        </div>

                        <div className="form-grid">
                            <div className="form-group full">
                                <label>Tên danh mục</label>
                                <input type="text" placeholder="Nhập tên danh mục..." onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Slug</label>
                                <input type="text" placeholder="vi-du-danh-muc" onChange={e => setForm({ ...form, slug: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Vị trí</label>
                                <input type="number" placeholder="Có thể không nhập tự động + 1" onChange={e => setForm({ ...form, position: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Danh mục cha</label>
                               <select
                                    value={form.parent_id}
                                    onChange={e => setForm({ ...form, parent_id: e.target.value })}
                                >
                                    <option value="">-- Chọn danh mục cha --</option>
                                    {renderCategoryOptions(categories)}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Trạng thái</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value={"active"}>Hoạt động</option>
                                    <option value={"inactive"}>Không hoạt động</option>
                                </select>
                            </div>

                            <div className="form-group full">
                                <label>Mô tả ngắn</label>
                                <TinyEditor onChange={(content) => setForm({ ...form, description: content })} />
                            </div>
                        </div>
                    </div>

                    <div className="form-card">
                        <div className="form-card__header">
                            <h3>Ảnh danh mục</h3>
                            <p>Tải ảnh đại diện cho danh mục</p>
                        </div>

                        <div className="upload-box">
                            <div className="upload-box__icon">
                                <FiUploadCloud />
                            </div>
                            <p className="upload-box__title">Kéo thả ảnh vào đây</p>
                            <span className="upload-box__sub">
                                Hoặc bấm để chọn ảnh từ máy tính
                            </span>
                            <label htmlFor="thumbnail" className="upload-btn">
                                Chọn ảnh
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="thumbnail"
                                className="input"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    if (!file) return
                                    setThumbnail(file)
                                    setThumbnailPreview(URL.createObjectURL(file))
                                }}
                            />


                        </div>
                        <div className="thumbnailPriview">
                            <button
                                type="button"
                                className={thumbnailPreview ? "clear" : "clear-none"}
                                onClick={() => {
                                    setThumbnailPreview(null);
                                    setThumbnail(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                            >
                                X
                            </button>

                            {thumbnailPreview && <img src={thumbnailPreview} alt="thumbnail preview" />}
                        </div>
                    </div>

                    {/* <div className="form-card">
            <div className="form-card__header">
              <h3>SEO</h3>
              <p>Tối ưu hiển thị cho công cụ tìm kiếm</p>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Meta title</label>
                <input type="text" placeholder="Nhập meta title..." />
              </div>

              <div className="form-group full">
                <label>Meta description</label>
                <textarea
                  rows="4"
                  placeholder="Nhập meta description..."
                />
              </div>
            </div>
          </div> */}
                </div>

                <div className="create-category-sidebar">
                    <div className="form-card">
                        <div className="form-card__header">
                            <h3>Thiết lập nhanh</h3>
                            <p>Các tùy chọn hiển thị cho danh mục</p>
                        </div>

                        <div className="toggle-list">
                            <label className="toggle-item">
                                <div>
                                    <span>Nổi bật</span>
                                    <small>Hiển thị danh mục nổi bật</small>
                                </div>
                                <input type="checkbox" />
                            </label>

                            <label className="toggle-item">
                                <div>
                                    <span>Hiển thị trang chủ</span>
                                    <small>Cho phép xuất hiện ở trang chủ</small>
                                </div>
                                <input type="checkbox" />
                            </label>

                            <label className="toggle-item">
                                <div>
                                    <span>Tự động sinh slug</span>
                                    <small>Tự động tạo slug từ tên danh mục</small>
                                </div>
                                <input type="checkbox" />
                            </label>
                        </div>
                    </div>

                    <div className="form-card sticky-card">
                        <div className="form-card__header">
                            <h3>Hành động</h3>
                            <p>Lưu hoặc hủy thao tác tạo mới</p>
                        </div>

                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={handleCreateCategory}>
                                <CgMathPlus />
                                Tạo danh mục
                            </button>

                            <Link to="/admin/categories" className="btn btn-danger">
                                Hủy bỏ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;