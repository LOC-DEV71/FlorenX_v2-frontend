import { Route, Routes } from "react-router-dom"
import MainLayout from "../layout/client/mainLayout"
import Home from "../pages/client/home/Home";
import Products from "../pages/client/products/Products";

function ClientRoutes(){
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/products" element={<Products/>}/>
            </Route>
        </Routes>
    )
}

export default ClientRoutes