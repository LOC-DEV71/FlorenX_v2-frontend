import { Link } from "react-router-dom";
import "./NotFound.scss";
import SEO from "../../../utils/SEO";

function NotFound() {
  return (
    <div className="not-found-page">
      <SEO title="404 - Không tìm thấy trang" />
      <div className="not-found-page__content">
        <h1 className="not-found-page__glitch" data-text="404">404</h1>
        <h2>SYSTEM ERROR: PAGE NOT FOUND</h2>
        <p>Lỗi kết nối. Không thể xác định tọa độ của trang bạn đang tìm kiếm. Vui lòng kiểm tra lại đường dẫn hoặc quay về căn cứ.</p>
        <Link to="/" className="not-found-page__btn">
          Trở về Trang Chủ
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
