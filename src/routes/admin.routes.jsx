import { Route, Routes } from "react-router-dom"
import MainLayoutAdmin from "../layout/admin/mainlayoutAdmin"
import DashBoard from "../pages/admin/DashBoard/index.dashboad"
import Products from "../pages/admin/Products/index.products"
import CreateProduct from "../pages/admin/Products/create.products"
import UpdateProduct from "../pages/admin/Products/update.products"

function AdminRoutes(){
    return(
        <Routes>
            <Route element={<MainLayoutAdmin/>}>
                <Route path="/" element={<DashBoard/>} />

                {/* Products */}
                <Route path="/products" element={<Products/>} />
                <Route path="/products/update/:slug" element={<UpdateProduct/>} />
                <Route path="/products/create" element={<CreateProduct/>} />
            </Route>
        </Routes>
    )
}

export default AdminRoutes