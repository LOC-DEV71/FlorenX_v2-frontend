import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVoucherById, editVoucher } from "../../../services/admin/vouchers.admin.service";
import { success, error } from "../../../utils/notift";
import SEO from "../../../utils/SEO";
import "./VouchersAdmin.scss";

function VoucherUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVoucherById(id);
        const voucher = res.data.voucher;
        if (voucher) {
          // Format dates for input[type="datetime-local"]
          const formatToLocalDatetime = (isoString) => {
            if (!isoString) return "";
            const date = new Date(isoString);
            return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16);
          };

          setFormData({
            code: voucher.code || "",
            description: voucher.description || "",
            discountType: voucher.discountType || "fixed",
            discountValue: voucher.discountValue || 0,
            maxDiscount: voucher.maxDiscount || "",
            minOrderValue: voucher.minOrderValue || 0,
            quantity: voucher.quantity || 1,
            startDate: formatToLocalDatetime(voucher.startDate),
            endDate: formatToLocalDatetime(voucher.endDate),
            isActive: voucher.isActive !== undefined ? voucher.isActive : true,
          });
        }
      } catch (err) {
        error("Không tìm thấy Voucher.");
        navigate("/admin/vouchers");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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
    if (!payload.maxDiscount) payload.maxDiscount = null;
    if (!payload.startDate) payload.startDate = null;
    if (!payload.endDate) payload.endDate = null;

    try {
      setLoading(true);
      const res = await editVoucher(id, payload);
      if (res.data.code === 200) {
        success("Cập nhật mã giảm giá thành công!");
        navigate("/admin/vouchers");
      }
    } catch (err) {
      error(err.response?.data?.message || "Lỗi khi cập nhật mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;

  return (
    <div className="vouchers_admin">
      <SEO title="Chỉnh sửa Voucher" />
      <h2 className="vouchers_admin__title">Chỉnh Sửa Voucher</h2>
      
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
          {loading ? "Đang xử lý..." : "Cập Nhật Mã Giảm Giá"}
        </button>
      </form>
    </div>
  );
}

export default VoucherUpdate;
