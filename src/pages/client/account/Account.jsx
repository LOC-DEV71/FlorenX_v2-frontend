import { useSelector } from "react-redux";
import "./Account.scss"
import React, { useState } from "react";

function AccountClient(){
    const account = useSelector(state => state.authClient)
  const [user, setUser] = useState({
    fullname: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    password: "",
    phone: "0901234567",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated user:", user);
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="user-profile-page">
      <div className="user-profile-container">
        <div className="profile-sidebar-card">
          <div className="avatar-wrap">
            <img src={user.avatar} alt={user.fullname} className="avatar" />
            <button className="change-avatar-btn">Đổi ảnh</button>
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
            <h1>Thông tin cá nhân</h1>
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
                  value={user.fullname}
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
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={user.phone}
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
                  value={user.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="password">Mật khẩu mới</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountClient;