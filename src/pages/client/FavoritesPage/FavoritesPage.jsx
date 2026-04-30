import { Link } from "react-router-dom";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import "./FavoritesPage.scss";
import { useEffect, useState } from "react";
import {
  addLike,
  getListLike,
  getListLikeProducts
} from "../../../services/client/like.service";
import NoData from "../../../assets/banner/empty.png";
import { success } from "../../../utils/notift";
import Loading from "../../../utils/loading";
import SEO from "../../../utils/SEO";

function FavoritePage() {
  const [data, setData] = useState([]);
  const [likeIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavoriteProducts = async () => {
    try {
      const res = await getListLikeProducts();
      if (res?.data?.code) {
        setData(res.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching liked products:", error);
    }
  };

  const fetchLikeIds = async () => {
    setLoading(true);
    try {
      const res = await getListLike();
      if (res?.data?.code) {
        setLikedIds(res.data.likes || []);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteProducts();
    fetchLikeIds();
  }, []);

  const handleLike = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (likeIds.includes(productId)) {
        const res = await addLike({ productId, type: "clear" });
        if (res?.data?.code) {
          success(res.data.message);
        }
      } else {
        const res = await addLike({ productId, type: "add" });
        if (res?.data?.code) {
          success(res.data.message);
        }
      }

      // fetch lại sau khi add/remove xong
      await fetchLikeIds();
      await fetchFavoriteProducts();
    } catch (err) {
      console.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="favorite-page">
      {loading && (
        <Loading />
      )}
      <SEO title={"Sản phẩm yêu thích"}/>

      <div className="container">
        <div className="favorite-page__header">
          <div>
            <span className="favorite-page__label" id="favorite-page__label">Wishlist</span>
            <h1>Sản phẩm yêu thích</h1>
            <p>Lưu lại những món đồ công nghệ bạn muốn sở hữu.</p>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="no-product">
            <div className="img">
              <img src={NoData} alt="No data" />
              <span>Chưa có sản phẩm yêu thích</span>
            </div>
          </div>
        ) : (
          <div className="product-grid">
            {data.map((item, index) => {
              const originalPrice = Number(item?.price) || 0;
              const discountPercentage = Number(item?.discountPercentage) || 0;
              const finalPrice =
                discountPercentage > 0
                  ? originalPrice - (originalPrice * discountPercentage) / 100
                  : originalPrice;

              return (
                <Link
                  to={`/products/detail/${item.slug || item._id}`}
                  className="product-card"
                  key={item._id || index}
                >
                  <div className="product-card__thumb">
                    {discountPercentage > 0 && (
                      <span className="badge-sale">-{discountPercentage}%</span>
                    )}

                    {item.featured && (
                      <span className="featured-badge">Nổi bật</span>
                    )}

                    <img
                      src={
                        item?.thumbnail ||
                        "https://via.placeholder.com/400x500?text=Product"
                      }
                      alt={item?.title || "Product image"}
                    />
                  </div>

                  <div className="product-card__info">
                    <h3 className="product-card__title">
                      {item?.title || "Product name"}
                    </h3>

                    <div className="product-card__price">
                      <>
                        <span className={`price-old ${discountPercentage > 0 ? "" : "visibility"}`}>
                          {originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="price-new">
                          {finalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </>

                    </div>

                    <div className="product-card__meta">
                      <div className="left">
                        <span className="rating">★ 4.8</span>
                        <span className="reviews">(120 reviews)</span>
                      </div>

                      <div
                        className="favorite"
                        onClick={(e) => handleLike(e, item._id)}
                      >
                        {likeIds.includes(item?._id) ? (
                          <HeartFilled style={{ color: "red" }} />
                        ) : (
                          <HeartOutlined />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritePage;