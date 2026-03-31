import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./header.scss";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  SearchOutlined,
  LoadingOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import LogoutClient from "../../../pages/auth/logout";

function Header({ setOpenMenu }) {
  const setting = useSelector((state) => state.setting);
  const settings = setting?.settings;
  const loading = setting?.loading;

  const isLogin = useSelector((state) => state.authClient?.isLogin);
  const user = useSelector((state) => state.authClient?.user);
  const loadingLogin = useSelector((state) => state.authClient?.loading);

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header_client">
      <div className="header_layout_client" id="home">
        <div className="header_layout_client-logo">
          {loading ? (
            <LoadingOutlined />
          ) : (
            <HashLink smooth to="/#">
              <img src={settings?.logo} alt="logo" />
            </HashLink>
          )}
        </div>

        <nav className="header_layout_client-menu">
          <HashLink smooth to="/#">Trang chủ</HashLink>
          <Link to="/bai-viet">Bài viết</Link>
          <HashLink smooth to="/#gioi-thieu">Giới thiệu</HashLink>
          <HashLink smooth to="/#showroom">Showroom</HashLink>
        </nav>

        <div className="header_layout_client-search">
          <SearchOutlined />
          <input type="text" placeholder="Search tech..." />
        </div>

        <div className="header_layout_client-card">
          <MenuOutlined onClick={() => setOpenMenu((prev) => !prev)} />

          <div className="search">
            <SearchOutlined />
          </div>

          {loadingLogin ? (
            <span className="spinner"></span>
          ) : isLogin ? (
            <>
              <div className="profile_wrapper" ref={profileRef}>
                <div
                  className="avatar"
                  onClick={() => setOpenProfile((prev) => !prev)}
                >
                  <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                  alt="avatar"
                />                 
                </div>

                {openProfile && (
                  <div className="profile_modal">
                    <div className="profile_modal-header">
                      <div className="profile_modal-avatar">
                        <img
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                          alt="avatar"
                        />
                      </div>

                      <div className="profile_modal-info">
                        <h4>{user?.name || "Người dùng"}</h4>
                        <p>{user?.email || "example@gmail.com"}</p>
                      </div>
                    </div>

                    <div className="profile_modal-menu">
                      <Link to="/account" onClick={() => setOpenProfile(false)}>
                        <UserOutlined />
                        <span>Thông tin cá nhân</span>
                      </Link>

                      <Link to="/don-hang" onClick={() => setOpenProfile(false)}>
                        <FileTextOutlined />
                        <span>Đơn hàng</span>
                      </Link>

                      <Link to="/yeu-thich" onClick={() => setOpenProfile(false)}>
                        <HeartOutlined />
                        <span>Yêu thích</span>
                      </Link>

                      <Link to="/gio-hang" onClick={() => setOpenProfile(false)}>
                        <ShoppingCartOutlined />
                        <span>Giỏ hàng</span>
                      </Link>

                      {/* pages/client/auth/logout */}
                      <LogoutClient setOpenProfile={setOpenProfile} />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link className="login" to="/login">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;