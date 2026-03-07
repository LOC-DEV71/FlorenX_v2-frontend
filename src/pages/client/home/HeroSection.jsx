import { Link } from "react-router-dom";
import banner from "../../../assets/banner/banner2.png";
import "./HeroSection.scss";
import TypingAnimation from "../../../utils/typing-animation";

function HeroSection(){
    return (
        <div className="hero_section">
            <div className="hero_section_left">
                <div className="hero_section_left-top">
                    <p className="title">CÔNG NGHỆ TƯƠNG LAI</p>
                    <h1>
                        <TypingAnimation title={`Nâng Tầm Trải Nghiệm Kỹ Thuật Số Của Bạn`}/>
                    </h1>
                    <p>Giải phóng hiệu năng tối đa với phần cứng thế hệ mới của chúng tôi. Được thiết kế dành cho người sáng tạo, game thủ và những người có tầm nhìn.</p>
                </div>
                <div className="hero_section_left-bot" >
                    <Link>Bắt đầu mua hàng</Link>
                </div>
            </div>
            <div className="hero_section_right">
                <img src={banner} alt="" />
            </div>
        </div>
    )
}

export default HeroSection