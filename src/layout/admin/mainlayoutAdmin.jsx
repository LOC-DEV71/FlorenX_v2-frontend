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

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "1",
    icon: <MdDashboard />,
    label: <Link to="/admin">Dashboard</Link>,
  },
  {
    key: "2",
    icon: <AiFillProduct />,
    label: <Link to="/admin/products">Sản phẩm</Link>,
  },
  {
    key: "3",
    icon: <MdCategory />,
    label: <Link to="/admin/categories">Danh mục</Link>,
  },
  {
    key: "4",
    icon: <MdShoppingCart />,
    label: <Link to="/admin">Đơn hàng</Link>,
  },
  {
    key: "5",
    icon: <MdOutlineManageAccounts />,
    label: <Link to="/admin">TK Quản trị</Link>,
  },
  {
    key: "6",
    icon: <TfiControlEject />,
    label: <Link to="/admin">Nhóm quyền</Link>,
  },
  {
    key: "7",
    icon: <MdAccountTree />,
    label: <Link to="/admin">Phân quyền</Link>,
  },
  {
    key: "8",
    icon: <GrArticle />,
    label: <Link to="/admin">Bài viết</Link>,
  },
];

const MainLayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

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