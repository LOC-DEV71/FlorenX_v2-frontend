import { useEffect, useMemo, useState } from "react";
import { getCart } from "../../../services/client/cart.service";
import "./cart.scss";
import { Link } from "react-router-dom";
import { getProductByCategory } from "../../../services/client/product.service";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";


function Cart() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [liked, setLiked] = useState(false);


  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await getCart();
        if (res?.data?.code) {
          setData(res.data.products || []);
        }
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "đ";
  };

  const getDiscountedPrice = (price, discountPercentage = 0) => {
    const originalPrice = Number(price) || 0;
    const discount = Number(discountPercentage) || 0;
    return originalPrice - (originalPrice * discount) / 100;
  };

  const subtotal = useMemo(() => {
    return data.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const discountedPrice = getDiscountedPrice(
        item.price,
        item.discountPercentage
      );
      return total + discountedPrice * quantity;
    }, 0);
  }, [data]);

  const [product, setProduct] = useState([]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getProductByCategory({ category: "pc", limit: 4, page: 1 });
        if (res?.data?.code) {
          setProduct(res.data.products || []);
        }
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      }
    };

    fetchCart();
  }, [])


  return (
    <div className="cart-page" id="cart-page">
      {loading && (
        <div className="loading-cart">
          <span className="spinner"></span>
        </div>
      )}
      <div className="cart-page__inner">
        {loading ? (
          <div className="cart-page__state">Đang tải giỏ hàng...</div>
        ) : data.length === 0 ? (
          <div className="cart-page__state">
            <h3>Giỏ hàng của bạn trống</h3>
            <p>Đừng lo lắng, hãy xem các sản phẩm mới nhất của chúng tôi và bắt đầu mua sắm.</p>
            <Link to={"/store"}>Mua hàng Veltrix Gaear</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-left">
              {data.map((item, index) => {
                const thumbnail = item.thumbnail;
                const title = item.title;
                const quantity = Number(item.quantity) || 1;
                const price = Number(item.price) || 0;
                const discountPercentage = Number(item.discountPercentage) || 0;
                const slug = item.slug;
                const discountedPrice = getDiscountedPrice(
                  price,
                  discountPercentage
                );
                const totalItemPrice = discountedPrice * quantity;

                return (
                  <div className="cart-product" key={item._id || index}>
                    <div className="cart-product__main">
                      <div className="cart-product__image">
                        <img src={thumbnail} alt={title} />
                      </div>

                      <div className="cart-product__info">
                        <h3>{title}</h3>
                        <Link className="cart-product__details" to={`/products/detail/${slug}`}>
                          Xem chi tiết
                        </Link>

                        {discountPercentage > 0 && (
                          <div className="cart-product__discount">
                            Giá gốc: <del>{formatPrice(price)}</del>
                            <span> -{discountPercentage}%</span>
                          </div>
                        )}
                      </div>

                      <div className="cart-product__qty">
                        <button>-</button>
                        <span>{quantity}</span>
                        <button>+</button>
                      </div>

                      <div className="cart-product__price">
                        {discountPercentage > 0 && (
                          <div className="cart-product__price-old">
                            {formatPrice(price * quantity)}
                          </div>
                        )}
                        <div className="cart-product__price-new">
                          {formatPrice(totalItemPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="cart-left__promo">
                <button>Bạn có mã giảm giá?</button>
                <p>
                  Thuế sẽ được tính sau khi bạn nhập địa chỉ thanh toán/giao
                  hàng.
                </p>
              </div>


            </div>

            <div className="cart-right">
              <div className="cart-summary">
                <div className="cart-summary__row">
                  <span>Tạm tính</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <div className="cart-summary__subtext">
                  Chưa bao gồm thuế
                </div>

                <div className="cart-summary__row">
                  <span>Vận chuyển</span>
                  <span className="muted">Tính sau khi nhập địa chỉ</span>
                </div>

                <div className="cart-summary__line"></div>

                <div className="cart-summary__row cart-summary__row--total">
                  <span>Tổng cộng</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <button className="cart-summary__checkout">
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="section-product-cart">
        <h3 className="line-product-cart">SẢN PHẨM NỔI BẬT</h3>
        <div className="product-grid">
          {product.map((item, index) => {
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
                    <span className="badge-sale">
                      -{discountPercentage}%
                    </span>
                  )}
                  {item.featured && (
                    <span className="featured-badge">Nổi bật</span>
                  )}

                  <img
                    src={
                      item?.thumbnail ||
                      item?.image ||
                      "https://via.placeholder.com/400x500?text=Product"
                    }
                    alt={item?.title || item?.name || "Product image"}
                  />
                </div>

                <div className="product-card__info">
                  <h3 className="product-card__title">
                    {item?.title || item?.name || "Product name"}
                  </h3>

                  <div className="product-card__price">
                    {discountPercentage > 0 ? (
                      <>
                        <span className="price-old">
                          {originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="price-new">
                          {finalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </>
                    ) : (
                      <span className="price-new">
                        {originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>

                  <div className="product-card__meta">
                    <div className="left">
                      <span className="rating">★ 4.8</span>
                      <span className="reviews">(120 reviews)</span>
                    </div>

                    <div className="favorite">
                      <div className="favorite" onClick={(e) => {
                        e.preventDefault();
                        setLiked(!liked);
                      }}>
                        {liked ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Cart;