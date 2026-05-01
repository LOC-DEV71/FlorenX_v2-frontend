import "./mainLayout.scss";
import { Outlet } from "react-router-dom";
import Header from "../../components/client/Header/header";
import Footer from "../../components/client/Footer/footer";
import { useState, useEffect, useRef } from "react";
import { Menu } from "antd";
import { 
  CloseOutlined 
} from "@ant-design/icons";
import { getTreeCategory } from "../../services/client/product.category.client";
import { mapCategoryToMenuItems } from "../../utils/buildTree";
import { useSelector } from "react-redux";
import ChatBox from "../../pages/client/Chat/ChatBox";

function MainLayout() {
  const [menuItems, setMenuItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const room_chat_id = useSelector((state) => state.authClient.user?.room_chat_id);
  
  const menuRef = useRef(null);

  // Fetch dữ liệu Menu
  useEffect(() => {
    const fetchApi = async () => {
      const res = await getTreeCategory();
      if (res.data?.code) {
        setMenuItems(mapCategoryToMenuItems(res.data.categories));
      }
    };
    fetchApi();
  }, []);

  // Click outside đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="client_layout">
      <Header setOpenMenu={setOpenMenu} />

      {/* Menu Overlay */}
      {openMenu && (
        <div ref={menuRef} className="category-overlay">
          <button className="close-btn" onClick={() => setOpenMenu(false)}>
            <CloseOutlined />
          </button>
          <Menu mode="inline" items={menuItems} />
        </div>
      )}

      <main className="main-content">
        <Outlet />
      </main>

      {/* Chat Component đã tách */}
      <ChatBox room_chat_id={room_chat_id} />

      <Footer />
    </div>
  );
}

export default MainLayout;