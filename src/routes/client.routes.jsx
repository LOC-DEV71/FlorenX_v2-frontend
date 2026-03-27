import { Route, Routes } from "react-router-dom"
import MainLayout from "../layout/client/mainLayout"
import Home from "../pages/client/home/Home";
import Products from "../pages/client/products/Products";
import ProductByCategory from "../pages/client/products/ProductByCategory";

function ClientRoutes(){
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/products/:category" element={<ProductByCategory/>}/>
            </Route>
        </Routes>
    )
}

export default ClientRoutes