import "./ChildHero.scss";
import heroImage from "../../../assets/banner/newproduct.png";
import { HashLink } from "react-router-hash-link";

function ChildHero() {
  return (
    <HashLink smooth to="/products/new-product/laptop-gaming/#hero-video" className="hero-banner">
      
      <img src={heroImage} alt="new product" className="hero-banner__img" />
      <span className="hero-banner__badge">CHỈ CÓ TẠI VELTRIX</span>
      <h1 className="hero-banner__title">
        LAPTOP GAMING VELTRIX GEAR 1.0
      </h1>

    </HashLink>
  );
}

export default ChildHero;