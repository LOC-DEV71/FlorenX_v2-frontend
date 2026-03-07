import { Link } from "react-router-dom";
import logo from "../../../assets/logo/logo_main.png";
import {HashLink} from "react-router-hash-link";
import "./header.scss";
import {MenuOutlined, UserOutlined, ShoppingCartOutlined, HeartOutlined, SearchOutlined} from "@ant-design/icons"
function Header(){
    return(
        <header>
            <div className="header_layout_client" id="home">
                <div to={"/"} className="header_layout_client-logo">                 
                    <HashLink smooth to={"/#"}><img src={logo} alt="logo" /></HashLink>
                </div>
                <div className="header_layout_client-menu">
                    <HashLink smooth to="/#home">Trang chủ</HashLink>
                    <Link>Bài Viết</Link>
                    <Link>Showroom</Link>
                </div>
                <div className="header_layout_client-search" >
                    <SearchOutlined /><input type="text" placeholder="Search tech..."/>
                </div>
                <div className="header_layout_client-card">
                    <MenuOutlined />
                    <div className="search">
                        <SearchOutlined/>
                    </div>
                    <HeartOutlined />
                    <UserOutlined />
                    <ShoppingCartOutlined />
                </div>
            </div>
        </header>
    )
}
export default Header