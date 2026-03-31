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
                <Route path="/account" element={<AccountClient/>}/>
            </Route>
        </Routes>
    )
}

export default ClientRoutes