import { useState } from "react";
import TinyEditor from "../../../utils/tinyEditor";
import "./create.products.scss";
import { Switch } from "antd";

function CreateProduct() {

  const [form, setForm] = useState({
    title: "",
    product_category_id: "",
    description: "",
    price: "",
    discountPercentage: "",
    stock: "",
    status: "active",
    featured: "",
    position: "",
    brand: "",
    specs: [{ key: "", value: "" }]
  });

  const addSpec = () => {
    setForm({
      ...form,
      specs: [...form.specs, { key: "", value: "" }]
    });
  };

  const removeSpec = (index) => {
    const newSpecs = form.specs.filter((_, i) => i !== index);

    setForm({
      ...form,
      specs: newSpecs
    });
  };

  const handleChangeSpec = (index, field, value) => {
    const newSpecs = [...form.specs];
    newSpecs[index][field] = value;

    setForm({
      ...form,
      specs: newSpecs
    });
  };

  console.log(form)

  return (
    <div className="create-product">

      <div className="page-header">
        <h2>Tạo sản phẩm mới</h2>
        <p>Thêm một sản phẩm có hiệu năng cao vào kho hàng.</p>
      </div>

      <div className="product-grid">

        {/* LEFT SIDE */}
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
                placeholder="e.g. ASUS ROG Strix RTX 4080"
              />
            </div>

            <div className="row">
              <div className="form-group">
                <label>Danh mục</label>
                <select>
                  <option>Chọn danh mục</option>
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
                  placeholder="ASUS, MSI, NVIDIA"
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
                  placeholder="1,2,3..."
                />
              </div>

              <div className="form-group">
                <label>Nổi bậc</label>
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Giá tiền (VND)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="Nhập giá"
                />
              </div>

              <div className="form-group">
                <label>Số lượng</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  placeholder="Nhập số lượng"
                />
              </div>

              <div className="form-group">
                <label>Giảm giá (%)</label>
                <input
                  type="number"
                  value={form.discountPercentage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountPercentage: e.target.value
                    })
                  }
                  placeholder="Nhập %"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả sản phẩm</label>
              <TinyEditor
                value={form.description}
                onChange={(content) =>
                  setForm({ ...form, description: content })
                }
              />
            </div>

            {/* SPECIFICATIONS */}

            <div className="specifications">
              <label>Thông số kỹ thuật</label>

              {form.specs.map((spec, index) => (
                <div className="spec-row" key={index}>

                  <input
                    type="text"
                    placeholder="Thuộc tính (VD: CPU)"
                    value={spec.key}
                    onChange={(e) =>
                      handleChangeSpec(index, "key", e.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Giá trị (VD: Ryzen 7)"
                    value={spec.value}
                    onChange={(e) =>
                      handleChangeSpec(index, "value", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => removeSpec(index)}
                  >
                    X
                  </button>

                </div>
              ))}

              <button
                type="button"
                className="add-spec"
                onClick={addSpec}
              >
                + Thêm thông số
              </button>

            </div>

          </div>

          {/* STATUS */}

          <div className="card visibility">
            <h3>Trạng thái sản phẩm</h3>

            <div className="toggle">
              <Switch
                defaultChecked
                onChange={(checked) => {
                  setForm({
                    ...form,
                    status: checked ? "active" : "inactive"
                  });
                }}
              />

              <span
                className={
                  form.status === "active" ? "active" : "inactive"
                }
              >
                {form.status === "active"
                  ? "Hoạt động"
                  : "Không hoạt động"}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="right">

          <div className="card">
            <h3>Product Images</h3>

            <div className="upload-box">
              <p>Drop your images here or browse</p>
            </div>

            <div className="preview-grid">

              <div className="image main">
                <span>MAIN</span>
                <img src="https://placehold.co/200" alt="" />
              </div>

              <div className="image">
                <img src="https://placehold.co/200" alt="" />
              </div>

              <div className="image">
                <img src="https://placehold.co/200" alt="" />
              </div>

              <div className="image add">
                +
              </div>

            </div>
          </div>

          <div className="card actions">
            <button className="create-btn">Create Product</button>
            <button className="cancel-btn">Cancel</button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateProduct;