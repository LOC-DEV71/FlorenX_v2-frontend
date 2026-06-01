import { useState, useEffect } from "react";
import TinyEditor from "../../../utils/tinyEditor";
import "./create.update.products.scss";
import { Switch } from "antd";
import { updateProduct, getProductBySlug } from "../../../services/admin/product.admin.service";
import SEO from "../../../utils/SEO";
import { error, success } from "../../../utils/notift";
import { useNavigate, useParams } from "react-router-dom";
import { getListCategory } from "../../../services/admin/product.category.admin";
import { renderCategoryOptions } from "../../../utils/buildTree";
import LoadingOverlay from "../../../utils/LoadingOverlay";
import { RiAddLine, RiCloseLine, RiSaveLine, RiUpload2Line, RiImageLine, RiLayoutGridLine, RiPriceTag3Line, RiStarLine, RiToggleLine } from "react-icons/ri";

function UpdateProduct() {

    const navigate = useNavigate();
    const { slug } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        discountPercentage: "",
        status: "active",
        position: "",
        brand: "",
        featured: "no",
        product_category_id: ""
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        try {
            const fetchApi = async () => {
                const res = await getListCategory();
                if (res.data.code) {
                    setCategories(res.data.categories)
                }
            }
            fetchApi();
        } catch (err) {
            console.error(err.response?.data.message)
        }
    }, [])

    const [specs, setSpecs] = useState([
        { key: "", value: "" }
    ]);

    // LOAD PRODUCT

    useEffect(() => {
        const fetchProduct = async () => {
            try {

                const res = await getProductBySlug(slug);

                if (res.data.code) {

                    const product = res.data.data;

                    setForm({
                        title: product.title || "",
                        description: product.description || "",
                        price: product.price || "",
                        discountPercentage: product.discountPercentage || "",
                        status: product.status || "active",
                        position: product.position || "",
                        brand: product.brand || "",
                        featured: product.featured || "no",
                        product_category_id: product.product_category_id || ""
                    });

                    setThumbnailPreview(product.thumbnail);

                    if (product.images) {
                        setImagesPreview(product.images);
                    }

                    if (product.specs) {

                        const specArray = Object.keys(product.specs).map(key => ({
                            key,
                            value: product.specs[key]
                        }));

                        setSpecs(specArray);
                    }

                }

            } catch (err) {
                console.log(err);
            }
        };

        fetchProduct();

    }, [slug]);

    // SPECS

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }]);
    };

    const removeSpec = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const handleChangeSpec = (index, field, value) => {
        const clone = [...specs];
        clone[index][field] = value;
        setSpecs(clone);
    };

    // IMAGES

    const handleImagesChange = (e) => {

        const files = Array.from(e.target.files);

        const newImages = [...images, ...files];

        const newPreview = [
            ...imagesPreview,
            ...files.map(file => URL.createObjectURL(file))
        ];

        setImages(newImages);
        setImagesPreview(newPreview);

    };

    const removeImage = (index) => {

        const newImages = images.filter((_, i) => i !== index);
        const newPreview = imagesPreview.filter((_, i) => i !== index);

        setImages(newImages);
        setImagesPreview(newPreview);

    };

    // SUBMIT

    const handleSubmit = async () => {

        try {
            setLoading(true)
            const formData = new FormData();

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            images.forEach(img => {
                formData.append("images", img);
            });

            const specsObject = {};

            specs.forEach(item => {
                if (item.key && item.value) {
                    specsObject[item.key] = item.value;
                }
            });

            formData.append("specs", JSON.stringify(specsObject));

            const res = await updateProduct(slug, formData);

            if (res.data.code) {

                success(res.data.message);
                navigate(`/admin/products/detail/${slug}`);

            } else {
                error(res.data.message);
            }

        } catch (err) {
            console.log(err);
        } finally{
            setLoading(false)
        }

    };

    return (
    <div className="product-form">
      {loading && <LoadingOverlay title="Đang cập nhật sản phẩm" />}
      <SEO title="Cập nhật sản phẩm" />
 
      <div className="pf-header">
        <h2>Cập nhật sản phẩm</h2>
        <p>Chỉnh sửa thông tin sản phẩm.</p>
      </div>
 
      <div className="pf-grid">
 
        <div className="pf-left">
 
          <div className="pf-card">
            <div className="pf-card__head">
              <RiLayoutGridLine />
              <span>Thông tin chung</span>
            </div>
            <div className="pf-card__body">
 
              <div className="fg">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
 
              <div className="pf-row3">
                <div className="fg">
                  <label>Danh mục</label>
                  <select
                    value={form.product_category_id}
                    onChange={(e) => setForm({ ...form, product_category_id: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {renderCategoryOptions(categories)}
                  </select>
                </div>
                <div className="fg">
                  <label>Thương hiệu</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
                <div className="fg">
                  <label>Giảm giá (%)</label>
                  <input
                    type="number"
                    value={form.discountPercentage}
                    onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                  />
                </div>
              </div>
 
              <div className="pf-row2">
                <div className="fg">
                  <label>Vị trí</label>
                  <input
                    type="number"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>
                <div className="fg">
                  <label>Giá (₫)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>
 
              <div className="fg">
                <label>Mô tả</label>
                <TinyEditor
                  value={form.description}
                  onChange={(content) => setForm({ ...form, description: content })}
                />
              </div>
 
            </div>
          </div>
 
          <div className="pf-card">
            <div className="pf-card__head">
              <RiPriceTag3Line />
              <span>Thông số kỹ thuật</span>
            </div>
            <div className="pf-card__body">
              {specs.map((spec, index) => (
                <div className="spec-row" key={index}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) => handleChangeSpec(index, "key", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleChangeSpec(index, "value", e.target.value)}
                  />
                  <button className="spec-rm" type="button" onClick={() => removeSpec(index)}>
                    <RiCloseLine />
                  </button>
                </div>
              ))}
              <button className="spec-add" type="button" onClick={addSpec}>
                <RiAddLine />
                Thêm thông số
              </button>
            </div>
          </div>
 
          <div className="pf-toggles">
            <div className="pf-card">
              <div className="pf-card__head">
                <RiToggleLine />
                <span>Trạng thái</span>
              </div>
              <div className="pf-card__body">
                <div className="toggle-row">
                  <Switch
                    checked={form.status === "active"}
                    onChange={(checked) => setForm({ ...form, status: checked ? "active" : "inactive" })}
                  />
                  <span className={`status-badge ${form.status}`}>
                    {form.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
 
            <div className="pf-card">
              <div className="pf-card__head">
                <RiStarLine />
                <span>Nổi bật</span>
              </div>
              <div className="pf-card__body">
                <div className="toggle-row">
                  <Switch
                    checked={form.featured === "yes"}
                    onChange={(checked) => setForm({ ...form, featured: checked ? "yes" : "no" })}
                  />
                  <span className={`status-badge ${form.featured === "yes" ? "featured" : "not-featured"}`}>
                    {form.featured === "yes" ? "Nổi bật" : "Không nổi bật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
 
        </div>
 
        <div className="pf-right">
 
          <div className="pf-card">
            <div className="pf-card__head">
              <RiImageLine />
              <span>Hình ảnh sản phẩm</span>
            </div>
            <div className="pf-card__body">
 
              <label htmlFor="thumbnail" className="upload-zone">
                <RiUpload2Line className="upload-icon" />
                <p>Ảnh chính <span>(thumbnail)</span></p>
                <div className="upload-btn">
                  <RiUpload2Line />
                  Chọn ảnh
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="thumbnail"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setThumbnail(file);
                    setThumbnailPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
 
              <label htmlFor="images" className="upload-zone">
                <RiImageLine className="upload-icon" />
                <p>Ảnh phụ <span>(nhiều ảnh)</span></p>
                <div className="upload-btn">
                  <RiUpload2Line />
                  Chọn ảnh
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="images"
                  onChange={handleImagesChange}
                />
              </label>
 
              <div className="preview-grid">
                <div className="preview-img main">
                  <img src={thumbnailPreview || "https://placehold.co/400x300/E2E8F0/94A3B8?text=Main"} alt="" />
                  <span className="badge-main">MAIN</span>
                </div>
                {imagesPreview.map((img, index) => (
                  <div className="preview-img" key={index}>
                    <img src={img} alt="" />
                    <button className="img-remove" type="button" onClick={() => removeImage(index)}>
                      <RiCloseLine />
                    </button>
                  </div>
                ))}
              </div>
 
            </div>
          </div>
 
          <div className="pf-card pf-actions">
            <button className="btn-submit" onClick={handleSubmit}>
              <RiSaveLine />
              Lưu thay đổi
            </button>
            <button className="btn-cancel" onClick={() => navigate("/admin/products")}>Huỷ</button>
          </div>
 
        </div>
 
      </div>
    </div>
  );
}

export default UpdateProduct;