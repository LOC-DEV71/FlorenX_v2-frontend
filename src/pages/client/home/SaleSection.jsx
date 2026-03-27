import { useSelector } from "react-redux";
import Countdown from "react-countdown";
import "./SaleSection.scss";
import { Link } from "react-router-dom";

function SaleSection() {
  const settings = useSelector((state) => state.setting);
  const sale = settings?.settings?.saleBanner;

  if (!sale?.isActive) return null;
  if (!sale?.startDate || !sale?.endDate) return null;

  const startTime = new Date(sale.startDate).getTime();
  const endTime = new Date(sale.endDate).getTime();
  const now = Date.now();

  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return null;
  if (now < startTime || now > endTime) return null;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) return null;

    return (
      <div className="sale-time">
        <span>{String(days).padStart(2, "0")}</span>
        <span>{String(hours).padStart(2, "0")}</span>
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    );
  };

  return (
    <section className="sale-wrapper" id="sale">
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

        <div className="sale-content-container">
          <div className="sale-content-inner">
            <div className="sale-content">
              <p className="sale-tag">SALE EVENT</p>

              <h2 className="sale-title">{sale.title}</h2>

              <p className="sale-desc">{sale.shortDescription}</p>

              <div className="sale-actions">
                {sale.discountText && (
                  <div className="sale-discount">{sale.discountText}</div>
                )}

                {sale.redirectLink && (
                  <Link
                    href={sale.redirectLink}
                    className="sale-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Đến xem
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sale-countdown">
          <Countdown date={endTime} renderer={renderer} />
        </div>
      </div>
    </section>
  );
}

export default SaleSection;