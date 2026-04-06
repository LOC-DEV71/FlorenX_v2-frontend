import "./login.client.scss";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { forgotPassword } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";

function ForgotPassword() {
  const logo = useSelector((state) => state.setting?.settings?.favicon);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword(form);

      if (res?.data?.code) {
        success(res.data.message);
        navigate("/forgot-otp", {
          state: {
            email: form.email,
          },
        });
      }
    } catch (err) {
      console.error(err.response?.data?.message);
      error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Lấy lại mật khẩu</h2>
            <p className="login-client__sub">Nhập email của bạn</p>

            <form onSubmit={handleSubmit}>
              <div className="login-client__form-group">
                <label>Email</label>
                <Input
                  placeholder="Nhập email của bạn"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="login-client__btn">
                Xác nhận
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

export default ForgotPassword;