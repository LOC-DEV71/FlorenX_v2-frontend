import { useEffect, useRef, useState } from "react";
import "./NewProduct.scss";
import heroVideo from "../../../assets/banner/product.mp4";
import { HashLink } from "react-router-hash-link";

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
      <section className="product-intro">
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
      <section ref={heroSectionRef} className="child-hero" id="child-hero">
        <video
          ref={heroVideoRef}
          className="child-hero__video"
          src={heroVideo}
          muted
          playsInline
          preload="metadata"
        />

        <div className="child-hero__overlay" />

        <div className="child-hero__actions">
          <button className="child-hero__action child-hero__action--outline">
            Xem ngay
          </button>

          <button className="child-hero__action child-hero__action--filled">
            Mua ngay
          </button>
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

      <AutoVideoSection
        src="https://assets2.razerzone.com/images/pnx.assets/7c84f6a15d392b71522e621e35d8e842/blade16-2026-nvidia-1920x700.mp4"
        title="Up to NVIDIA® GeForce RTX™ 5090 Laptop GPU"
        desc="Sức mạnh đồ họa thế hệ mới từ NVIDIA mang lại hiệu năng vượt trội cho gaming, sáng tạo nội dung và xử lý AI. RTX 5090 Laptop GPU nâng tầm trải nghiệm với Ray Tracing chân thực, DLSS AI và khả năng xử lý mạnh mẽ trong mọi tác vụ."
      />

      <AutoVideoSection
        src="https://assets2.razerzone.com/images/pnx.assets/55f74e2d1ce95c5d403775b7b8d551d2/blade16-2026-intel-1920x700.mp4"
        title="Next-Gen Intel® Core™ Ultra 9 Processor"
        desc="Trang bị Intel® Core™ Ultra 9 thế hệ mới, mang lại hiệu năng vượt trội cho đa nhiệm, xử lý AI và các tác vụ chuyên sâu. Kiến trúc tối ưu giúp cân bằng giữa sức mạnh và hiệu quả năng lượng, đem đến trải nghiệm mượt mà từ gaming đến sáng tạo nội dung."
        tagClassName="blue"
      />

      <AutoVideoSection
        src="https://assets2.razerzone.com/images/pnx.assets/25bd4d690a204ac6c9f408d1c63c06e0/blade16-2026-oled-1920x700.mp4"
        title="MÀN HÌNH OLED TUYỆT ĐẸP"
        desc="Đắm chìm hoàn toàn vào thế giới game và phim ảnh ở bất cứ đâu với màn hình OLED VESA DisplayHDR TrueBlack 1000, mang đến hình ảnh QHD sắc nét, tần số quét 240 Hz mượt mà và thời gian phản hồi 0.2 ms."
        tagClassName="blue"
      />
    </>
  );
}

export default NewProduct;