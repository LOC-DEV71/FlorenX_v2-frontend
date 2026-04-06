import "./login.client.scss";
import { useState } from "react";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { forgotPasswordOtp } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";
import { useLocation } from "react-router-dom";


function ForgotOtp() {
 const location = useLocation();
  const email = location.state?.email;
  const logo = useSelector(state => state.setting?.settings?.favicon);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    otp: "",
    email: email,
  });
    const handleChange = (e) => {
      const {name, value} = e.target;
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
        const res = await forgotPasswordOtp(form);
        if(res.data?.code){
            success(res.data?.message)
            navigate("/reset-password", {
                state: {
                    email: form.email
                },
            });
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
      {loading && <Loading/>}
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
            <h2>Xác nhận OTP</h2>
            <p className="login-client__sub">Nhập mã xác nhận để đổi mật khẩu</p>

            <form>
              <div className="login-client__form-group">
                <label>Mã xác nhận</label>
                <Input placeholder="Nhập mã xác nhận của bạn" name="otp" onChange={handleChange}/>
              </div>

              <button 
              type="submit" 
              className="login-client__btn" 
              onClick={hanldeSubmit}
              >
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

export default ForgotOtp;