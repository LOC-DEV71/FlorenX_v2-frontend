import Logo from "../../assets/logo/logo_main.png";
import Banner from "../../assets/banner/banner-auth-login-admin.jpg";
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
        <div className="veltrix_admin_login" style={{ backgroundImage: `url(${Banner})` }}>
            <div className="glass-overlay"></div>
            
            <div className="login-glass-box">
                <div className="login-glass-box-header">
                    <img src={Logo} alt="logo" />
                    <p>VELTRIX GEAR ADMIN</p>
                </div>

                <h2>Welcome Back</h2>
                <p className="subtitle">Please enter your details to sign in</p>

                <div className="form-data">
                    <CiUser />
                    <input type="email" placeholder="Email Address" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="form-data">
                    <LuLockKeyhole />
                    <input type={typeInput ? "text" : "password"} placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    {typeInput ? <EyeInvisibleOutlined className="eye" onClick={() => setTypeInput(prev => !prev)} /> :
                        <EyeOutlined className="eye" onClick={() => setTypeInput(prev => !prev)} />}
                </div>

                <button className="btn-login" onClick={handleLogin}>Login to Dashboard</button>
            </div>
        </div>
    );
}

export default LoginAdmin;