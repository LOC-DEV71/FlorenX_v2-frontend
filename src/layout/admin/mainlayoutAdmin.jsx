import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
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
import { FaRegTrashCan, FaServer } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import "./MainLayoutAdmin.scss";
import Avatar from "../../assets/banner/avatar-none.jpg";
import { useSocket } from "../../Socket/useSocket";
import { useEffect } from "react";
import { success } from "../../utils/notift";
import { CiUser } from "react-icons/ci";
import { Badge, Popover, List, Typography } from "antd";
import { BsBellFill } from "react-icons/bs";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { getList, ReadAllNotification, readNotification } from "../../services/admin/notifications.service";
import AdminChatbot from "../../components/admin/AdminChatbot/AdminChatbot";

const { Header, Sider, Content } = Layout;



const MainLayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const role = useSelector(state => state.auth.role)
  const permission = role?.permissions;
  const exitDashboard = permission?.includes("view_dashboard");
  const exitProduct = permission?.includes("view_products");
  const exitAccount = permission?.includes("view_accounts");
  const exitProductCategory = permission?.includes("view_product_category");
  const exitOders = permission?.includes("view_orders");
  const exitRoles = permission?.includes("view_roles");
  const exitPermissions = permission?.includes("view_permissions");
  const exitNews = permission?.includes("view_news");
  const exitNewsCategory = permission?.includes("view_news_category");
  const exitUsers = permission?.includes("view_users");
  const exitTrash = permission?.includes("trash_management");
  const exitSetting = permission?.includes("setting_management");
  const exitSystem = permission?.includes("system_management");
  const { admin } = useSelector((state) => state.auth);
  const menuItems = [
    ...(exitDashboard
      ? [
          {
            key: "1",
            icon: <MdDashboard />,
            label: <Link to="/admin">Dashboard</Link>,
          }
        ]
      : []
    ),
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
    ...(exitUsers
      ? [
        {
          key: "8",
          icon: <CiUser />,
          label: <Link to="/admin/users">Người dùng</Link>,
        }
      ] : []
    ),
    ...(exitNewsCategory
      ? [

        {
          key: "9",
          icon: <TbCategory />,
          label: <Link to="/admin/new-categories">Danh mục bài viết</Link>,
        }
      ] : []
    ),
    ...(exitNews
      ? [{
        key: "10",
        icon: <GrArticle />,
        label: <Link to="/admin/news">Bài viết</Link>,
      }] : []
    )
    ,
    {
      key: "11",
      icon: <IoMdChatboxes />,
      label: <Link to="/admin/chat">CSKH</Link>,
    },
    ...(exitTrash
      ? [
          {
            key: "12",
            icon: <FaRegTrashCan />,
            label: <Link to="/admin/trashcan">Thùng rác</Link>,
          }
        ]
      : []
    ),
    ...(exitSetting
      ? [
          {
            key: "13",
            icon: <IoSettings />,
            label: <Link to="/admin/setting">Cài đặt</Link>,
          }
        ]
      : []
    ),
    ...(exitSystem
      ? [
          {
            key: "14",
            icon: <FaServer />,
            label: <Link to="/admin/system-management">Hệ thống</Link>,
          }
        ]
      : []
    )
  ];
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const siderWidth = collapsed ? 80 : 200;
  const socket = useSocket();
  const location = useLocation();

  useEffect(() => {
    if (socket && socket.connected) {
      socket.emit("admin_change_page", { page: location.pathname });
    }
  }, [location.pathname, socket]);

  useEffect(() => {
    if (admin && socket) {
      const emitPresence = () => {
        socket.emit("admin_online", {
          id: admin._id || admin.id || "unknown_" + Math.random(),
          fullname: admin.fullname,
          role: role?.title || "Quản trị viên",
          current_page: window.location.pathname
        });
      };

      // Phát sự kiện ngay lần đầu (nếu socket đã kết nối)
      if (socket.connected) {
        emitPresence();
      } else {
        // Hoặc chờ socket kết nối xong ở lần đầu
        socket.on("connect", emitPresence);
      }

      // Xử lý trường hợp backend bị restart, socket tự động reconnect lại
      // thì phải phát lại tín hiệu để cập nhật danh sách
      socket.on("reconnect", emitPresence);
      
      // Dự phòng cho phiên bản socket io mới có thể gọi connect lại
      socket.on("connect", emitPresence);

      // Xử lý trường hợp bị hệ thống AI (Bảo vệ) cấm
      const handleForceLogout = (data) => {
        console.log("BỊ HỆ THỐNG KICK:", data, "Current Admin:", admin);
        if (String(data.accountId) === String(admin?._id) || String(data.accountId) === String(admin?.id)) {
          // Xóa token cookies triệt để
          import('js-cookie').then((Cookies) => {
             Cookies.default.remove('token_admin', { path: '/' });
             // Chuyển hướng cứng (bỏ qua React Router bảo vệ)
             window.location.href = '/admin/banned';
          });
        }
      };
      socket.on("admin_force_logout", handleForceLogout);

      return () => {
        socket.off("connect", emitPresence);
        socket.off("reconnect", emitPresence);
        socket.off("admin_force_logout", handleForceLogout);
      };
    }
  }, [admin, role, socket]);

  const [notifications, setNotifications] = useState([]);
  const [openNoti, setOpenNoti] = useState(false);


  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getList();
        if(res?.data?.code){
          setNotifications(res?.data?.notifications)
        }
      } catch (error) {
        console.log(error.response?.data?.message)
      }
    }
    fetchApi();
  }, [])


  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    const oldNotifications = notifications;

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );

    try {
      const res = await ReadAllNotification();

      if (!res?.data?.code) {
        setNotifications(oldNotifications);
      }
    } catch (error) {
      setNotifications(oldNotifications);
      console.log(error.response?.data?.message);
    }
  };

  const handleRead = async (id) => {
    try {
      const res = await readNotification(id);

      if (res?.data?.code) {
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, is_read: true } : item
          )
        );
      }
    } catch (err) {
      console.log(
        err.response?.data?.message || "Hệ thống xảy ra lỗi"
      );
    }
  };


  const notificationContent = (
    <div className="noti-dropdown">
      <div className="noti-header">
        <span>Thông báo</span>
        <button onClick={markAllRead}>Đọc tất cả</button>
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <Link to={item.action_url}
            className={`noti-item ${!item.is_read ? "unread" : ""}`}
            onClick={() => {
              handleRead(item._id) 
              setOpenNoti(false)
            }}
          >
            <List.Item >
              <div className="noti-text">
                <h4>{item.title}</h4>
                <Typography.Text className="message">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.message || "",
                    }}
                  />
                </Typography.Text>
                <Typography.Text type="secondary" className="noti-time">
                  {formatTimeAgo(item.createdAt)}
                </Typography.Text>
              </div>
              {!item.is_read && <span className="noti-dot" />}
            </List.Item>
          </Link>
        )}
      />
    </div>
  );

  useEffect(() => {
    socket.on("server_return_order", (data) => {
      const notification = data?.notification;
      success(notification.title || "Bạn có đơn hàng mới");
      setNotifications((prev) => [
        notification, ...prev
      ]);
    });
    return () => socket.off("server_return_order")
  }, [])

  useEffect(() => {
    socket.on("server_return_product_preview", (data) => {
      success(
        <Link to={`/admin/products/${data?.data?.slug}`} style={{textDecoration: "none"}}>Có đánh giá sản phẩm</Link>
      );
      setNotifications((prev) => [
        data?.notification, ...prev
      ]);
    });
    return () => socket.off("server_return_product_preview")
  }, [])

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
            {collapsed ? "" : <span>{admin.fullname}</span>}

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
          className="header-admin"
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
          <Popover
            content={notificationContent}
            trigger="click"
            open={openNoti}
            onOpenChange={setOpenNoti}
            placement="bottomRight"
            arrow={false}
          >
            <div className={`notification ${unreadCount > 0 ? "has-noti" : ""}`}>
              <Badge count={unreadCount} size="small">
                <BsBellFill />
              </Badge>
            </div>
          </Popover>
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
      <AdminChatbot />
    </Layout>
  );
};

export default MainLayoutAdmin;