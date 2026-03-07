import { Route, Routes } from "react-router-dom"
import AdminRoutes from "./admin.routes"
import ClientRoutes from "./client.routes"

function AppRoutes() {
    return(
        <Routes>
            <Route path="/admin/*" element={<AdminRoutes/>}/>
            <Route path="/*" element={<ClientRoutes/>}/>
        </Routes>
    )
}

export default AppRoutes