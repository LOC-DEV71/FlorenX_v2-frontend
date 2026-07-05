import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVoucher } from "../../../services/admin/vouchers.admin.service";
import { success, error } from "../../../utils/notift";
import SEO from "../../../utils/SEO";
import "./VouchersAdmin.scss";

function VoucherCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "fixed",
    discountValue: 0,
    maxDiscount: "",
    minOrderValue: 0,
    quantity: 1,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue <= 0 || formData.quantity <= 0) {
      error("Vui lòng điền đầy đủ và đúng định dạng các trường bắt buộc.");
      return;
    }
    
    // Convert to Date objects or null if empty
    const payload = { ...formData };
    if (!payload.maxDiscount) delete payload.maxDiscount;
    if (!payload.startDate) delete payload.startDate;
    if (!payload.endDate) delete payload.endDate;

    try {
      setLoading(true);
      const res = await createVoucher(payload);
      if (res.data.code === 200) {
        success("Tạo mã giảm giá thành công!");
        navigate("/admin/vouchers");
      }
    } catch (err) {
      error(err.response?.data?.message || "Lỗi khi tạo mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vouchers_admin">
      <SEO title="Thêm mới Voucher" />
      <h2 className="vouchers_admin__title">Thêm Mới Voucher</h2>
      
      <form className="voucher-form" onSubmit={handleSubmit}>
        <div className="voucher-form__group">
          <label>Mã Code (Bắt buộc) *</label>
          <input 
            type="text" 
            name="code" 
            placeholder="Ví dụ: FLORENX10K" 
            value={formData.code}
            onChange={handleChange}
            required
            style={{ textTransform: "uppercase" }}
          />
        </div>

        <div className="voucher-form__group">
          <label>Mô tả chi tiết</label>
          <textarea 
            name="description" 
            rows={3} 
            placeholder="Giảm 10K cho đơn hàng..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div className="voucher-form__group" style={{ flex: 1 }}>
            <label>Loại giảm giá</label>
            <select name="discountType" value={formData.discountType} onChange={handleChange}>
              <option value="fixed">Giảm số tiền cố định (đ)</option>
              <option value="percentage">Giảm theo phần trăm (%)</option>
            </select>
          </div>

          <div className="voucher-form__group" style={{ flex: 1 }}>
            <label>Giá trị giảm *</label>
            <input 
              type="number" 
              name="discountValue" 
              min="1" 
              value={formData.discountValue}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div className="voucher-form__group" style={{ flex: 1 }}>
            <label>Giá trị đơn hàng tối thiểu (đ)</label>
            <input 
              type="number" 
              name="minOrderValue" 
              min="0" 
              value={formData.minOrderValue}
              onChange={handleChange}
            />
          </div>

          {formData.discountType === "percentage" && (
            <div className="voucher-form__group" style={{ flex: 1 }}>
              <label>Giảm tối đa (đ)</label>
              <input 
                type="number" 
                name="maxDiscount" 
                min="0" 
                placeholder="Để trống nếu không giới hạn"
                value={formData.maxDiscount}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <div className="voucher-form__group">
          <label>Số lượng mã *</label>
          <input 
            type="number" 
            name="quantity" 
            min="1" 
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div className="voucher-form__group" style={{ flex: 1 }}>
            <label>Ngày bắt đầu</label>
            <input 
              type="datetime-local" 
              name="startDate" 
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="voucher-form__group" style={{ flex: 1 }}>
            <label>Ngày kết thúc</label>
            <input 
              type="datetime-local" 
              name="endDate" 
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="voucher-form__group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input 
            type="checkbox" 
            id="isActive" 
            name="isActive" 
            checked={formData.isActive}
            onChange={handleChange}
            style={{ width: "auto" }}
          />
          <label htmlFor="isActive" style={{ margin: 0 }}>Kích hoạt Voucher này</label>
        </div>

        <button type="submit" className="voucher-form__submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Tạo Mã Giảm Giá"}
        </button>
      </form>
    </div>
  );
}

export default VoucherCreate;
