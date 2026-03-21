import SEO from "../../../utils/SEO"
import HeroSection from "./HeroSection"
import SaleSection from "./SaleSection"

function Home(){
    
    return(
        <>
            <SEO 
                title="Veltrix Gear - Trang chủ" 
                description="Veltrix Gear bán PC Gaming, Laptop, Linh kiện máy tính chất lượng cao."
            />
            <HeroSection/>
            <SaleSection/>
        </>
    )
}
export default Home