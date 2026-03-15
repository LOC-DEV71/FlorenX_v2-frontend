import "./create.account.scss"
import Avatar from "../../../assets/banner/avatar-none.jpg";
import { useEffect, useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import SEO from "../../../utils/SEO";
import { error, success } from "../../../utils/notift";
import { updateAccount, getAccountById } from "../../../services/admin/account.admin.service";
import { getListRoles } from "../../../services/admin/roles.admin.service";
import { useParams } from "react-router-dom";
function UpdateAccount() {
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phone: "",
        role_slug: "",
        status: "active",
        password: ""
    });
    const [typeInput, setTypeInput] = useState(true);
    const [roles, setRoles] = useState([])
    const { id } = useParams();

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        try {
            let data;

            if (avatar) {
                data = new FormData();
                data.append("fullname", form.fullname);
                data.append("email", form.email);
                data.append("phone", form.phone);
                data.append("password", form.password);
                data.append("status", form.status);
                data.append("avatar", avatar);
                data.append("role_slug", form.role_slug);
            } else {
                data = {
                    fullname: form.fullname,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                    status: form.status,
                    role_slug: form.role_slug
                };
            }

            const res = await updateAccount({ id, data });

            if (res.data.code) {
                success(res.data.message);
            }
        } catch (err) {
            error(err.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getListRoles();
                if (res.data.code) {
                    setRoles(res.data.roles)
                }
            }
            fetchApi();
        } catch (err) {
            error(err.response?.data?.message || "có lỗi sảy ra")
        }
    }, [])

    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getAccountById(id);
                const data = res.data.account;
                if (res.data.code) {
                    setForm(prev => ({
                        ...prev,
                        fullname: data.fullname || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        role_slug: data.role_slug || "",
                        status: data.status || "active",
                        password: ""
                    }))

                    setAvatar(data?.avatar)
                    setAvatarPreview(data?.avatar)
                }
            }
            fetchApi();
        } catch (err) {
            error(err.response?.data.message)
        }
    }, [])

    return (
        <div className="create-admin-page">
            <SEO title={"Cập nhật tài khoản admin"} />
            <div className="create-admin-card">
                <div className="card-head">
                    <div>
                        <p className="eyebrow">Veltrix Gear</p>
                        <h2>Tạo tài khoản admin</h2>
                        <p className="sub">
                            Tạo mới tài khoản quản trị với đầy đủ thông tin và phân quyền phù hợp.
                        </p>
                    </div>

                    <div className="head-badge">
                        <span>Tài khoản quản trị</span>
                    </div>
                </div>

                <div className="create-admin-body">
                    <div className="avatar-panel">
                        <div className="avatar-preview-wrap">
                            <div className="avatar-preview">
                                <img
                                    src={avatarPreview ? avatarPreview : Avatar}
                                    alt="Avatar preview"
                                />
                            </div>
                            <p className="preview-title">Preview avatar</p>
                            <p className="preview-note">Ảnh đại diện sẽ hiển thị tại đây</p>
                        </div>

                        <div className="avatar-upload-box">
                            <label className="upload-label">Ảnh đại diện</label>
                            <label className="upload-area" htmlFor="avatar">
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setAvatar(file)
                                            setAvatarPreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                                <span className="upload-icon">↑</span>
                                <span className="upload-text">Chọn ảnh tại đây</span>
                                <span className="upload-subtext">PNG, JPG, WEBP - tối đa 5MB</span>
                            </label>
                        </div>
                    </div>

                    <div className="admin-form">
                        <div className="form-grid">
                            <div className="form-group full">
                                <label htmlFor="fullname">Họ và tên</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    placeholder="Nhập họ và tên"
                                    onChange={e => setForm({ ...form, fullname: e.target.value })}
                                    value={form.fullname}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    value={form.email}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder="Nhập số điện thoại"
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    value={form.phone}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu mới</label>
                                <div className="form-password">
                                    <input
                                        type={typeInput ? "password" : "text"}
                                        id="password"
                                        name="password"
                                        placeholder="Nhập mật khẩu mới"
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        value={form.password}
                                    />
                                    {typeInput ? <EyeOutlined onClick={() => setTypeInput(!typeInput)} /> : <EyeInvisibleOutlined onClick={() => setTypeInput(!typeInput)} />}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="role_slug">Vai trò</label>
                                <select id="role_slug" name="role_slug" value={form.role_slug} onChange={e => setForm({ ...form, role_slug: e.target.value })}>
                                    <option value="">-- Chọn vai trò --</option>
                                    {roles.map(item => (
                                        <option value={item.slug} key={item._id}>{item.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="">-- Chọn trạng thái --</option>
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Tạm khóa</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button onClick={handleUpdateAccount} className="btn btn-primary">Cập nhật tài khoản</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default UpdateAccount