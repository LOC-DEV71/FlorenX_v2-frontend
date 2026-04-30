import { Route, Routes } from "react-router-dom"
import MainLayout from "../layout/client/mainLayout"
import Home from "../pages/client/home/Home";
import Products from "../pages/client/products/Products";
import ProductByCategory from "../pages/client/products/ProductByCategory";
import ProductDeatil from "../pages/client/products/ProductDetail";
import LoginClient from "../pages/client/authClient/login.client";
import RegisterClient from "../pages/client/authClient/register.client";
import NewProduct from "../pages/client/products/NewProduct";
import AccountClient from "../pages/client/account/Account";
import Cart from "../pages/client/cart/cart";
import FavoritesPage from "../pages/client/FavoritesPage/FavoritesPage";
import SalePage from "../pages/client/sale/sale";
import Otp from "../pages/client/authClient/otp.client";
import ForgotPassword from "../pages/client/authClient/Forgot-password";
import ForgotOtp from "../pages/client/authClient/ForgotOtp";
import ResetPassword from "../pages/client/authClient/reset-password";
import Checkout from "../pages/client/cart/checkout";
import OrderSuccess from "../pages/client/cart/OrderSuccess";
import OrderList from "../pages/client/Order/OrderList";

function ClientRoutes(){
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>

                
                <Route path="/products" element={<Products/>}/>
                <Route path="/products/:category" element={<ProductByCategory/>}/>
                <Route path="/products/detail/:slug" element={<ProductDeatil/>}/>
                <Route path="/products/new-product/laptop-gaming" element={<NewProduct/>}/>


                <Route path="/login" element={<LoginClient/>}/>
                <Route path="/register" element={<RegisterClient/>}/>
                <Route path="/otp" element={<Otp/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/forgot-otp" element={<ForgotOtp/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/account" element={<AccountClient/>}/>



                <Route path="/gio-hang" element={<Cart/>}/>
                <Route path="check-out" element={<Checkout/>}/>
                <Route path="/yeu-thich" element={<FavoritesPage/>}/>
                <Route path="/don-hang" element={<OrderList/>}/>
                <Route path="/sale" element={<SalePage/>}/>


                <Route path="/order-success/:orderCode" element={<OrderSuccess/>}/>
            </Route>
        </Routes>
    )
}

export default ClientRoutes