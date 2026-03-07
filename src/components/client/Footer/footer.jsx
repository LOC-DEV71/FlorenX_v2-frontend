import "./footer.scss";
import logo from "../../../assets/logo/logo_main.png";
import {HashLink} from "react-router-hash-link";

function Footer() {
    return (
        <footer className="footer_layout_client">

            <div className="footer_layout_client-top">

                <div className="footer_layout_client-logo">
                    <img src={logo} alt="logo" />
                    <p>
                        FlorenX - Nền tảng công nghệ và gaming gear chất lượng cao.
                    </p>
                </div>

                <div className="footer_layout_client-column">
                    <h4>Sản phẩm</h4>
                    <a href="#">PC Gaming</a>
                    <a href="#">Laptop</a>
                    <a href="#">Linh kiện</a>
                    <a href="#">Phụ kiện</a>
                </div>

                <div className="footer_layout_client-column">
                    <h4>Hỗ trợ</h4>
                    <a href="#">Trung tâm trợ giúp</a>
                    <a href="#">Bảo hành</a>
                    <a href="#">Chính sách đổi trả</a>
                    <a href="#">Liên hệ</a>
                </div>

                <div className="footer_layout_client-column">
                    <h4>Công ty</h4>
                    <HashLink smooth to="/#">Trang chủ</HashLink>
                    <HashLink smooth to="/#">Giới thiệu</HashLink>
                    <a href="#">Tuyển dụng</a>
                    <a href="#">Tin tức</a>
                </div>

            </div>

            <div className="footer_layout_client-bottom">
                <p>© 2026 Veltrix Gear. All rights reserved.</p>
            </div>

        </footer>
    )
}
export default Footer