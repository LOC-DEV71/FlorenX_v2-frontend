import { Link } from "react-router-dom";
import {HashLink} from "react-router-hash-link";
import "./header.scss";
import {MenuOutlined, UserOutlined, ShoppingCartOutlined, HeartOutlined, SearchOutlined, LoadingOutlined} from "@ant-design/icons"; 
import { useSelector } from "react-redux";
import { Skeleton } from "antd";

function Header({setOpenMenu}){
    const setting = useSelector((state) => state.setting);
    const settings = setting?.settings;
    const loading = setting?.loading;
    
    return(
        <header>
            <div className="header_layout_client" id="home">
                <div to={"/"} className="header_layout_client-logo">                 
                    {loading ?  <LoadingOutlined /> : <HashLink smooth to={"/#"}><img src={settings?.logo} alt="logo" /></HashLink>}
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
                    <MenuOutlined onClick={() => setOpenMenu(prev => !prev)}/>
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