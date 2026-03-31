import "./ChildHero.scss";
import heroImage from "../../../assets/banner/newproduct.png";
import { Link } from "react-router-dom";

function ChildHero() {
  return (
    <Link to="/products/new-product/laptop-gaming" className="hero-banner">
      
      <img src={heroImage} alt="new product" className="hero-banner__img" />
      <span className="hero-banner__badge">CHỈ CÓ TẠI VELTRIX</span>
      <h1 className="hero-banner__title">
        LAPTOP GAMING VELTRIX GEAR 1.0
      </h1>

    </Link>
  );
}

export default ChildHero;