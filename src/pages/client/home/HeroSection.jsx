import "./HeroSection.scss";
import { Carousel, Skeleton } from "antd";
import { useSelector } from "react-redux";
import Link from "antd/es/typography/Link";

function HeroSection() {
    const settingState = useSelector((state) => state.setting);
    const setting = settingState?.settings;
    const loading = settingState?.loading;

    const banner = setting?.section_hero || [];
    const sectionHeroSlider = setting?.section_hero_slider || [];

    const bannerBottom = banner.slice(0, 2);
    const bannerRight = banner.slice(2);

    return (
        <section className="hero_section">
            <div className="hero_grid">
                <div className="hero_grid-left">
                    <div className="top">
                        <Carousel arrows infinite={false} autoplay>
                            {loading ? (
                                <>
                                    <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                                </>
                            ) : (
                                sectionHeroSlider.map((item) => (
                                    <Link className="carousel_item" key={item._id}>
                                        <img src={item.image} alt={item.title || item.image} />
                                    </Link>
                                ))
                            )}
                        </Carousel>
                    </div>

                    <div className="bot">


                        {loading ? (
                            <>
                                <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                                <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                            </>
                        ) : (
                            bannerBottom.map((item) => (
                                <Link className="banner_item" key={item._id}>
                                    <img src={item.image} alt={item.title || ""} />
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="hero_grid-right">
                    {loading ? (
                        <>
                            <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                            <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                            <Skeleton.Node active style={{ width: "100%", height: 180 }} />
                        </>
                    ) : (
                        bannerRight.map((item) => (
                            <Link className="right_item" key={item._id}>
                                <img src={item.image} alt={item.title || ""} />
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;