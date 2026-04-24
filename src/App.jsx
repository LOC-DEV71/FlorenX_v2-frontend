import { Toaster } from "react-hot-toast";
import "./App.css";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


import { getMeAdmin } from "./services/admin/auth.admin.service";
import { login, logout, setLoading } from "./redux/authSlice";

import { loginClient, logoutClient, setLoadingClient } from "./redux/auth.client";
import { getMe } from "./services/client/Auth.service";

import settingService from "./services/admin/setting.service";
import { setSettings } from "./redux/settingSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAdminLogin = async () => {
      dispatch(setLoading(true));
      try {
        const res = await getMeAdmin();

        if (res.data.code) {
          dispatch(login({
            admin: res.data.admin,
            role: res.data.role
          }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAdminLogin();
  }, [dispatch]);

  useEffect(() => {
    const checkClientLogin = async () => {
      dispatch(setLoadingClient(true));
      try {
        const res = await getMe();

        if (res.data.code) {
          dispatch(loginClient({
            user: res.data.user,
            role: "client"
          }));
        } else {
          dispatch(logoutClient());
        }
      } catch (error) {
        dispatch(logoutClient());
      } finally {
        dispatch(setLoadingClient(false));
      }
    };

    checkClientLogin();
  }, [dispatch]);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await settingService.getDetail();
        dispatch(setSettings(res.data));
      } catch (err) {
        console.error("Load settings failed", err);
      }
    };

    fetchSetting();
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