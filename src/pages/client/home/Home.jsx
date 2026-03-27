import SEO from "../../../utils/SEO"
import HeroSection from "./HeroSection"
import NewsSection from "./NewsSection"
import ProductSection from "./ProductSection"
import SaleSection from "./SaleSection"

function Home(){
    
    return(
        <div>
            <SEO 
                title="Veltrix Gear - Trang chủ" 
                description="Veltrix Gear bán PC Gaming, Laptop, Linh kiện máy tính chất lượng cao."
            />
            <HeroSection/>
            <SaleSection/>
            <ProductSection/>
            <NewsSection/>
        </div>
    )
}
export default Home