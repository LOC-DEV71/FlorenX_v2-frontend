import "./ProductsDetail.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiMoreVertical, FiPackage, FiStar, FiImage, FiRefreshCw } from "react-icons/fi";
import {
    RiEditLine,
    RiDeleteBinLine,
    RiEyeLine,
    RiShieldCheckLine,
    RiTimeLine,
    RiHashtag,
    RiPriceTag3Line,
    RiBarChartBoxLine,
} from "react-icons/ri";
import { MdArrowBack, MdOutlineStorefront } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi";
import { VscFolderActive } from "react-icons/vsc";
import { BsBoxSeam } from "react-icons/bs";
import { TbAlertTriangle } from "react-icons/tb";
import { Rate, Image, Skeleton, Empty, Avatar } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import { getProductBySlug } from "../../../services/admin/product.admin.service";
import { adminReturnReview, getProductPreview } from "../../../services/admin/product.preview";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import { error, success } from "../../../utils/notift";
import LoadingOverlay from "../../../utils/LoadingOverlay";
import { useSocket } from "../../../Socket/useSocket";
import SEO from "../../../utils/SEO";

function ProductsDetail() {
    const { slug } = useParams();

    const [data, setData] = useState({});
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [average, setAverage] = useState(null);
    const [rating, setRating] = useState([]);
    const socket = useSocket();
    const [action, setAction] = useState({ type: false, id: "" });
    const [returnReview, setReturnReview] = useState({ id: "", comment: "" });

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const res = await getProductBySlug(slug);
                if (res?.data?.code) setData(res?.data?.data);
            } catch (err) {
                console.log(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, [slug]);

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            try {
                const res = await getProductPreview(slug);
                if (res?.data?.code) {
                    setPreview(res?.data?.productPreview);
                    setAverage(res?.data?.average);
                    setRating(res?.data?.ratings);
                }
            } catch (err) {
                console.log(err.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, [slug]);

    useEffect(() => {
        if (!socket) return;
        const handler = (data) => {
            setPreview(prev =>
                prev.map(item =>
                    String(item._id) === String(data.id)
                        ? { ...item, server_return: { ...data.server_return } }
                        : item
                )
            );
        };
        socket.on("server_return_admin_product_preview", handler);
        return () => socket.off("server_return_admin_product_preview", handler);
    }, [socket]);

    const finalPrice = useMemo(() => {
        if (!data?.price) return 0;
        return data.price - (data.price * (data.discountPercentage || 0)) / 100;
    }, [data]);

    const handleReturnComment = async () => {
        if (returnReview.comment === "") return error("Vui lòng nhập câu trả lời");
        setLoadingPost(true);
        try {
            const res = await adminReturnReview(returnReview);
            if (res?.data?.code) {
                socket.emit("admin_product_preview", res.data.data);
                setReturnReview(prev => ({ ...prev, comment: "", id: "" }));
                success(res?.data?.message || "Đã trả lời review!");
            }
        } catch (err) {
            console.log(err.response?.data?.message || "Xảy ra lỗi");
        } finally {
            setLoadingPost(false);
        }
    };

    if (loading) return (
        <div className="pd">
            <Skeleton active paragraph={{ rows: 18 }} />
        </div>
    );

    if (!data) return <Empty description="Không có dữ liệu sản phẩm" />;

    return (
        <div className="pd">
            <SEO title={`Chi tiết: ${data?.title}`} />
            {loadingPost && <LoadingOverlay title="Đang trả lời đánh giá" />}

            {/* Header */}
            <div className="pd__header-bar">
                <Link to="/admin/products" className="pd__back">
                    <MdArrowBack /> Danh sách sản phẩm
                </Link>
            </div>

            <div className="pd__hero card" style={{background: "white"}}>
                <div className="pd__hero-left">
                    <div className="pd__thumbnail">
                        <img src={data?.thumbnail} alt={data?.title} />
                    </div>
                    <div className="pd__hero-info">
                        <div className="pd__hero-tags">
                            <span className={`pd__status-badge ${data?.status === "active" ? "pd__status-badge--active" : "pd__status-badge--inactive"}`}>
                                {data?.status === "active" ? "Hoạt động" : "Không hoạt động"}
                            </span>
                            {data?.featured === "yes" && (
                                <span className="pd__status-badge pd__status-badge--featured">
                                    <HiOutlineStar /> Nổi bật
                                </span>
                            )}
                        </div>
                        <h1 className="pd__title">{data?.title}</h1>
                        <div className="pd__meta">
                            <span><MdOutlineStorefront /> {data?.brand}</span>
                            <span><RiHashtag /> {data?.slug}</span>
                        </div>
                    </div>
                </div>

                <div className="pd__hero-actions">
                    <a href="#" className="pd__action-btn pd__action-btn--ghost">
                        <RiEyeLine /> Website
                    </a>
                    <Link to={`/admin/products/update/${data?.slug}`} className="pd__action-btn pd__action-btn--primary">
                        <RiEditLine /> Chỉnh sửa
                    </Link>
                    <button className="pd__action-btn pd__action-btn--danger">
                        <RiDeleteBinLine /> Xoá
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="pd__stats">
                <div className="pd__stat-card">
                    <div className="pd__stat-icon pd__stat-icon--blue"><FiStar /></div>
                    <div>
                        <p>Đánh giá</p>
                        <h2>{preview.length || 0}</h2>
                    </div>
                </div>
                <div className="pd__stat-card">
                    <div className="pd__stat-icon pd__stat-icon--amber"><HiOutlineStar /></div>
                    <div>
                        <p>Điểm TB</p>
                        <h2>{average || 0}</h2>
                    </div>
                </div>
                <div className="pd__stat-card">
                    <div className="pd__stat-icon pd__stat-icon--purple"><FiImage /></div>
                    <div>
                        <p>Ảnh</p>
                        <h2>{(data?.images?.length || 0) + 1}</h2>
                    </div>
                </div>
                <div className="pd__stat-card">
                    <div className="pd__stat-icon pd__stat-icon--green"><FiRefreshCw /></div>
                    <div>
                        <p>Cập nhật</p>
                        <h2>{data?.updatedBy?.length || 0}</h2>
                    </div>
                </div>
            </div>

            {/* Layout */}
            <div className="pd__layout">
                <div className="pd__main">

                    {/* Pricing */}
                    <div className="pd__card">
                        <div className="pd__card-title"><RiPriceTag3Line /> Giá & Kho hàng</div>
                        <div className="pd__price-grid">
                            <div className="pd__price-box">
                                <span>Giá gốc</span>
                                <h2>{data?.price?.toLocaleString("vi-VN")}₫</h2>
                            </div>
                            <div className="pd__price-box pd__price-box--discount">
                                <span>Giảm giá</span>
                                <h2>-{data?.discountPercentage || 0}%</h2>
                            </div>
                            <div className="pd__price-box pd__price-box--final">
                                <span>Giá bán</span>
                                <h2>{finalPrice?.toLocaleString("vi-VN")}₫</h2>
                            </div>
                        </div>

                        <div className={`pd__stock-banner ${data?.stock <= 5 ? "pd__stock-banner--low" : "pd__stock-banner--ok"}`}>
                            {data?.stock <= 5 ? <TbAlertTriangle /> : <VscFolderActive />}
                            <span>
                                {data?.stock <= 5
                                    ? `Sắp hết hàng — còn ${data?.stock} sản phẩm`
                                    : `Còn hàng — ${data?.stock} sản phẩm`}
                            </span>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="pd__card">
                        <div className="pd__card-title"><FiImage /> Thư viện ảnh</div>
                        <div className="pd__gallery">
                            {[data?.thumbnail, ...(data?.images || [])]
                                ?.filter(Boolean)
                                ?.map((img, i) => (
                                    <Image key={i} src={img} />
                                ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="pd__card">
                        <div className="pd__card-title">Mô tả sản phẩm</div>
                        <div className="pd__description" dangerouslySetInnerHTML={{ __html: data?.description }} />
                    </div>

                    {/* Specs */}
                    <div className="pd__card">
                        <div className="pd__card-title"><RiBarChartBoxLine /> Thông số kỹ thuật</div>
                        <div className="pd__specs">
                            {Object.entries(data?.specs || {})?.map(([key, value], i) => (
                                <div className={`pd__spec-row ${i % 2 === 0 ? "pd__spec-row--even" : ""}`} key={key}>
                                    <span>{key}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="pd__card">
                        <div className="pd__card-title"><HiOutlineStar /> Đánh giá sản phẩm</div>

                        <div className="pd__review-overview">
                            <div className="pd__avg-block">
                                <span className="pd__avg-number">{average || 0}</span>
                                <Rate disabled value={average || 0} />
                                <p>{preview.length || 0} đánh giá</p>
                            </div>

                            <div className="pd__rating-bars">
                                {rating?.map(item => (
                                    <div className="pd__rating-bar" key={item._id}>
                                        <span>{item.star} sao</span>
                                        <div className="pd__bar-track">
                                            <div className="pd__bar-fill" style={{ width: `${item.rating}%` }} />
                                        </div>
                                        <strong>{item.rating || 0}%</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pd__review-list">
                            {preview?.length > 0 ? preview.map((review) => (
                                <div className="pd__review-card" key={review._id}>
                                    <div className="pd__review-top">
                                        <div className="pd__review-user">
                                            <Avatar>{review?.user_name?.charAt(0)}</Avatar>
                                            <div>
                                                <h4>{review?.user_name}</h4>
                                                <span><ClockCircleOutlined /> {formatTimeAgo(review?.createdAt)}</span>
                                            </div>
                                        </div>
                                        <Rate disabled value={review?.rating} />
                                    </div>

                                    <h3 className="pd__review-title">{review?.title}</h3>
                                    <p className="pd__review-comment">{review?.comment}</p>

                                    {review?.updated && (
                                        <span className="pd__edited-tag">Đã chỉnh sửa</span>
                                    )}

                                    {review?.images?.length > 0 && (
                                        <div className="pd__review-images">
                                            {review.images.map((img, i) => (
                                                <Image key={i} src={img} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Admin reply */}
                                    {review?.server_return?.comment && (
                                        <div className="pd__admin-reply">
                                            <div className="pd__reply-header">
                                                <div className="pd__admin-info">
                                                    <div className="pd__admin-avatar">
                                                        <img src={review?.server_return?.avatar} alt="avatar" />
                                                    </div>
                                                    <div>
                                                        <div className="pd__admin-name-row">
                                                            <h4>{review?.server_return?.admin_name}</h4>
                                                            <span className="pd__role-badge">{review?.server_return?.role}</span>
                                                        </div>
                                                        <p className="pd__reply-time">{formatTimeAgo(review?.server_return?.createdAt) || "Vừa xong"}</p>
                                                    </div>
                                                </div>

                                                <div className="pd__action-wrapper">
                                                    <span className="pd__shop-tag">Phản hồi từ shop</span>
                                                    <button
                                                        className="pd__more-btn"
                                                        onClick={() => setAction(prev => ({ id: review?._id, type: prev.id === review?._id ? !prev.type : true }))}
                                                    >
                                                        <FiMoreVertical />
                                                    </button>

                                                    {action.type && action.id === review?._id && (
                                                        <ul className="pd__action-menu">
                                                            <li onClick={() => {
                                                                setAction(prev => ({ ...prev, type: false }));
                                                                setReturnReview(prev => ({ ...prev, comment: review?.server_return?.comment, id: review?._id }));
                                                            }}>Chỉnh sửa</li>
                                                            <li className="pd__action-menu-danger">Xoá</li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="pd__reply-content">{review?.server_return?.comment}</p>
                                        </div>
                                    )}

                                    {returnReview.id !== review._id && !review?.server_return?.comment && (
                                        <button
                                            className="pd__reply-trigger"
                                            onClick={() => setReturnReview(prev => ({ ...prev, id: prev.id === review._id ? null : review._id }))}
                                        >
                                            Trả lời
                                        </button>
                                    )}

                                    {returnReview.id === review._id && (
                                        <div className="pd__reply-box">
                                            <textarea
                                                placeholder="Nhập phản hồi của shop..."
                                                onChange={e => setReturnReview(prev => ({ ...prev, comment: e.target.value }))}
                                                value={returnReview.comment}
                                            />
                                            <div className="pd__reply-box-actions">
                                                <button className="pd__reply-cancel" onClick={() => setReturnReview(prev => ({ ...prev, id: "" }))}>Huỷ</button>
                                                <button className="pd__reply-submit" onClick={handleReturnComment}>Gửi phản hồi</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <Empty description="Chưa có đánh giá nào" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="pd__sidebar">
                    <div className="pd__card">
                        <div className="pd__card-title"><RiShieldCheckLine /> Thông tin hệ thống</div>
                        <div className="pd__sys-info">
                            {[
                                { label: "Product ID", value: data?._id },
                                { label: "Ngày tạo", value: new Date(data?.createdAt).toLocaleString() },
                                { label: "Cập nhật", value: new Date(data?.updatedAt).toLocaleString() },
                                { label: "Trạng thái", value: data?.deleted ? "Đã xoá" : "Đang hoạt động" },
                            ].map(({ label, value }) => (
                                <div className="pd__sys-row" key={label}>
                                    <span>{label}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pd__card">
                        <div className="pd__card-title"><RiTimeLine /> Lịch sử cập nhật</div>
                        <div className="pd__timeline">
                            {data?.updatedBy?.map((item, i) => (
                                <div className="pd__timeline-item" key={i}>
                                    <div className="pd__timeline-dot" />
                                    <div className="pd__timeline-content">
                                        <h4>{item?.account_id}</h4>
                                        <span>{new Date(item?.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductsDetail;