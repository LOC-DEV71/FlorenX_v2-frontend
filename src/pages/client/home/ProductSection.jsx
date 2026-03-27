import { useSelector } from "react-redux";
import "./ProductSection.scss";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
function ProductSection() {
    const loading = useSelector(state => state.setting.loading);
    const section = useSelector(state => state.setting.settings?.section_hero);
    return (
        <div className="product_section" id="products">
            {section?.map((item) => (
                <HashLink
                    className="product_section_item"
                    to={`/${item.link}/${item.tag}`}
                    key={item._id}
                    smooth
                >
                    <img src={item.image} alt="" />

                    <div className="content">
                        <h3>{item?.title}</h3>
                        <p>{item?.desc}</p>
                    </div>
                </HashLink>
            ))}
        </div>
    )
}

export default ProductSection