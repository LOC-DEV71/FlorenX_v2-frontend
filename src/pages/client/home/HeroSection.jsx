import "./HeroSection.scss";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import Link from "antd/es/typography/Link";

function HeroSection() {
  const settingState = useSelector((state) => state.setting);
  const setting = settingState?.settings;
  const loading = settingState?.loading;

  const sectionHeroSlider = setting?.section_hero_slider || [];

  const heroMain = sectionHeroSlider?.[0];
  return (
    <section className="hero_section">
      <div className="hero_container">
        {loading ? (
          <div className="hero_main hero_main-skeleton">
            <Skeleton.Node active style={{ width: "100%", height: 420 }} />
          </div>
        ) : (
          <div className="hero_main">
            <div className="hero_bg_glow hero_bg_glow-1" />
            <div className="hero_bg_glow hero_bg_glow-2" />

            <div className="hero_content">
              <span className="hero_badge">{setting?.websiteName}</span>
              <h1 className="hero_title">
                {heroMain?.title || "Hiệu năng mạnh mẽ cho mọi nhu cầu"}
              </h1>
              <p className="hero_desc">
                {heroMain?.description ||
                  "Laptop, PC và gear công nghệ với thiết kế hiện đại, cấu hình mạnh và ưu đãi tốt mỗi ngày."}
              </p>

              <div className="hero_actions">
                <Link className="hero_btn primary" href={heroMain?.link || "#"}>
                  Xem ngay
                </Link>
              </div>
            </div>

            <div className="hero_visual">
              <div className="hero_ring" />
              <div className="hero_laptop_wrap">
                <img
                  className="hero_laptop"
                  src={heroMain?.image}
                  alt={heroMain?.title || "Hero laptop"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;