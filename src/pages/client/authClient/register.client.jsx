import "./login.client.scss";
import { useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function RegisterClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const logo = useSelector(state => state.setting?.settings?.favicon);

  return (
    <div className="login-client">
      <Link to="/" className="login-client__back">
        <ArrowLeftOutlined />
        <span>Về trang chủ</span>
      </Link>

      <div className="login-client__container">
        <div className="login-client__left">
          <div className="login-client__img">
            <img src={logo} alt="logo" />
            <p className="login-client__brand">VELTRIX GEAR</p>
          </div>
        </div>

        <div className="login-client__right">
          <div className="login-client__box">
            <h2>Đăng ký</h2>
            <p className="login-client__sub">Tạo tài khoản mới</p>

            <form>
              <div className="login-client__form-group">
                <label>Họ và tên</label>
                <Input placeholder="Nhập họ vag tên" />
              </div>
              <div className="login-client__form-group">
                <label>Email</label>
                <Input placeholder="Nhập email" />
              </div>

              <div className="login-client__form-group">
                <label>Mật khẩu</label>

                <div className="login-client__input-wrapper">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                  />

                  <span
                    className="login-client__eye"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
              </div>
              <div className="login-client__form-group">
                <label>Xác nhận mật khẩu</label>

                <div className="login-client__input-wrapper">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                  />

                  <span
                    className="login-client__eye"
                    onClick={() => setShowPasswords((prev) => !prev)}
                  >
                    {showPasswords ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
              </div>

              <button type="submit" className="login-client__btn">
                Đăng ký
              </button>

              <p className="login-client__register">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterClient;