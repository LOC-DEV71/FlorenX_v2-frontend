import { useEffect, useRef, useState } from "react";
import "./NewProduct.scss";
import heroVideo from "../../../assets/banner/product.mp4";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AutoVideoSection({
  src,
  title,
  desc,
  tag = "CÔNG NGHỆ NỔI BẬT",
  tagClassName = "",
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.25,
      }
    );

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    observer.observe(section);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleToggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <>
      <section className="product-intro" >
        <div className="product-intro__container">
          <div className="product-intro__heading product-intro__heading--center">
            <span className={`product-intro__tag ${tagClassName}`.trim()}>
              {tag}
            </span>

            <h2 className="product-intro__title">{title}</h2>

            <p className="product-intro__desc">{desc}</p>
          </div>
        </div>
      </section>

      <section ref={sectionRef} className="bottom-video-section">
        <video
          ref={videoRef}
          className="bottom-video-section__video"
          src={src}
          muted
          playsInline
          loop
          preload="none"
        />

        <button
          className="bottom-video-section__toggle"
          onClick={handleToggleVideo}
          type="button"
        >
          <span className="bottom-video-section__toggle-icon">
            {isPlaying ? "❚❚" : "▶"}
          </span>
          <span className="bottom-video-section__toggle-text">
            {isPlaying ? "Dừng" : "Phát"}
          </span>
        </button>
      </section>
    </>
  );
}

function NewProduct() {
  const heroSectionRef = useRef(null);
  const heroVideoRef = useRef(null);
  
  const settings = useSelector((state) => state.setting.settings);
  const salePageData = settings?.sale_page || [];
  const heroData = salePageData.find(item => item.type === "hero");
  const sectionData = salePageData.filter(item => item.type === "section");

  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const [hasHeroPlayedOnce, setHasHeroPlayedOnce] = useState(false);

  useEffect(() => {
    const section = heroSectionRef.current;
    const video = heroVideoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasHeroPlayedOnce) {
          video.play().catch(() => {});
          setHasHeroPlayedOnce(true);
        }
      },
      {
        threshold: 0.6,
      }
    );

    const handlePlay = () => setIsHeroPlaying(true);
    const handlePause = () => setIsHeroPlaying(false);
    const handleEnded = () => setIsHeroPlaying(false);

    observer.observe(section);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [hasHeroPlayedOnce]);

  const handleToggleHeroVideo = () => {
    const video = heroVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <>
      <section ref={heroSectionRef} className="child-hero" >
        <video
          ref={heroVideoRef}
          className="child-hero__video"
          src={heroData?.mediaUrl || heroVideo}
          muted
          playsInline
          preload="metadata"
          id="hero-video"
        />

        <div className="child-hero__overlay" />
        <div className="child-hero__text" style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2, textAlign: "center", color: "#fff", width: "100%", padding: "0 20px", pointerEvents: "none" }}>
          {heroData?.tag && <h4 style={{ color: "#22c55e", letterSpacing: "2px", marginBottom: "10px", fontSize: "18px", fontWeight: 700 }}>{heroData.tag}</h4>}
          {heroData?.title && <h1 style={{ fontSize: "clamp(32px, 5vw, 64px)", margin: 0, fontWeight: 800, textTransform: "uppercase" }}>{heroData.title}</h1>}
        </div>

        <div className="child-hero__actions">
          <HashLink smooth to={"/products/new-product/laptop-gaming/#description-product"} className="child-hero__action child-hero__action--outline">
            Xem ngay
          </HashLink>

          <Link to={heroData?.link || "/products/detail/laptop-gaming-veltrix-gear-v10"} className="child-hero__action child-hero__action--filled">
            Mua ngay
          </Link>
        </div>

        <button
          className="child-hero__toggle"
          onClick={handleToggleHeroVideo}
          type="button"
        >
          <span className="child-hero__toggle-icon">
            {isHeroPlaying ? "❚❚" : "▶"}
          </span>
          <span className="child-hero__toggle-text">
            {isHeroPlaying ? "Dừng" : "Phát"}
          </span>
        </button>
      </section>

      {sectionData.length > 0 ? (
        sectionData.map((item, idx) => (
          <AutoVideoSection
            key={idx}
            id={idx === 0 ? "description-product" : undefined}
            src={item.mediaUrl}
            title={item.title}
            desc={item.desc}
            tag={item.tag}
            tagClassName={item.tagClassName}
          />
        ))
      ) : (
        <AutoVideoSection
          id="description-product"
          src="https://assets2.razerzone.com/images/pnx.assets/7c84f6a15d392b71522e621e35d8e842/blade16-2026-nvidia-1920x700.mp4"
          title="Up to NVIDIA® GeForce RTX™ 5090 Laptop GPU"
          desc="Sức mạnh đồ họa thế hệ mới từ NVIDIA mang lại hiệu năng vượt trội cho gaming, sáng tạo nội dung và xử lý AI. RTX 5090 Laptop GPU nâng tầm trải nghiệm với Ray Tracing chân thực, DLSS AI và khả năng xử lý mạnh mẽ trong mọi tác vụ."
        />
      )}
    </>
  );
}

export default NewProduct;