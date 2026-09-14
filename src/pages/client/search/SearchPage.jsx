import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { searchProductsAPI } from "../../../services/client/product.service";
import { useSelector } from "react-redux";
import "../products/ProductByCategory.scss"; // Tái sử dụng CSS của Category
import { LoadingOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons"
import NoData from "../../../assets/banner/empty.png";
import { renderpagination } from "../../../utils/pagination.client.utils";
import SEO from "../../../utils/SEO";
import { addLike, getListLike } from "../../../services/client/like.service";
import { success } from "../../../utils/notift";
import Loading from "../../../utils/loading";

function SearchPage() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);

    const loadingUi = useSelector((state) => state.setting.loading);
    const [likeIds, setLikedIds] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const keyword = searchParams.get("keyword") || "";
    const price = Number(searchParams.get("price")) || 0;
    const discount = (searchParams.get("discount")) || "false";
    const limit = searchParams.get("limit") || 6;
    const page = searchParams.get("page") || 1;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!keyword) return;
            setLoading(true);
            try {
                const res = await searchProductsAPI({ keyword, price, discount, limit, page });
                if (res?.data?.code) {
                    setData(res.data.products);
                    setPagination(res.data.pagination);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [keyword, price, discount, limit, page]);

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
    }, []);

    const priceOptions = [5000000, 15000000, 50000000, 500000000];

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

    return (
        <>
            <div className="pbc-layout" id="product-by-category">
                {loadingUi && <Loading />}
                <SEO
                    title={`Tìm kiếm: ${keyword}`}
                    description={`Kết quả tìm kiếm cho ${keyword}`}
                />
                <div className="pbc-container">
                    <div className="pbc-breadcrumb">
                        <span>Home</span>
                        <span>/</span>
                        <span>Search</span>
                        <span>/</span>
                        <span className="pbc-breadcrumb--active">{keyword}</span>
                    </div>

                    <div className="pbc-hero">
                        <div className="pbc-hero__content">
                            <h1 className="pbc-hero__title">
                                Tìm kiếm: "{keyword}"
                            </h1>
                            <p className="pbc-hero__desc">
                                Khám phá các sản phẩm phù hợp nhất với từ khóa của bạn.
                            </p>
                        </div>

                        <div className="pbc-hero__image">
                            <img
                                src={"https://res.cloudinary.com/dfzgowb54/image/upload/v1774624745/tdawupquph724kqgsjjp.jpg"}
                                alt={"Search banner"}
                            />
                        </div>
                    </div>

                    <div className="pbc-main-layout" style={{ marginTop: '30px' }}>
                        <aside className="pbc-filters">
                            <div className="pbc-filters__header">
                                <h3>Lọc sản phẩm</h3>
                                <span>Kết quả tìm kiếm</span>
                            </div>

                            <div className="pbc-filter-group">
                                <div className="pbc-filter-options">
                                    <div className="pbc-filter-group__title">Theo giá</div>
                                    {priceOptions.map((value) => (
                                        <label key={value} className="pbc-filter-label">
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={price === value}
                                                onChange={() => {
                                                    setSearchParams((prev) => {
                                                        const params = new URLSearchParams(prev);
                                                        params.set("price", value.toString());
                                                        return params;
                                                    });
                                                }}
                                            />
                                            Dưới {value.toLocaleString("vi-VN")}đ
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="pbc-filter-group">
                                <div className="pbc-filter-group__title">Brand</div>
                            </div>
                            <div className="pbc-filter-group">
                                <div className="pbc-filter-group__title">Rating</div>
                            </div>

                            <button className="pbc-filters__clear-btn" onClick={() => navigate(`/search?keyword=${keyword}`)}>Clear All</button>
                        </aside>

                        <div className="pbc-products-section">
                            {loading ? (
                                <div className="pbc-loading-grid">
                                    Đang tải sản phẩm <span className="pbc-spinner"></span>
                                </div>
                            ) : data?.length === 0 ? (
                                <div className="pbc-no-data">
                                    <div className="pbc-no-data__inner">
                                        <img src={NoData} alt="nodata" />
                                        <span>Không có sản phẩm nào khớp với từ khóa "{keyword}"</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="pbc-grid">
                                    {data.map((item, index) => {
                                        const originalPrice = Number(item?.price) || 0;
                                        const discountPercentage = Number(item?.discountPercentage) || 0;
                                        const finalPrice = discountPercentage > 0
                                            ? originalPrice - (originalPrice * discountPercentage) / 100
                                            : originalPrice;

                                        return (
                                            <Link
                                                to={`/products/detail/${item.slug || item._id}`}
                                                className="pbc-card"
                                                key={item._id || index}
                                            >
                                                <div className="pbc-card__thumb">
                                                    {discountPercentage > 0 && (
                                                        <span className="pbc-card__badge-sale">-{discountPercentage}%</span>
                                                    )}
                                                    {item.featured && (
                                                        <span className="pbc-card__badge-featured">Nổi bật</span>
                                                    )}
                                                    <img
                                                        src={item?.thumbnail || item?.image || "https://via.placeholder.com/400x500?text=Product"}
                                                        alt={item?.title || item?.name}
                                                    />
                                                </div>

                                                <div className="pbc-card__info">
                                                    <h3 className="pbc-card__title">{item?.title || item?.name}</h3>
                                                    <div className="pbc-card__price">
                                                        <span className={`pbc-card__price-old ${discountPercentage > 0 ? "" : "pbc-card__price--hidden"}`}>
                                                            {originalPrice.toLocaleString("vi-VN")}đ
                                                        </span>
                                                        <span className="pbc-card__price-new">
                                                            {finalPrice.toLocaleString("vi-VN")}đ
                                                        </span>
                                                    </div>
                                                    <div className="pbc-card__meta">
                                                        <div className="pbc-card__rating">
                                                            <span className="pbc-card__star">★ {item.averageRating?.toFixed(1) || 0}</span>
                                                            <span className="pbc-card__count">({item.totalReviews || 0} reviews)</span>
                                                        </div>
                                                        <div className="pbc-card__favorite" onClick={(e) => handleLike(e, item._id)}>
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
                            )}

                            <div className="pbc-pagination-wrap">
                                {renderpagination(pagination, setSearchParams, limit, price)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchPage;
