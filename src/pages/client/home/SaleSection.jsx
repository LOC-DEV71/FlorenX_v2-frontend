import { useSelector } from "react-redux";
import "./SaleSection.scss";

function SaleSection() {
    const settings = useSelector((state) => state.setting);
    const sale = settings?.settings?.saleBanner;
    if (!sale?.isActive) return null;

    return (
        <div className="sale-wrapper">
            <div className="sale-banner">
                {sale.desktopImage && (
                    <img
                        src={sale.desktopImage}
                        alt="sale banner"
                        className="sale-bg desktop"
                    />
                )}

                {sale.mobileImage && (
                    <img
                        src={sale.mobileImage}
                        alt="sale banner mobile"
                        className="sale-bg mobile"
                    />
                )}

                <div className="sale-overlay" />

                <div className="sale-content">
                    <p className="sale-tag">SALE EVENT</p>

                    <h2 className="sale-title">{sale.title}</h2>

                    <p className="sale-desc">{sale.shortDescription}</p>

                    <div className="sale-actions">
                        {sale.discountText && (
                            <div className="sale-discount">{sale.discountText}</div>
                        )}

                        <a
                            href={sale.redirectLink}
                            className="sale-btn"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Mua ngay
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SaleSection;