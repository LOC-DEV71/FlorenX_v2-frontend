import "./mainLayout.scss";
import { Outlet } from "react-router-dom";
import Header from "../../components/client/Header/header";
import Footer from "../../components/client/Footer/footer";
import { useState, useEffect, useRef } from "react";
import { Menu } from "antd";
import { getTreeCategory } from "../../services/client/product.category.client";
import { mapCategoryToMenuItems } from "../../utils/buildTree";

function MainLayout() {
  const [menuItems, setMenuItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getTreeCategory();
      if (res.data.code) {
        setMenuItems(mapCategoryToMenuItems(res.data.categories));
      }
    };
    fetchApi();
  }, []);

  // click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>  
      <Header setOpenMenu={setOpenMenu} />

      {openMenu && (
        <div ref={menuRef} className="category-overlay">
          <button className="close-btn" onClick={() => setOpenMenu(false)}>
            x
          </button>
          <Menu mode="inline" items={menuItems} />
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;