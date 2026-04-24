import { useState } from "react";
import TinyEditor from "../../../utils/tinyEditor";
import "./create.update.products.scss";
import { Switch } from "antd";
import { createProduct } from "../../../services/admin/product.admin.service";
import SEO from "../../../utils/SEO";
import { error, success } from "../../../utils/notift";
import { useNavigate } from "react-router-dom";
import { getListCategory } from "../../../services/admin/product.category.admin";
import { useEffect } from "react";
import { renderCategoryOptions } from "../../../utils/buildTree";

function CreateProduct() {
  const navigate = useNavigate();
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

  // SPEC STATE RIÊNG
  const [specs, setSpecs] = useState([
    { key: "", value: "" }
  ]);

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

  console.log(specs)

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = [...images, ...files];

    const newPreview = [
      ...imagesPreview,
      ...files.map((file) => URL.createObjectURL(file))
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

  const handleSubmit = async () => {
    try {

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
        console.log(item)
        if (item.key && item.value) {
          specsObject[item.key] = item.value;
        }
      });


      formData.append("specs", JSON.stringify(specsObject));

      const res = await createProduct(formData);

      if (res.data.code) {
        success(res.data.message)
        const newSlug = res.data.slug;
        setForm({
          title: "",
          description: "",
          price: "",
          discountPercentage: "",
          status: "active",
          position: "",
          brand: "",
          featured: "no",
          product_category_id: ""
        })
        navigate(`/admin/products/${newSlug}`)
      } 
    } catch (err) {
      error(err.response?.data.message);
    }
  };

  return (
    <div className="create-product">
      <SEO title="Tạo sản phẩm mới" />
      <div className="page-header">
        <p class="eyebrow">Veltrix Gear</p>
        <h2>Tạo sản phẩm mới</h2>
        <p>Thêm một sản phẩm vào hệ thống.</p>
      </div>

      <div className="product-grid">

        {/* LEFT */}

        <div className="left">

          <div className="card">
            <h3>Thông tin chung</h3>

            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div className="row">

              <div className="form-group">
                <label>Danh mục</label>
                <select
                  value={form.product_category_id}
                  onChange={e => setForm({ ...form, product_category_id: e.target.value })}
                >
                  <option value="">-- Chọn danh mục cha --</option>
                  {renderCategoryOptions(categories)}
                </select>
              </div>

              <div className="form-group">
                <label>Thương hiệu</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) =>
                    setForm({ ...form, brand: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Giảm giá</label>
                <input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    setForm({ ...form, discountPercentage: e.target.value })
                  }
                />
              </div>

            </div>

            <div className="row">

              <div className="form-group">
                <label>Vị trí</label>
                <input
                  type="number"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })

                  }
                  placeholder="Có thể không nhập tự động + 1"
                />
              </div>

              <div className="form-group">
                <label>Giá</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </div>

            </div>

            <div className="form-group">
              <label>Mô tả</label>

              <TinyEditor
                value={form.description}
                onChange={(content) =>
                  setForm({ ...form, description: content })
                }
              />
            </div>

            {/* SPECS */}

            <div className="specifications">

              <label>Thông số</label>

              {specs.map((spec, index) => (

                <div className="spec-row" key={index}>

                  <input
                    type="text"
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) =>
                      handleChangeSpec(index, "key", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) =>
                      handleChangeSpec(index, "value", e.target.value)
                    }
                  />

                  <button
                    onClick={() => removeSpec(index)}
                    type="button"
                  >
                    X
                  </button>

                </div>

              ))}

              <button onClick={addSpec} type="button">
                + Thêm
              </button>

            </div>

            <div className="card">

              <h3>Sản phẩm nổi bậc</h3>

              <div className="toggle">

                <Switch
                  // defaultChecked
                  onChange={(checked) =>
                    setForm({
                      ...form,
                      featured: checked ? "yes" : "no"
                    })
                  }
                />

                <span
                  className={
                    form.featured === "no"
                      ? "no"
                      : "yes"
                  }
                >
                  {form.featured === "yes" ? "Nổi bậc" : "Không nổi bậc"}
                </span>

              </div>

            </div>


          </div>

          <div className="card">

            <h3>Trạng thái</h3>

            <div className="toggle">

              <Switch
                defaultChecked
                onChange={(checked) =>
                  setForm({
                    ...form,
                    status: checked ? "active" : "inactive"
                  })
                }
              />

              <span
                className={
                  form.status === "active"
                    ? "active"
                    : "inactive"
                }
              >
                {form.status}
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="right">

          <div className="card">

            <h3>Product Images</h3>

            <div className="upload-box">
              <label htmlFor="thumbnail">Ảnh chính</label>

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

            </div>

            <div className="upload-box">

              <label htmlFor="images">Ảnh phụ</label>

              <input
                type="file"
                accept="image/*"
                multiple
                id="images"
                onChange={handleImagesChange}
              />

            </div>

            <div className="preview-grid">

              <div className="image main">

                <span>MAIN</span>

                {thumbnailPreview
                  ? <img src={thumbnailPreview} alt="" />
                  : <img src="https://placehold.co/200" alt="" />}

              </div>

              {imagesPreview.map((img, index) => (

                <div className="image" key={index}>

                  <img src={img} alt="" />

                  <button
                    className="remove"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>

                </div>

              ))}

            </div>

          </div>

          <div className="card actions">

            <button
              className="create-btn"
              onClick={handleSubmit}
            >
              Create Product
            </button>

            <button className="cancel-btn">
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateProduct;