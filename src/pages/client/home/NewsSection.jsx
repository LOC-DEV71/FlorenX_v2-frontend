import { useEffect, useState } from "react";
import "./NewsSection.scss";
import { error, success } from "../../../utils/notift";
import { getBySLug } from "../../../services/client/news.service";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
function NewsSection() {
    const [news, setNews] = useState([]);
    const loadingg = useSelector(state => state.setting)
    const showFeaturedPost = useSelector(state => state.setting?.settings?.showFeaturedPost);
    const [loading, setLoaing] = useState(true)
    const [voucher, setVoucher] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const [newsRes, voucherRes] = await Promise.all([
                    getBySLug("tin-tuc-cong-nghe"),
                    getBySLug("khuyen-mai")
                ]);

                if (newsRes.data.code) {
                    setNews(newsRes.data.news);
                }

                if (voucherRes.data.code) {
                    setVoucher(voucherRes.data.news);
                }

            } catch (err) {
                error(err.response?.data?.message);
            } finally {
                setLoaing(false);
            }
        };

        fetchApi();
    }, []);
    return (
        <>
            {showFeaturedPost &&
                <>
                    {news?.length > 0 && <div className="news_client" id="news">
                        <div className="news_client_top">
                            <h4> TIN TỨC CÔNG NGHỆ</h4>
                            <Link to={"/news"}>Xem tất cả</Link>
                        </div>
                        <div className="news_client_main">
                            {loading
                                ? Array(3).fill(0).map((_, index) => (
                                    <div className="news_client_item" key={index}>
                                        <Skeleton.Image style={{ width: "100%", height: 150 }} active />
                                        <Skeleton active paragraph={{ rows: 2 }} title={false} />
                                    </div>
                                ))
                                : news.map(item => (
                                    <Link className="news_client_item" to={`/news/${item.slug}`} key={item.id}>
                                        <img src={item.thumbnail} alt="" />
                                        <p>{item.title}</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>}
                    {voucher?.length > 0 && <div className="news_client">
                        <div className="news_client_top">
                            <h4> VOUCHER KHUYẾN MÃI</h4>
                            <Link to={"/news"}>Xem tất cả</Link>
                        </div>
                        <div className="news_client_main">
                            {loading
                                ? Array(3).fill(0).map((_, index) => (
                                    <div className="news_client_item" key={index}>
                                        <Skeleton.Image style={{ width: "100%", height: 150 }} active />
                                        <Skeleton active paragraph={{ rows: 2 }} title={false} />
                                    </div>
                                ))
                                : voucher.map(item => (
                                    <Link className="news_client_item" to={`/news/${item.slug}`} key={item.id}>
                                        <img src={item.thumbnail} alt="" />
                                        <p>{item.title}</p>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>}
                </>
            }
        </>

    )
}

export default NewsSection;