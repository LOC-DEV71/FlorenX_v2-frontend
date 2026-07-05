import { Route, Routes } from "react-router-dom";
import MainLayoutAdmin from "../layout/admin/mainlayoutAdmin";
import DashBoard from "../pages/Admin/DashBoard/index.dashboad";
import Products from "../pages/Admin/Products/index.products";
import CreateProduct from "../pages/Admin/Products/create.products";
import UpdateProduct from "../pages/Admin/Products/update.products";
import PrivateRoute from "../PrivateRoute/Admin/PrivateRoute.admin";
import Categories from "../pages/Admin/ProductCategory/index.productcategory";
import CreateCategory from "../pages/Admin/ProductCategory/create.category";
import UpdateCategory from "../pages/Admin/ProductCategory/update.category";
import AccountAdmin from "../pages/Admin/Accounts/index.account";
import CreateAccounts from "../pages/Admin/Accounts/create.account";
import CreateRole from "../pages/Admin/Role/create.role";
import Roles from "../pages/Admin/Role/index.role";
import UpdateRole from "../pages/Admin/Role/update.role";
import UpdateAccount from "../pages/Admin/Accounts/update.account";
import Permissions from "../pages/Admin/permission/Permission";
import PrivateRoutePermission from "../PrivateRoute/Admin/PrivareRoutesPermission";
import NewsAdmin from "../pages/Admin/News/index.news";
import NewsCategoryAdmin from "../pages/Admin/NewCategory/index.new.category";
import NewsCategoryCreate from "../pages/Admin/NewCategory/NewsCategoryCreate";
import NewsCreate from "../pages/Admin/News/NewsCreate";
import NewsEdit from "../pages/Admin/News/NewsEdit";
import CustomerSupportChat from "../pages/Admin/Chat/index.chat";
import UpdateNewsCategory from "../pages/Admin/NewCategory/updateNewsCategory";
import TrashPage from "../pages/Admin/TrashCan/TrashPage";
import SettingPage from "../pages/Admin/Setting/SettingPage";
import InventoryImportCreate from "../pages/Admin/Products/InventoryImportCreate";
import InventoryAudit from "../pages/Admin/Products/InventoryAudit";
import InventoryAuditList from "../pages/Admin/Products/InventoryAuditList";
import InventoryAuditDetail from "../pages/Admin/Products/InventoryAuditDetail";
import InventoryImportList from "../pages/Admin/Products/InventoryImport";
import InventoryExportCreate from "../pages/Admin/Products/InventoryExportCreate";
import InventoryExportList from "../pages/Admin/Products/InventoryExport";
import Orders from "../pages/Admin/Order/Order.index";
import Users from "../pages/Admin/Uses/Users.index";
import ProductsDetail from "../pages/Admin/Products/poductsDetail";
import SystemManagement from "../pages/Admin/ManagementSystem/index.system";
import Banned from "../pages/Admin/Auth/Banned";
import VouchersAdmin from "../pages/Admin/Vouchers/index.vouchers";
import VoucherCreate from "../pages/Admin/Vouchers/VoucherCreate";
import VoucherUpdate from "../pages/Admin/Vouchers/VoucherUpdate";
import OrderDetail from "../pages/admin/Order/OrderDetail";
import MemberTiers from "../pages/admin/MemberTiers/MemberTiers";

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
        <Route element={<PrivateRoutePermission permission="view_dashboard" />}>
          <Route index element={<DashBoard />} />
        </Route>

        {/* nhập kho */}
        <Route element={<PrivateRoutePermission permission="import_warehouse" />}>
          <Route path="products/inventory/import/create" element={<InventoryImportCreate />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="import_warehouse" />}>
          <Route path="products/inventory/import/list" element={<InventoryImportList />} />
        </Route>
         
         {/* xuất kho */}
        <Route element={<PrivateRoutePermission permission="export_warehouse" />}>
         <Route path="products/inventory/export/Create" element={<InventoryExportCreate />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="export_warehouse" />}>
         <Route path="products/inventory/export/list" element={<InventoryExportList />} />
        </Route>
        
         {/* <Route path="products/inventory/transfer" element={<UpdateProduct />} /> */}
         
         {/* kiểm kê kho */}
         <Route element={<PrivateRoutePermission permission="inventory_audit" />}>
          <Route path="products/inventory/audit/create" element={<InventoryAudit />} />
         </Route>
         <Route element={<PrivateRoutePermission permission="inventory_audit" />}>
          <Route path="products/inventory/audit/list" element={<InventoryAuditList />} />
         </Route>
         <Route element={<PrivateRoutePermission permission="inventory_audit" />}>
          <Route path="products/inventory/audit/detail/:code" element={<InventoryAuditDetail />} />
         </Route> 

        {/* products */}
        <Route element={<PrivateRoutePermission permission="view_products" />}>
          <Route path="products" element={<Products />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="view_products" />}>
          <Route path="products/detail/:slug" element={<ProductsDetail />} />
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
        <Route element={<PrivateRoutePermission permission="update_news" />}>
          <Route path="news/edit/:slug" element={<NewsEdit />} />
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


        {/* Order */}
        <Route element={<PrivateRoutePermission permission="view_orders"/>}>
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="view_orders"/>}>
          <Route path="orders/:code" element={<OrderDetail />} />
        </Route>


        {/* users */}
        <Route element={<PrivateRoutePermission permission="view_users"/>}>
          <Route path="users" element={<Users />} />
          <Route path="member-tiers" element={<MemberTiers />} />
        </Route>
        

        {/* cskh */}
        <Route path="chat" element={<CustomerSupportChat />} />


        {/* trash can */}
        <Route element={<PrivateRoutePermission permission="trash_management" />}>
          <Route path="trashcan" element={<TrashPage />} />
        </Route>

        {/* setting */}
        <Route element={<PrivateRoutePermission permission="setting_management" />}>
          <Route path="setting" element={<SettingPage />} />
        </Route>

        {/* system management */}
        <Route element={<PrivateRoutePermission permission="system_management" />}>
          <Route path="system-management" element={<SystemManagement />} />
        </Route>

        {/* vouchers */}
        <Route element={<PrivateRoutePermission permission="view_vouchers" />}>
          <Route path="vouchers" element={<VouchersAdmin />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="create_vouchers" />}>
          <Route path="vouchers/create" element={<VoucherCreate />} />
        </Route>
        <Route element={<PrivateRoutePermission permission="update_vouchers" />}>
          <Route path="vouchers/update/:id" element={<VoucherUpdate />} />
        </Route>
      </Route>

      {/* Banned page without PrivateRoute protection */}
      <Route path="banned" element={<Banned />} />
    </Routes>
  );
}

export default AdminRoutes;