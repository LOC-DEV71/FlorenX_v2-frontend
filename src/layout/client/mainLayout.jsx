import { Outlet } from "react-router-dom";
import Header from "../../components/client/Header/header";
import Footer from "../../components/client/Footer/footer";

function MainLayout(){
    return(
        <>
            <Header/>
                <main>
                    <Outlet/>
                </main>
            <Footer/>
        </>
    )
}

export default MainLayout;