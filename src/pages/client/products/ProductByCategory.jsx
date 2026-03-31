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


function ProductByCategory() {
    const { category } = useParams();
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const settings = useSelector((state) => state.setting.settings);
    const section_hero = settings?.section_hero || [];
    const heroItem = section_hero.find((item) => item.tag === category);
    const loadingUi = useSelector((state) => state.setting.loading);
    const [liked, setLiked] = useState(false);



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


    const priceOptions = [
        5000000,
        15000000,
        50000000,
        500000000
    ];


    return (
        <>
            {loadingUi ?
                <div className="product-by-category" >
                    <div className="loading">
                        <span className="spinner "></span>
                    </div>
                </div>
                : (
                    <div className="product-by-category" id="product-by-category">
                        <SEO
                            title={`Veltrix - ${heroItem?.title || category || "Accessories"}`}
                            description="Veltrix Gear bán PC Gaming, Laptop, Linh kiện máy tính chất lượng cao."
                        />
                        <div className="container">
                            <div className="breadcrumb">
                                <span>Home</span>
                                <span>/</span>
                                <span>Shop</span>
                                <span>/</span>
                                <span className="active">{category}</span>
                            </div>

                            <div className="hero">
                                <div className="hero__content">
                                    <h1 className="hero__title">
                                        {heroItem?.title || category || "Accessories"}
                                    </h1>
                                    <p className="hero__desc">
                                        {heroItem?.description ||
                                            "Những vật dụng thiết yếu được tuyển chọn kỹ lưỡng cho lối sống hiện đại. Những món đồ được chế tác tỉ mỉ nhằm nâng tầm cuộc sống thường nhật của bạn."}
                                    </p>
                                </div>

                                <div className="hero__image">
                                    <img
                                        src={
                                            heroItem?.image ||
                                            "https://res.cloudinary.com/dfzgowb54/image/upload/v1774624745/tdawupquph724kqgsjjp.jpg"
                                        }
                                        alt={heroItem?.title || category}
                                    />
                                </div>
                            </div>

                            <div className="category-tabs">
                                {loadingCate
                                    ? <div>
                                        Đang tải <LoadingOutlined />
                                    </div>
                                    : categoryList.map((item) => (
                                        <Link
                                            key={item._id || item.slug}
                                            to={`/products/${item.slug}`}
                                            className={item.slug === category ? "active" : ""}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                            </div>

                            <div className="content-layout">
                                <aside className="filters" id="product-by-category">
                                    <div className="filters__header">
                                        <h3>Lọc sản phẩm</h3>
                                        <span>Bộ sưu tập tương lai</span>
                                    </div>

                                    <div className="filter-group">
                                        <div className="filter-options">
                                            <div className="filter-group__title">Theo giá</div>
                                            {priceOptions.map((value) => (
                                                <label key={value}>
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
                                    <div className="filter-group">
                                        <div className="filter-group__title">Brand</div>
                                    </div>
                                    <div className="filter-group">
                                        <div className="filter-group__title">Rating</div>
                                    </div>

                                    <button className="clear-btn" onClick={() => navigate(`/products/${category}`)}>Clear All</button>
                                </aside>

                                <div className="products-section" >
                                    {loading ? (
                                        <div className="product-grid-loading">
                                            Đang tải sản phẩm <span className="spinner"></span>
                                        </div>
                                    ) : data?.length === 0 ? (
                                        <div className="no-product">
                                            <div className="img">
                                                <img src={NoData} alt="nodata" />
                                                <span>No Data</span>
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
                                    )}

                                    <div className="load-more-wrap">
                                        {renderpagination(pagination, setSearchParams, limit, price)}
                                    </div>

                                    <div className="banner">
                                        <div className="banner__overlay">
                                            <span className="banner__tag">GIẢM GIÁ THEO PHẦN TRĂM</span>
                                            <h2>Sản phẩm giảm giá sâu</h2>
                                            <p>
                                                Khám phá những sản phẩm công nghệ cao cấp với mức
                                                giá ưu đãi chưa từng có. Hiệu năng mạnh mẽ, thiết kế hiện đại
                                                dành cho trải nghiệm đỉnh cao.
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setSearchParams({
                                                        discount: "true"
                                                    })
                                                }
                                                to={"#product-by-category"}
                                            >KHÁM PHÁ BỘ SƯU TẬP</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default ProductByCategory;