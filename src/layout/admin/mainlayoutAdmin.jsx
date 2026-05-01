import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, Link } from "react-router-dom";
import LogoMain from "../../assets/logo/logo_main.png";
import Logo from "../../assets/logo/logo.png";
import {
  MdDashboard,
  MdCategory,
  MdShoppingCart,
  MdOutlineManageAccounts,
  MdAccountTree,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { TfiControlEject } from "react-icons/tfi";
import { GrArticle } from "react-icons/gr";
import { useSelector } from "react-redux";
import { IoMdChatboxes } from "react-icons/io";
import { TbCategory } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import "./MainLayoutAdmin.scss";
import Avatar from "../../assets/banner/avatar-none.jpg";



const { Header, Sider, Content } = Layout;



const MainLayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const role = useSelector(state => state.auth.role)
  const permission = role?.permissions;
  const exitProduct = permission?.includes("view_products");
  const exitAccount = permission?.includes("view_accounts");
  const exitProductCategory = permission?.includes("view_product_category");
  const exitOders = permission?.includes("view_orders");
  const exitRoles = permission?.includes("view_roles");
  const exitPermissions = permission?.includes("view_permissions");
  const exitNews = permission?.includes("view_news");
  const exitNewsCategory = permission?.includes("view_news_category");
  const { admin } = useSelector((state) => state.auth);
  const menuItems = [
    {
      key: "1",
      icon: <MdDashboard />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    ...(exitProduct
      ? [
        {
          key: "2",
          icon: <AiFillProduct />,
          label: <Link to="/admin/products">Sản phẩm</Link>,
        },
      ]
      : []),
    ...(exitProductCategory
      ? [
        {
          key: "3",
          icon: <MdCategory />,
          label: <Link to="/admin/categories">Danh mục</Link>,
        }
      ] : []
    ),
    ...(exitOders
      ? [
        {
          key: "4",
          icon: <MdShoppingCart />,
          label: <Link to="/admin/orders">Đơn hàng</Link>,
        }
      ] : []
    )
    ,
    ...(exitAccount
      ? [{
        key: "5",
        icon: <MdOutlineManageAccounts />,
        label: <Link to="/admin/accounts">TK Quản trị</Link>,
      }] : []
    ),
    ...(exitRoles
      ? [{
        key: "6",
        icon: <TfiControlEject />,
        label: <Link to="/admin/roles">Nhóm quyền</Link>,
      }] : []
    )
    ,
    ...(exitPermissions
      ? [
        {
          key: "7",
          icon: <MdAccountTree />,
          label: <Link to="/admin/permission">Phân quyền</Link>,
        }
      ] : []
    ),
    ...(exitNewsCategory
      ? [

        {
          key: "8",
          icon: <TbCategory />,
          label: <Link to="/admin/new-categories">Danh mục bài viết</Link>,
        }
      ] : []
    ),
    ...(exitNews
      ? [{
        key: "9",
        icon: <GrArticle />,
        label: <Link to="/admin/news">Bài viết</Link>,
      }] : []
    )
    ,
    {
      key: "10",
      icon: <IoMdChatboxes />,
      label: <Link to="/admin/chat">CSKH</Link>,
    }
    ,
    {
      key: "11",
      icon: <FaRegTrashCan />,
      label: <Link to="/admin/trashcan">Thùng rác</Link>,
    }
    ,
    {
      key: "12",
      icon: <IoSettings />,
      label: <Link to="/admin/setting">Cài đặt</Link>,
    }

  ];
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const siderWidth = collapsed ? 80 : 200;

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>

      {/* SIDEBAR */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          position: "fixed",
          left: 0,
          top: 55,
          bottom: 0,
          height: "100vh",
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
        className="sider"
      >
        <div
          style={{
            height: 32,
            margin: 16,
            marginBottom: 30,
            fontWeight: 600,
          }}
        >
          {collapsed ? (
            <Link to={"/admin"}>
              <img src={Logo} alt="logo" style={{ width: 36 }} />
            </Link>
          ) : (
            <Link to={"/admin"}>
              <img src={LogoMain} alt="logo" style={{ width: 150 }} />
            </Link>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
        />
        <div className="sider-bot">
          <div>
            <img className="avatar" src={admin.avatar ? admin.avatar : Avatar} />
            {collapsed ?  "" : <span>{admin.fullname}</span>}
           
          </div>
          {/* <button>Đăng xuất</button> */}
        </div>
      </Sider>

      {/* RIGHT SIDE */}
      <Layout
        style={{
          marginLeft: siderWidth,
          transition: "all 0.2s",
        }}
      >
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{
              fontSize: 16,
              width: 40,
              height: 40,
            }}
          />
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayoutAdmin;