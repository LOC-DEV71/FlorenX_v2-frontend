import { useSelector } from "react-redux";
import "./Account.scss";
import React, { useEffect, useMemo, useState } from "react";
import { update } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";

function AccountClient() {
    const account = useSelector((state) => state.authClient.user);
    const loadingUi = useSelector((state) => state.authClient.loading);
    const [user, setUser] = useState({});
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const avatarsPerPage = 32;

    useEffect(() => {
        if (account) {
            setUser(account);
        }
    }, [account]);

    const avatarSeeds = useMemo(() => {
        const seeds = [];
        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {
                seeds.push(
                    String.fromCharCode(97 + i) + String.fromCharCode(97 + j)
                );
            }
        }
        return seeds;
    }, []);

    const totalPages = Math.ceil(avatarSeeds.length / avatarsPerPage);

    const currentAvatars = useMemo(() => {
        const startIndex = (currentPage - 1) * avatarsPerPage;
        return avatarSeeds.slice(startIndex, startIndex + avatarsPerPage);
    }, [avatarSeeds, currentPage]);

    const getAvatarUrl = (seed) =>
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

    const openAvatarModal = () => {
        setCurrentPage(1);
        setIsAvatarModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectAvatar = (seed) => {
        setUser((prev) => ({
            ...prev,
            avatar: getAvatarUrl(seed),
        }));
        setIsAvatarModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await update(user);
            if (res.data.code) {
                success(res.data.message);
            }
        } catch (err) {
            error(err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-profile-page" id="user-profile-page">
            {loading && (
                <Loading/>
            )}
            {loadingUi &&
                <Loading/>
            }

            <div className="user-profile-container">
                <div className="profile-sidebar-card">
                    <div className="avatar-wrap">
                        <img
                            src={user.avatar || getAvatarUrl("aa")}
                            alt={user.fullname || "avatar"}
                            className="avatar"
                            onClick={openAvatarModal}
                        />

                        <button
                            type="button"
                            className="change-avatar-btn"
                            onClick={openAvatarModal}
                        >
                            Đổi ảnh đại diện
                        </button>
                    </div>

                    <h2 className="user-name">{user.fullname}</h2>
                    <p className="user-email">{user.email}</p>

                    <div className="user-meta">
                        <div className="meta-box">
                            <span className="label">Hạng</span>
                            <strong>VIP Gold</strong>
                        </div>
                        <div className="meta-box">
                            <span className="label">Đơn hàng</span>
                            <strong>12</strong>
                        </div>
                    </div>
                </div>

                <div className="profile-content-card">
                    <div className="section-header">
                        <h1>Thông tin tài khoản</h1>
                        <p>Quản lý thông tin tài khoản của bạn</p>
                    </div>

                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="fullname">Họ và tên</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={user.fullname || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập email"
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={user.phone || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="address">Địa chỉ</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={user.address || ""}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={loading}
                                onClick={() => setUser(account)}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isAvatarModalOpen && (
                <div
                    className="avatar-modal-overlay"
                    onClick={() => setIsAvatarModalOpen(false)}
                >
                    <div
                        className="avatar-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="avatar-modal-header">
                            <h3>Chọn ảnh đại diện</h3>
                            <button
                                type="button"
                                className="close-btn"
                                onClick={() => setIsAvatarModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="avatar-options">
                            {currentAvatars.map((seed) => (
                                <button
                                    key={seed}
                                    type="button"
                                    className={`avatar-option ${
                                        user.avatar === getAvatarUrl(seed) ? "active" : ""
                                    }`}
                                    onClick={() => handleSelectAvatar(seed)}
                                    title={`Avatar ${seed}`}
                                >
                                    <img
                                        src={getAvatarUrl(seed)}
                                        alt={`avatar-${seed}`}
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="avatar-pagination">
                            <button
                                type="button"
                                className="pagination-btn"
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) => prev - 1)
                                }
                            >
                                ← Trước
                            </button>

                            <span className="pagination-info">
                                Trang {currentPage} / {totalPages}
                            </span>

                            <button
                                type="button"
                                className="pagination-btn"
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) => prev + 1)
                                }
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountClient;