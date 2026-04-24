import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {error} from "../../utils/notift";
function PrivateRoutePermission({ permission }) {
  const { isLogin, loading, role } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  if (!isLogin) {
    return <Navigate to="/admin/login" replace />;
  }

  const permissions = role?.permissions || [];

  const hasPermission = permissions.includes(permission);

  if (!hasPermission) {
    error("Bạn không có quyền truy cập!");
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export default PrivateRoutePermission;