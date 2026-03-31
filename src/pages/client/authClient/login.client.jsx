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
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";

function LoginClient() {
    const [showPassword, setShowPassword] = useState(false);
    const logo = useSelector(state => state.setting?.settings?.favicon);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await googleLogin({
                token: credentialResponse.credential
            });

            if (res.ok) {

                success("Đăng nhập Google thành công");

                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                error(res.data || "Đăng nhập Google thất bại");
            }
        } catch (err) {
            console.error(err);
            error("Có lỗi xảy ra khi đăng nhập Google");
        } 
    };

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
                        <h2>Đăng nhập</h2>
                        <p className="login-client__sub">Chào mừng trở lại</p>

                        <form>
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

                            <div className="login-client__options">
                                <span className="login-client__forgot">Quên mật khẩu?</span>
                            </div>

                            <button type="submit" className="login-client__btn">
                                Đăng nhập
                            </button>

                            <div className="login-client__divider">
                                <span>hoặc</span>
                            </div>

                            <div className="login-client__btn-google">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => error("Google Login Failed")}
                                />
                            </div>

                            <p className="login-client__register">
                                Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginClient;