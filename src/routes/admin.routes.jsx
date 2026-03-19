import { Route, Routes } from "react-router-dom";
import MainLayoutAdmin from "../layout/admin/mainlayoutAdmin";
import DashBoard from "../pages/admin/DashBoard/index.dashboad";
import Products from "../pages/admin/Products/index.products";
import CreateProduct from "../pages/admin/Products/create.products";
import UpdateProduct from "../pages/admin/Products/update.products";
import PrivateRoute from "../PrivateRoute/Admin/PrivateRoute.admin";
import Categories from "../pages/admin/ProductCategory/index.productcategory";
import CreateCategory from "../pages/admin/ProductCategory/create.category";
import UpdateCategory from "../pages/admin/ProductCategory/update.category";
import AccountAdmin from "../pages/admin/Accounts/index.account";
import CreateAccounts from "../pages/admin/Accounts/create.account";
import CreateRole from "../pages/admin/Role/create.role";
import Roles from "../pages/admin/Role/index.role";
import UpdateRole from "../pages/admin/Role/update.role";
import UpdateAccount from "../pages/admin/Accounts/update.account";
import Permissions from "../pages/admin/permission/Permission";
import PrivateRoutePermission from "../PrivateRoute/Admin/PrivareRoutesPermission";
import NewsAdmin from "../pages/admin/News/index.news";
import NewsCategoryAdmin from "../pages/admin/NewCategory/index.new.category";
import NewsCategoryCreate from "../pages/admin/NewCategory/NewsCategoryCreate";
import NewsCreate from "../pages/admin/News/NewsCreate";
import CustomerSupportChat from "../pages/admin/Chat/index.chat";
import UpdateNewsCategory from "../pages/admin/NewCategory/updateNewsCategory";

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
        <Route element={<PrivateRoutePermission permission="view_products" />}>
          <Route path="products" element={<Products />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="update_products" />}>
          <Route path="products/update/:slug" element={<UpdateProduct />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="create_products" />}>
          <Route path="products/create" element={<CreateProduct />} />
        </Route>



        {/* Categories */}
        <Route element={<PrivateRoutePermission permission="view_product_category" />}>
          <Route path="categories" element={<Categories />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="update_product_category" />}>
          <Route path="categories/update/:slug" element={<UpdateCategory />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="create_product_category" />}>
          <Route path="categories/create" element={<CreateCategory />} />
        </Route>



        {/* accounts */}
        <Route element={<PrivateRoutePermission permission="view_accounts" />}>
          <Route path="accounts" element={<AccountAdmin />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="create_accounts" />}>
          <Route path="accounts/create" element={<CreateAccounts />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="update_accounts" />}>
          <Route path="accounts/update/:id" element={<UpdateAccount />} />
        </Route>



        {/* roles */}
        <Route element={<PrivateRoutePermission permission="view_roles" />}>
          <Route path="roles" element={<Roles />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="create_roles" />}>
          <Route path="roles/create" element={<CreateRole />} />
        </Route>

        <Route element={<PrivateRoutePermission permission="update_roles" />}>
          <Route path="roles/update/:slug" element={<UpdateRole />} />
        </Route>

        

        {/* permission */}
        <Route element={<PrivateRoutePermission permission="view_permissions" />}>
          <Route path="permission" element={<Permissions />} />
        </Route>


        {/* news */}
        <Route element={<PrivateRoutePermission permission="view_news" />}>
          <Route path="news" element={<NewsAdmin />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="create_news" />}>
          <Route path="news/create" element={<NewsCreate />} />
        </Route>


        {/* new categories */}
        <Route element={<PrivateRoutePermission permission="view_news_category" />}>
          <Route path="new-categories" element={<NewsCategoryAdmin />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="create_news_category" />}>
          <Route path="new-categories/create" element={<NewsCategoryCreate />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="update_news_category" />}>
          <Route path="new-categories/update/:slug" element={<UpdateNewsCategory />} />
        </Route>


        {/* cskh */}
        <Route path="chat" element={<CustomerSupportChat />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;