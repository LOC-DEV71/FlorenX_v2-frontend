import "./login.client.scss";
import { useState } from "react";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    GoogleOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { Input, message } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, loginLocal } from "../../../services/client/Auth.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";
import SEO from "../../../utils/SEO";

function LoginClient() {
    const [showPassword, setShowPassword] = useState(false);
    const logo = useSelector(state => state.setting?.settings?.favicon);
    const [loading, setLoading] = useState(false)
    const [loadinggg, setLoadinggg] = useState(false)
    const [form, setForm] = useState({
        email: "",
        password:""
    });

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoadinggg(true)
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
        } finally {
            setLoadinggg(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginLocal(form);
            if(res.data.code){
                success(res.data?.message || "Đăng nhập thành công")
                setTimeout(() => {
                    window.location.href = "/"
                }, 1000)
            }
        } catch (err) {
            console.error(err.response?.data?.message)
            error(err.response?.data?.message || "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-client">
            {(loading || loadinggg) && 
                <Loading/>
            }
            <SEO title={"Đăng nhập"}/>
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
                                <Input 
                                    placeholder="Nhập email" 
                                    onChange={e => setForm({...form, email: e.target.value})}
                                />
                            </div>

                            <div className="login-client__form-group">
                                <label>Mật khẩu</label>

                                <div className="login-client__input-wrapper">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Nhập mật khẩu"
                                        onChange={e => setForm({...form, password: e.target.value})}
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
                                <Link className="login-client__forgot" to={"/forgot-password"}>Quên mật khẩu?</Link>
                            </div>

                            <button type="submit" className="login-client__btn" onClick={handleSubmit}>
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