import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../services/client/Auth.service";
function LogoutClient({setOpenProfile}){
    const handleLogout = async () => {
        try {
            const res = await logout();
            if(res.data.code){
                setOpenProfile(false);
                window.location.href = "/";
            }   
        } catch (err) {
            console.error(err.response?.data.message)
        }
    };
    return(
        <button onClick={handleLogout}>
            <LogoutOutlined />
            <span>Đăng xuất</span>
        </button>
    )
}
export default LogoutClient