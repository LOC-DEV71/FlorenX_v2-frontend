import { Toaster } from "react-hot-toast";
import "./App.css";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMeAdmin } from "./services/admin/auth.admin.service";
import { login, logout, setLoading } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      dispatch(setLoading(true));
      try {
        const res = await getMeAdmin();

        if (res.data.code) {
          dispatch(login(res.data.admin));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkLogin();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
    </>
  );
}

export default App;