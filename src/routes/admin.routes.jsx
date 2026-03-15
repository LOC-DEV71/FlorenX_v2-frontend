import { Route, Routes } from "react-router-dom"
import MainLayoutAdmin from "../layout/admin/mainlayoutAdmin"
import DashBoard from "../pages/admin/DashBoard/index.dashboad"
import Products from "../pages/admin/Products/index.products"
import CreateProduct from "../pages/admin/Products/create.products"
import UpdateProduct from "../pages/admin/Products/update.products"
import PrivateRoute from "../PrivateRoute/Admin/PrivateRoute.admin"
import Categories from "../pages/admin/ProductCategory/index.productcategory"
import CreateCategory from "../pages/admin/ProductCategory/create.category"
import UpdateCategory from "../pages/admin/ProductCategory/update.category"
import AccountAdmin from "../pages/admin/Accounts/index.account"
import CreateAccounts from "../pages/admin/Accounts/create.account"
import CreateRole from "../pages/admin/Role/create.role"
import Roles from "../pages/admin/Role/index.role"
import UpdateRole from "../pages/admin/Role/update.role"
import UpdateAccount from "../pages/admin/Accounts/update.account"

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
        <Route path="categories/update/:slug" element={<UpdateCategory/>}/>
        <Route path="categories/create" element={<CreateCategory/>}/>


        {/* accounts */}
        <Route path="accounts" element={<AccountAdmin/>}/>
        <Route path="accounts/create" element={<CreateAccounts/>}/>
        <Route path="accounts/update/:id" element={<UpdateAccount/>}/>


        {/* roles */}
        <Route path="roles" element={<Roles/>}/>
        <Route path="roles/create" element={<CreateRole/>}/>
        <Route path="roles/update/:slug" element={<UpdateRole/>}/>
      </Route>
    </Routes>
  );
}

export default AdminRoutes