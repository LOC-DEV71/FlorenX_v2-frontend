import React, { useEffect, useMemo, useState } from "react";
import "./ProductDeatil.scss";
import { getProductBySlug } from "../../../services/client/product.service";
import { Link, useParams } from "react-router-dom";
import SEO from "../../../utils/SEO";
import { error, success } from "../../../utils/notift";
import { addToCart } from "../../../services/client/cart.service";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addLike, getListLike } from "../../../services/client/like.service";
import Loading from "../../../utils/loading";
import NoData from "../../../assets/banner/empty.png";

function ProductDeatil() {
  const { slug } = useParams();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [products, setProducts] = useState([]);
  const [overview, setOverview] = useState(true);
  const [likeIds, setLikedIds] = useState([]);
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setData({});
      setThumbnail("");

      try {
        const res = await getProductBySlug(slug);
        const product = res?.data?.product;
        const products = res?.data?.products;

        if (!isMounted) return;

        if (res?.data?.code && product && products) {
          setData(product);
          setProducts(products);
          setThumbnail(product?.thumbnail || product?.images?.[0] || "");
        }
      } catch (err) {
        console.error(err?.response?.data?.message || err.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);


  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await getListLike();
        if (res?.data?.code) {
          setLikedIds(res.data.likes)
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [likeIds]);


  const handleAddtoCart = async () => {
    setLoading(true)
    try {
      const res = await addToCart({ productId: data?._id });
      if (res.data.code) {
        success(res.data.message);
      }
    } catch (err) {
      error("Thêm giỏ hàng không thành công");
      console.error(err.response?.data.message);
    } finally {
      setLoading(false)
    }
  }

  const handleByNow = async () => {
    setLoading(true)
    try {
      const res = await addToCart({ productId: data?._id });
      if (res.data.code) {
        window.location.href = "/gio-hang#cart-page";
      }
    } catch (err) {
      error("Thêm giỏ hàng không thành công");
      console.error(err.response?.data.message);
    } finally {
      setLoading(false)
    }
  }

  const finalPrice = useMemo(() => {
    const price = Number(data?.price) || 0;
    const discountPercentage = Number(data?.discountPercentage) || 0;
    return price - (discountPercentage * price) / 100;
  }, [data?.price, data?.discountPercentage]);

  const productImages = useMemo(() => {
    if (Array.isArray(data?.images) && data.images.length > 0) {
      return data.images;
    }

    if (data?.thumbnail) {
      return [data.thumbnail];
    }

    return [];
  }, [data?.images, data?.thumbnail]);

  const specsEntries = useMemo(() => {
    return Object.entries(data?.specs || {});
  }, [data?.specs]);

  const handleLike = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds(prev => [...prev, productId])

    try {
      if (likeIds.includes(productId)) {
        const res = await addLike({ productId: productId, type: "clear" });
        if (res.data.code) {
          success(res.data.message)

        }
      } else {
        const res = await addLike({ productId: productId, type: "add" });
        if (res.data.code) {
          success(res.data.message)
        }
      }
    } catch (err) {
      console.error(err.response?.data.message)
    }

  };


  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="product-page">
      <SEO
        title={data?.title}
        description="Veltrix Gear bán PC Gaming, Laptop, Linh kiện máy tính chất lượng cao."
      />
      <main className="container">
        <section className="hero">
          <div className="hero__left">
            <div className="main-image">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={data?.title || "product"}
                />
              )}
            </div>

            <div className="thumbs">
              {data?.thumbnail && (
                <button
                  type="button"
                  className={thumbnail === data.thumbnail ? "thumb active" : "thumb"}
                  onClick={() => setThumbnail(data.thumbnail)}
                >
                  <img
                    src={data.thumbnail}
                    alt="thumbnail"
                  />
                </button>
              )}

              {productImages.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  className={thumbnail === item ? "thumb active" : "thumb"}
                  onClick={() => setThumbnail(item)}
                  aria-label={`Ảnh sản phẩm ${index + 1}`}
                >
                  <img
                    src={item}
                    alt={`Ảnh phụ ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="hero__right">
            <span className="tag">NỔI BẬT</span>

            <h1>{data?.title || "Tên sản phẩm"}</h1>

            <div className="rating">
              <span className="stars">★★★★★</span>
              <span>(2 đánh giá)</span>
            </div>

            <div className="price-row">
              <div className="price">{finalPrice.toLocaleString("vi-VN")}đ</div>
              <div className="old-price">
                {(Number(data?.price) || 0).toLocaleString("vi-VN")}đ
              </div>
              {data?.discountPercentage ? (
                <span className="discount">-{data.discountPercentage}%</span>
              ) : null}
            </div>

            <p className="desc">
              Cấu hình PC gaming mạnh mẽ, phù hợp chơi game phổ thông đến AAA,
              livestream, làm việc đồ họa và sử dụng hằng ngày với hiệu năng ổn định.
            </p>

            <div className="cta">
              <button type="button" className="btn btn--primary" onClick={handleByNow}>
                Mua ngay
              </button>
              <button type="button" className="btn btn--dark" onClick={handleAddtoCart}>
                Thêm vào giỏ
              </button>
            </div>

            <ul className="policy-list">
              <li>Giao hàng miễn phí nội thành</li>
              <li>Bảo hành chính hãng</li>
              <li>Hỗ trợ kỹ thuật tận tâm</li>
            </ul>
          </div>
        </section>

        <section className="tabs">
          <button type="button" className={`tab ${overview === true && "active"}`} onClick={() => setOverview(true)}>
            Mô tả
          </button>
          <button type="button" className={`tab ${overview === false && "active"}`} onClick={() => setOverview(false)}>
            Đánh giá
          </button>
        </section>

        {overview ?
          (
            <section className="overview">
              <div className="overview__text">
                <h2>Mô tả sản phẩm</h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.description || "",
                  }}
                />
              </div>

              <div className="overview__specs">
                <h3>Điểm nổi bật</h3>

                {specsEntries.length > 0 ? (
                  specsEntries.map(([key, value]) => (
                    <div className="spec-row" key={key}>
                      <span>{key}</span>
                      <strong>{String(value)}</strong>
                    </div>
                  ))
                ) : (
                  <div className="spec-empty">Chưa có thông số kỹ thuật</div>
                )}
              </div>
            </section>
          ) : (
            <section className="review-section">
              <div className="review-hero">
                <div className="review-score">
                  <div className="review-score__value">4.8</div>
                  <div className="review-score__stars">★★★★★</div>
                  <p>Dựa trên 128 đánh giá khách hàng</p>
                </div>

                <div className="review-bars">
                  <div className="review-bar">
                    <span>5 sao</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "82%" }}></div>
                    </div>
                    <strong>82%</strong>
                  </div>

                  <div className="review-bar">
                    <span>4 sao</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "12%" }}></div>
                    </div>
                    <strong>12%</strong>
                  </div>

                  <div className="review-bar">
                    <span>3 sao</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "4%" }}></div>
                    </div>
                    <strong>4%</strong>
                  </div>

                  <div className="review-bar">
                    <span>2 sao</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "1%" }}></div>
                    </div>
                    <strong>1%</strong>
                  </div>

                  <div className="review-bar">
                    <span>1 sao</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: "1%" }}></div>
                    </div>
                    <strong>1%</strong>
                  </div>
                </div>
              </div>

              <div className="review-list">
                <div className="review-card featured">
                  <div className="review-card__top">
                    <div className="review-user">
                      <div className="review-avatar">L</div>
                      <div>
                        <strong>Lộc Lâm</strong>
                        <span>Đã mua hàng</span>
                      </div>
                    </div>
                    <div className="review-stars">★★★★★</div>
                  </div>

                  <h4>Hiệu năng vượt mong đợi</h4>
                  <p>
                    Máy chạy rất mượt, chiến game ngon, nhiệt độ ổn định. Thiết kế đẹp,
                    LED nhìn cực nổi bật vào buổi tối. Shop tư vấn cũng rất nhiệt tình.
                  </p>

                  <div className="review-tags">
                    <span>Hiệu năng tốt</span>
                    <span>Đóng gói kỹ</span>
                    <span>Đáng tiền</span>
                  </div>
                </div>

                <div className="review-grid">
                  <div className="review-card">
                    <div className="review-card__top">
                      <div className="review-user">
                        <div className="review-avatar alt">A</div>
                        <div>
                          <strong>Nguyễn An</strong>
                          <span>2 ngày trước</span>
                        </div>
                      </div>
                      <div className="review-stars">★★★★☆</div>
                    </div>

                    <p>
                      Giá hợp lý, build đẹp, chạy các tác vụ đồ họa tốt. Giao hàng chậm hơn
                      dự kiến một chút nhưng tổng thể vẫn rất hài lòng.
                    </p>
                  </div>

                  <div className="review-card">
                    <div className="review-card__top">
                      <div className="review-user">
                        <div className="review-avatar pink">H</div>
                        <div>
                          <strong>Hải Nam</strong>
                          <span>1 tuần trước</span>
                        </div>
                      </div>
                      <div className="review-stars">★★★★★</div>
                    </div>

                    <p>
                      Phần ngoại hình quá đẹp, case chắc chắn, hiệu năng ổn định. Chơi AAA
                      setting cao vẫn mượt, rất đáng tiền trong tầm giá.
                    </p>
                  </div>
                </div>
              </div>

              <div className="review-form">
                <div className="review-form__head">
                  <h3>Chia sẻ cảm nhận của bạn</h3>
                  <div className="review-form__stars">☆ ☆ ☆ ☆ ☆</div>
                </div>

                <div className="review-form__group">
                  <input type="text" placeholder="Tên của bạn" />
                  <input type="text" placeholder="Tiêu đề đánh giá" />
                </div>

                <textarea placeholder="Hãy chia sẻ trải nghiệm thực tế sau khi sử dụng sản phẩm..." />

                <button type="button" className="btn btn--primary">
                  Gửi đánh giá
                </button>
              </div>
            </section>
          )
        }

        <section className="related-products">
          <div className="section-head">
            <h2>Sản phẩm liên quan</h2>
          </div>

          {products.length === 0 ? (
            <div className="no-product">
              <div className="img">
                <img src={NoData} alt="No data" />
                <span>Không có sản phẩm liên quan</span>
              </div>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((item, index) => {
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

        </section>
      </main>
    </div>
  );
}

export default ProductDeatil;