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
import { resetPassword } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";
import { useLocation } from "react-router-dom";


function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const logo = useSelector(state => state.setting?.settings?.favicon);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    password: "",
    email: email,
    repassword: ""
    
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => (
      {
        ...prev,
        [name]: value
      }))
  }

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword(form);
      if (res.data?.code) {
        success(res.data?.message)
        setTimeout(() => {
          window.location.href = `/`
        }, 1500)
      }
    } catch (err) {
      error(err.response?.data?.message || "Có lỗi xảy ra")
      console.error(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="login-client">
      {loading && <Loading />}
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
            <h2>Đổi mật khẩu</h2>
            <p className="login-client__sub">Nhập mật khẩu mới.</p>

            <form>
              <div className="login-client__form-group">
                <label>Mật khẩu</label>

                <div className="login-client__input-wrapper">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    onChange={handleChange}
                    name="password"
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
                    type={showPasswords ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    name="repassword"
                    onChange={handleChange}
                  />

                  <span
                    className="login-client__eye"
                    onClick={() => setShowPasswords((prev) => !prev)}
                  >
                    {showPasswords ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                  </span>
                </div>
              </div>

              <button
                className="login-client__btn"
                onClick={hanldeSubmit}
              >
                Xác nhận và đăng nhập
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

export default ResetPassword;