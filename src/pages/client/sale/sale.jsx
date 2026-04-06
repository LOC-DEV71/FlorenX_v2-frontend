import { useSelector } from "react-redux";
import "./sale.scss";
import { getProductBySale } from "../../../services/client/product.service";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../utils/loading";
import SEO from "../../../utils/SEO";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { addLike, getListLike } from "../../../services/client/like.service";
import { HashLink } from "react-router-hash-link";

const categoryConfigs = [
    { key: "laptop", title: "Laptop" },
    { key: "pc", title: "PC Gaming" },
    { key: "man-hinh", title: "Màn hình" },
    { key: "ban-phim", title: "Bàn phím" },
    { key: "chuot-lot-chuot", title: "Chuột, lót chuột" },
];

function Sale() {
    const banner = useSelector((state) => state?.setting?.settings?.saleBanner);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likeIds, setLikedIds] = useState([]);
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await getListLike();
                if (res?.data?.code) {
                    setLikedIds(res.data.likes);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchLikes();
    }, []);

    const handleLike = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (likeIds.includes(productId)) {
                await addLike({ productId, type: "clear" });
                setLikedIds(prev => prev.filter(id => id !== productId));
            } else {
                await addLike({ productId, type: "add" });
                setLikedIds(prev => [...prev, productId]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                setLoading(true);

                const results = await Promise.all(
                    categoryConfigs.map(async (category) => {
                        try {
                            const res = await getProductBySale(category.key);

                            return {
                                ...category,
                                products: Array.isArray(res?.data?.products) ? res.data.products : [],
                            };
                        } catch (error) {
                            console.error(`Lỗi category ${category.key}:`, error);
                            return {
                                ...category,
                                products: [],
                            };
                        }
                    })
                );

                const validSections = results.filter(
                    (section) => section.products.length > 0
                );

                setSections(validSections);
            } catch (error) {
                console.error("Lỗi fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCategories();
    }, []);

    return (
        <div className="sale-page" id="sale-page">
            <div className="sale">
                <SEO title="Veltrix - Trang giảm giá" />
                <img
                    src={banner?.desktopImage}
                    alt="sale-banner"
                    className="sale-img"
                />

                <div className="sale-overlay">
                    <span className="sale-tag">SIÊU GIẢM GIÁ</span>
                    <h1 className="sale-title">{banner?.title}</h1>
                    <p className="sale-desc">{banner?.shortDescription}</p>
                    <div className="sale-discount">{banner?.discountText}</div>
                </div>
            </div>

            <div className="sale-products container">
                {loading ? (
                    <Loading />
                ) : sections.length === 0 ? (
                    <div className="no-product">Hiện chưa có sản phẩm khuyến mãi</div>
                ) : (
                    sections.map((section) => (
                        <div className="sale-category-block" key={section.key}>
                            <div className="sale-category-header">
                                <h2>{section.title}</h2>
                                <HashLink to={`/products/${section.key}/#product-by-category`} className="view-all">
                                    Xem tất cả
                                </HashLink>
                            </div>

                            <div className="products-section">
                                <div className="product-grid">
                                    {section.products.slice(0, 6).map((item, index) => {
                                        const originalPrice = Number(item?.price) || 0;
                                        const discountPercentage =
                                            Number(item?.discountPercentage) || 0;
                                        const finalPrice =
                                            discountPercentage > 0
                                                ? originalPrice -
                                                (originalPrice * discountPercentage) / 100
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

                                                    {item?.featured && (
                                                        <span className="featured-badge">Nổi bật</span>
                                                    )}

                                                    <img
                                                        src={
                                                            item?.thumbnail ||
                                                            item?.image ||
                                                            "https://via.placeholder.com/400x500?text=Product"
                                                        }
                                                        alt={item?.title || item?.name || "Product"}
                                                    />
                                                </div>

                                                <div className="product-card__info">
                                                    <h3 className="product-card__title">
                                                        {item?.title || item?.name || "Tên sản phẩm"}
                                                    </h3>

                                                    <div className="product-card__price">
                                                        <span
                                                            className={`price-old ${discountPercentage > 0 ? "" : "visibility"
                                                                }`}
                                                        >
                                                            {originalPrice.toLocaleString("vi-VN")}đ
                                                        </span>
                                                        <span className="price-new">
                                                            {finalPrice.toLocaleString("vi-VN")}đ
                                                        </span>
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
                                                            {likeIds.includes(item?._id)
                                                                ? <HeartFilled style={{ color: "red" }} />
                                                                : <HeartOutlined />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Sale;