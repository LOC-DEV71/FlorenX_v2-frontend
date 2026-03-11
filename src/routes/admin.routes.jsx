import { Route, Routes } from "react-router-dom"
import MainLayoutAdmin from "../layout/admin/mainlayoutAdmin"
import DashBoard from "../pages/admin/DashBoard/index.dashboad"
import Products from "../pages/admin/Products/index.products"
import CreateProduct from "../pages/admin/Products/create.products"
import UpdateProduct from "../pages/admin/Products/update.products"
import PrivateRoute from "../PrivateRoute/Admin/PrivateRoute.admin"
import Categories from "../pages/admin/ProductCategory/index.productcategory"
import CreateCategory from "../pages/admin/ProductCategory/create.category"

function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <PrivateRoute>
            <MainLayoutAdmin />
          </PrivateRoute>
        }
      >
        <Route index element={<DashBoard />} />

        {/* products */}
        <Route path="products" element={<Products />} />
        <Route path="products/update/:slug" element={<UpdateProduct />} />
        <Route path="products/create" element={<CreateProduct />} />

        {/* Categories*/}
        <Route path="categories" element={<Categories/>}/>
        <Route path="categories/create" element={<CreateCategory/>}/>
      </Route>
    </Routes>
  );
}

export default AdminRoutes