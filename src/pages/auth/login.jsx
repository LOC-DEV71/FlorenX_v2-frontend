import Logo from "../../assets/logo/logo_main.png";
import Banner from "../../assets/banner/banner-auth.webp";
import { CiUser } from "react-icons/ci";
import { LuLockKeyhole } from "react-icons/lu";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "./auth.scss";
import { useState } from "react";
import { authLoginAdmin } from "../../services/admin/auth.admin.service";
import { error, success } from "../../utils/notift";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
    const [typeInput, setTypeInput] = useState(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const handleLogin = async () => {
        try {
            const res = await authLoginAdmin(form);
            if (res.data.code) {
                success(res.data.message)
                window.location.href = "/admin";
            } 
        } catch (err) {
            error(err.response?.data?.message || "Đăng nhập thất bại");
        }
    }

    return (
        <div className="auth_admin">
            <div className="auth_admin-top">
                <img src={Logo} alt="logo" />
                <p>VELTRIX GEAR MANAGEMENT</p>
            </div>

            <div className="auth_admin-main">
                <div className="auth_admin-main-left">
                    <img src={Banner} alt="banner" />
                </div>

                <div className="auth_admin-main-right">
                    <h2>Admin Login</h2>

                    <div className="form-data">
                        <CiUser />
                        <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div className="form-data">
                        <LuLockKeyhole />
                        <input type={typeInput ? "text" : "password"} placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        {typeInput ? <EyeInvisibleOutlined className="eye" onClick={() => setTypeInput(prev => !prev)} /> :
                            <EyeOutlined className="eye" onClick={() => setTypeInput(prev => !prev)} />}

                    </div>

                    <button className="btn-login" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;