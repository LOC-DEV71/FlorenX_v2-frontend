import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const { isLogin, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Loading...</div>;

  return isLogin ? children : <Navigate to="/admin/login" replace />;
}

export default PrivateRoute;