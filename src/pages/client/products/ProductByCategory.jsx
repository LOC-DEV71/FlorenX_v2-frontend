import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { getProductByCategory } from "../../../services/client/product.service";
import { useSelector } from "react-redux";
import "./ProductByCategory.scss";
import { getBySlug } from "../../../services/client/product.category.client";
import { LoadingOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons"
import NoData from "../../../assets/banner/empty.png";
import { renderpagination } from "../../../utils/pagination.client.utils";
import SEO from "../../../utils/SEO";
import { addLike, getListLike } from "../../../services/client/like.service";
import { success } from "../../../utils/notift";
import Loading from "../../../utils/loading";

function ProductByCategory() {
    const { category } = useParams();
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const settings = useSelector((state) => state.setting.settings);
    const section_hero = settings?.section_hero || [];
    const heroItem = section_hero.find((item) => item.tag === category);
    const loadingUi = useSelector((state) => state.setting.loading);
    const [likeIds, setLikedIds] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const price = Number(searchParams.get("price")) || 0;
    const discount = (searchParams.get("discount")) || "false";
    const limit = searchParams.get("limit") || 6;
    const page = searchParams.get("page") || 1;

    const [loading, setLoading] = useState(false);
    const [loadingCate, setLoadingCate] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!category) return;
            setLoading(true);
            try {
                const res = await getProductByCategory({ category, price, discount, limit, page });
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
    }, [category, price, discount, limit, page]);

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

    useEffect(() => {
        const fetchCategories = async () => {
            if (!category) return;
            setLoadingCate(true)
            try {
                const res = await getBySlug(category);
                if (res?.data?.code) {
                    setCategoryList(res.data.categories);
                } else {
                    setCategoryList([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setCategoryList([]);
            } finally {
                setLoadingCate(false)
            }
        };
        fetchCategories();
    }, [category]);

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
            <div className="pbc-layout" id="pbc-layout-anchor">
                {loadingUi && <Loading />}
                <SEO
                    title={`Veltrix - ${heroItem?.title || category || "Accessories"}`}
                    description="Veltrix Gear bán PC Gaming, Laptop, Linh kiện máy tính chất lượng cao."
                />
                <div className="pbc-container">
                    <div className="pbc-breadcrumb">
                        <span>Home</span>
                        <span>/</span>
                        <span>Shop</span>
                        <span>/</span>
                        <span className="pbc-breadcrumb--active">{category}</span>
                    </div>

                    <div className="pbc-hero">
                        <div className="pbc-hero__content">
                            <h1 className="pbc-hero__title">
                                {heroItem?.title || category || "Accessories"}
                            </h1>
                            <p className="pbc-hero__desc">
                                {heroItem?.description ||
                                    "Những vật dụng thiết yếu được tuyển chọn kỹ lưỡng cho lối sống hiện đại. Những món đồ được chế tác tỉ mỉ nhằm nâng tầm cuộc sống thường nhật của bạn."}
                            </p>
                        </div>

                        <div className="pbc-hero__image">
                            <img
                                src={heroItem?.image || "https://res.cloudinary.com/dfzgowb54/image/upload/v1774624745/tdawupquph724kqgsjjp.jpg"}
                                alt={heroItem?.title || category}
                            />
                        </div>
                    </div>

                    <div className="pbc-tabs">
                        {loadingCate
                            ? <div className="pbc-tabs__loading">Đang tải <LoadingOutlined /></div>
                            : categoryList.map((item) => (
                                <Link
                                    key={item._id || item.slug}
                                    to={`/products/${item.slug}`}
                                    className={`pbc-tabs__link ${item.slug === category ? "pbc-tabs__link--active" : ""}`}
                                >
                                    {item.title}
                                </Link>
                            ))}
                    </div>

                    <div className="pbc-main-layout">
                        <aside className="pbc-filters">
                            <div className="pbc-filters__header">
                                <h3>Lọc sản phẩm</h3>
                                <span>Bộ sưu tập tương lai</span>
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

                            <button className="pbc-filters__clear-btn" onClick={() => navigate(`/products/${category}`)}>Clear All</button>
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
                                        <span>No Data</span>
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
                                                            <span className="pbc-card__star">★ 4.8</span>
                                                            <span className="pbc-card__count">(120 reviews)</span>
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

                            <div className="pbc-banner">
                                <div className="pbc-banner__overlay">
                                    <span className="pbc-banner__tag">GIẢM GIÁ THEO PHẦN TRĂM</span>
                                    <h2>Sản phẩm giảm giá sâu</h2>
                                    <p>Khám phá những sản phẩm công nghệ cao cấp với mức giá ưu đãi chưa từng có.</p>
                                    <button onClick={() => setSearchParams({ discount: "true" })}>
                                        KHÁM PHÁ BỘ SƯU TẬP
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductByCategory;