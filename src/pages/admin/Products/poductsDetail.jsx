import "./ProductsDetail.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import {
    Rate,
    Progress,
    Tag,
    Button,
    Image,
    Skeleton,
    Empty,
    Avatar,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    StarFilled,
    WarningOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

import { getProductBySlug } from "../../../services/admin/product.admin.service";
import { Link } from "react-router-dom";
import { adminReturnReview, getProductPreview } from "../../../services/admin/product.preview";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import { error, success } from "../../../utils/notift";
import LoadingOverlay from "../../../utils/LoadingOverlay";
import { useSocket } from "../../../Socket/useSocket";
import SEO from "../../../utils/SEO";
import { VscFolderActive } from "react-icons/vsc";


function ProductsDetail() {
    const { slug } = useParams();

    const [data, setData] = useState({});
    const [preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false)
    const [average, setAverage] = useState(null);
    const [rating, setRating] = useState([]);
    const socket = useSocket();
    const [action, setAction] = useState({
        type: false,
        id: ""
    })
    const [returnReview, setReturnReview] = useState({
        id: "",
        comment: ""
    });
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);

            try {
                const res = await getProductBySlug(slug);

                if (res?.data?.code) {
                    setData(res?.data?.data);
                }
            } catch (error) {
                console.log(error.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [slug]);

    const finalPrice = useMemo(() => {
        if (!data?.price) return 0;

        return (
            data.price -
            (data.price * (data.discountPercentage || 0)) / 100
        );
    }, [data]);

    const ratingPercent = (star) => {
        const count =
            data?.reviews?.filter((item) => item.rating === star)?.length || 0;

        const total = data?.reviews?.length || 1;

        return Math.round((count / total) * 100);
    };

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
            } catch (error) {
                console.log(error.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, [slug])


    const handleReturnComment = async () => {
        if (returnReview.comment === "") {
            return error("Vui lòng nhập câu trả lời")
        }
        setLoadingPost(true)
        try {
            const res = await adminReturnReview(returnReview);
            if (res?.data?.code) {
                socket.emit("admin_product_preview", res.data.data)
                setReturnReview(prev => ({...prev, comment: "", id: "" }))
                success(res?.data?.message || "Đã trả lời review!")
            }
        } catch (err) {
            console.log(err.response?.data?.message || "Xảy ra lỗi")
        } finally {
            setLoadingPost(false)
        }
    }

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

        return () => {
            socket.off("server_return_admin_product_preview", handler); 
        };
    }, [socket]);

    if (loading) {
        return (
            <div className="product-detail">
                <Skeleton active paragraph={{ rows: 18 }} />
            </div>
        );
    }

    if (!data) {
        return <Empty description="Không có dữ liệu sản phẩm" />;
    }




    return (
        <div className="product-detail">
            {<SEO title={`Chi tiết: ${data?.title}`} />}
            {loadingPost && <LoadingOverlay title="Đang trả lời đáng giá" />}
            {/* HEADER */}
            <div className="product-header card">
                <div className="left">
                    <div className="thumbnail">
                        <img
                            src={data?.thumbnail}
                            alt={data?.title}
                        />
                    </div>

                    <div className="info">
                        <div className="top">
                            <h1>{data?.title}</h1>

                            <div className="tags">
                                <Tag color={data?.status === "active" ? "green" : "red"}>
                                    {data?.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                </Tag>

                                {data?.featured === "yes" && (
                                    <Tag color="gold">{data?.featured === "yes" ? "Nổi bậc" : "Không nổi bậc"}</Tag>
                                )}
                            </div>
                        </div>

                        <div className="meta">
                            <span>{data?.brand}</span>
                            <span>Slug: {data?.slug}</span>
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <Button icon={<EyeOutlined />}>
                        Website
                    </Button>

                    <Link
                        type="primary"
                        className="primaty"
                        to={`/admin/products/update/${data?.slug}`}
                    >
                        <EditOutlined /> Edit
                    </Link>

                    <Button
                        danger
                        icon={<DeleteOutlined />}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
                <div className="stats-card">
                    <h4>Total Reviews</h4>
                    <h2>{preview.length || 0}</h2>
                </div>

                <div className="stats-card">
                    <h4>Average Rating</h4>
                    <h2>{average || 0}</h2>
                </div>

                <div className="stats-card">
                    <h4>Total Images</h4>
                    <h2>{data?.images?.length + 1 || 0}</h2>

                </div>

                <div className="stats-card">
                    <h4>Updates</h4>
                    <h2>{data?.updatedBy?.length || 0}</h2>
                </div>
            </div>

            <div className="product-layout">
                <div className="main-content">
                    {/* PRICE */}
                    <div className="card">
                        <div className="card-title">
                            Pricing & Stock
                        </div>

                        <div className="price-grid">
                            <div className="price-box">
                                <span>Original Price</span>
                                <h2>
                                    {data?.price?.toLocaleString("vi-VN")}đ
                                </h2>
                            </div>

                            <div className="price-box">
                                <span>Discount</span>
                                <h2 className="discount">
                                    -{data?.discountPercentage || 0}%
                                </h2>
                            </div>

                            <div className="price-box active">
                                <span>Final Price</span>

                                <h2>
                                    {finalPrice?.toLocaleString("vi-VN")}đ
                                </h2>
                            </div>
                        </div>

                        <div className="success-stock">
                                <VscFolderActive />
                                <span>
                                    Số lượng sản phẩm:
                                    {" "}
                                    {data?.stock}
                                </span>
                        </div>
                        {data?.stock <= 5 && (
                            <div className="low-stock">
                                <WarningOutlined />
                                <span>
                                    Low stock threshold:
                                    {" "}
                                    {data?.stock}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* GALLERY */}
                    <div className="card">
                        <div className="card-title">
                            Product Gallery
                        </div>

                        <div className="gallery">
                            {[data?.thumbnail, ...(data?.images || [])]
                                ?.filter(Boolean)
                                ?.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={img}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="card">
                        <div className="card-title">
                            Description
                        </div>

                        <div
                            className="description"
                            dangerouslySetInnerHTML={{
                                __html: data?.description,
                            }}
                        />
                    </div>

                    {/* SPECS */}
                    <div className="card">
                        <div className="card-title">
                            Specifications
                        </div>

                        <div className="specs">
                            {Object.entries(data?.specs || {})?.map(
                                ([key, value], index) => (
                                    <div
                                        className={`spec-row ${index % 2 === 0 ? "even" : ""
                                            }`}
                                        key={key}
                                    >
                                        <span>{key}</span>
                                        <strong>{value}</strong>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* REVIEWS */}
                    <div className="card">
                        <div className="card-title">
                            Product Reviews
                        </div>

                        <div className="review-overview">
                            <div className="avg-rating">
                                <h1>{average || 0}</h1>

                                <Rate
                                    disabled
                                    value={average || 0}
                                />

                                <p>
                                    {preview.length || 0} reviews
                                </p>
                            </div>

                            <div className="review-bars">
                                {rating && (
                                    rating.map(item => (
                                        <div className="review-bar" key={item._id}>
                                            <span>{item.star} sao</span>
                                            <div className="bar-track">
                                                <div className="bar-fill" style={{ width: `${item.rating}%` }}></div>
                                            </div>
                                            <strong>{item.rating || 0}%</strong>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="review-list">
                            {preview?.length > 0 ? (
                                preview?.map((review) => (
                                    <div
                                        className="review-card"
                                        key={review._id}
                                    >
                                        <div className="review-top">
                                            <div className="user">
                                                <Avatar>
                                                    {review?.user_name?.charAt(0)}
                                                </Avatar>

                                                <div>
                                                    <h4>
                                                        {review?.user_name}
                                                    </h4>

                                                    <span>
                                                        <ClockCircleOutlined />
                                                        {" "}
                                                        {formatTimeAgo(review?.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <Rate
                                                disabled
                                                value={review?.rating}
                                            />
                                        </div>

                                        <h3 className="review-title">
                                            {review?.title}
                                        </h3>

                                        <p className="review-comment">
                                            {review?.comment}
                                        </p>

                                        {review?.updated && (
                                            <Tag color="blue">
                                                Đã chỉnh sửa
                                            </Tag>
                                        )}

                                        {review?.images?.length > 0 && (
                                            <div className="review-images">
                                                {review?.images?.map((img, i) => (
                                                    <Image
                                                        key={i}
                                                        src={img}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* ADMIN REPLY */}
                                        {review?.server_return?.comment && (
                                            <div className="admin-reply">
                                                <div className="reply-header">
                                                    <div className="admin-info">
                                                        <div className="admin-avatar">
                                                            <img src={review?.server_return?.avatar} alt="avatar" />
                                                        </div>

                                                        <div className="admin-info-top">
                                                            <div className="admin-info-top-header">
                                                                <h4>
                                                                    {review?.server_return?.admin_name}
                                                                </h4>

                                                                <span className="role">
                                                                    {review?.server_return?.role}
                                                                </span>
                                                            </div>
                                                            <div className="time-ago">
                                                                {formatTimeAgo(review?.server_return?.createdAt) || "Vừa xong"}
                                                            </div>
                                                        </div>


                                                    </div>


                                                    <div className="action-wrapper">
                                                        <Tag color="blue">
                                                            Phản hồi từ shop
                                                        </Tag>

                                                        <button
                                                            className="btn-action"
                                                            onClick={() => {
                                                                setAction(prev => ({
                                                                    ...prev,
                                                                    id: review?._id,
                                                                    type: !prev.type
                                                                }))
                                                            }}
                                                        >
                                                            <FiMoreVertical />
                                                        </button>

                                                        {action.type && action.id === review?._id && (
                                                            <ul className="list-action">
                                                                <li onClick={() => {
                                                                    setAction(prev => ({...prev, type: false}))
                                                                    setReturnReview(prev => ({...prev, comment: review?.server_return?.comment, id: review?._id }))
                                                                }}>Chỉnh sửa</li>
                                                                <li>Xóa</li>
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="reply-content">
                                                    {review?.server_return?.comment}
                                                </p>
                                            </div>
                                        )}

                                        {returnReview.id !== review._id && !review?.server_return?.comment && (
                                            <button
                                                className="return-review"
                                                onClick={() =>
                                                    setReturnReview((prev) => ({
                                                        ...prev,
                                                        id:
                                                            prev.id === review._id
                                                                ? null
                                                                : review._id,
                                                    }))
                                                }
                                            >
                                                Trả lời
                                            </button>
                                        )}


                                        {returnReview.id === review._id && (
                                            <div className="reply-box">
                                                <textarea
                                                    placeholder="Nhập phản hồi..."
                                                    onChange={e => setReturnReview(prev => ({ ...prev, comment: e.target.value }))}
                                                    value={returnReview.comment}
                                                />

                                                <div className="reply-actions">
                                                    <button className="cancel-btn" onClick={() => setReturnReview(prev => ({ ...prev, id: "" }))}>
                                                        Huỷ
                                                    </button>

                                                    <button className="submit-btn" onClick={handleReturnComment}>
                                                        Gửi phản hồi
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <Empty description="Chưa có đánh giá" />
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="sidebar">
                    <div className="card">
                        <div className="card-title">
                            System Information
                        </div>

                        <div className="system-info">
                            <div className="item">
                                <span>Product ID</span>
                                <strong>{data?._id}</strong>
                            </div>

                            <div className="item">
                                <span>Created At</span>

                                <strong>
                                    {new Date(
                                        data?.createdAt
                                    ).toLocaleString()}
                                </strong>
                            </div>

                            <div className="item">
                                <span>Updated At</span>

                                <strong>
                                    {new Date(
                                        data?.updatedAt
                                    ).toLocaleString()}
                                </strong>
                            </div>

                            <div className="item">
                                <span>Status</span>

                                <strong>
                                    {data?.deleted
                                        ? "Deleted"
                                        : "Active"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-title">
                            Update History
                        </div>

                        <div className="timeline">
                            {data?.updatedBy?.map((item, index) => (
                                <div
                                    className="timeline-item"
                                    key={index}
                                >
                                    <div className="dot"></div>

                                    <div className="content">
                                        <h4>{item?.account_id}</h4>

                                        <span>
                                            {new Date(
                                                item?.updatedAt
                                            ).toLocaleString()}
                                        </span>
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