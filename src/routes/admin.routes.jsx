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
import NewsEdit from "../pages/admin/News/NewsEdit";
import CustomerSupportChat from "../pages/admin/Chat/index.chat";
import UpdateNewsCategory from "../pages/admin/NewCategory/updateNewsCategory";
import TrashPage from "../pages/admin/TrashCan/TrashPage";
import SettingPage from "../pages/admin/Setting/SettingPage";
import InventoryImportCreate from "../pages/admin/Products/InventoryImportCreate";
import InventoryAudit from "../pages/admin/Products/InventoryAudit";
import InventoryAuditList from "../pages/admin/Products/InventoryAuditList";
import InventoryAuditDetail from "../pages/admin/Products/InventoryAuditDetail";
import InventoryImportList from "../pages/admin/Products/InventoryImport";
import InventoryExportCreate from "../pages/admin/Products/InventoryExportCreate";
import InventoryExportList from "../pages/admin/Products/InventoryExport";
import Orders from "../pages/admin/Order/Order.index";
import Users from "../pages/admin/Uses/Users.index";
import ProductsDetail from "../pages/admin/Products/poductsDetail";
import SystemManagement from "../pages/admin/ManagementSystem/index.system";
import Banned from "../pages/admin/Auth/Banned";
import VouchersAdmin from "../pages/admin/Vouchers/index.vouchers";
import VoucherCreate from "../pages/admin/Vouchers/VoucherCreate";
import VoucherUpdate from "../pages/admin/Vouchers/VoucherUpdate";
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
