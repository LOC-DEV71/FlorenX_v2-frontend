import React, { useEffect, useState } from "react";
import "./SettingPage.scss";
import settingService from "../../../services/admin/setting.service";
import { confirm, error, success } from "../../../utils/notift";

const SettingPage = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    websiteName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",

    themeColor: "blue",
    themeMode: "light",

    postPerPage: 10,
    autoApprovePost: false,
    showFeaturedPost: false,

    sessionTimeout: 60,
    twoFactorAuth: false,
    strangeLoginAlert: false,

    saleBannerIsActive: false,
    saleBannerTitle: "",
    saleBannerShortDescription: "",
    saleBannerDiscountText: "",
    saleBannerRedirectLink: "",
    saleBannerStartDate: "",
    saleBannerEndDate: "",

    logoPreview: "",
    faviconPreview: "",
    bannerDesktopPreview: "",
    bannerMobilePreview: ""
  });

  const [files, setFiles] = useState({
    logo: null,
    favicon: null,
    bannerDesktop: null,
    bannerMobile: null
  });

  const fetchSetting = async () => {
    try {
      setLoading(true);
      const res = await settingService.getDetail();
      const data = res?.data;

      if (!data) return;

      setForm({
        websiteName: data.websiteName || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        address: data.address || "",

        themeColor: data.themeColor || "blue",
        themeMode: data.themeMode || "light",

        postPerPage: data.postPerPage || 10,
        autoApprovePost: data.autoApprovePost || false,
        showFeaturedPost: data.showFeaturedPost || false,

        sessionTimeout: data.sessionTimeout || 60,
        twoFactorAuth: data.twoFactorAuth || false,
        strangeLoginAlert: data.strangeLoginAlert || false,

        saleBannerIsActive: data.saleBanner?.isActive || false,
        saleBannerTitle: data.saleBanner?.title || "",
        saleBannerShortDescription: data.saleBanner?.shortDescription || "",
        saleBannerDiscountText: data.saleBanner?.discountText || "",
        saleBannerRedirectLink: data.saleBanner?.redirectLink || "",
        saleBannerStartDate: data.saleBanner?.startDate
          ? new Date(data.saleBanner.startDate).toISOString().split("T")[0]
          : "",
        saleBannerEndDate: data.saleBanner?.endDate
          ? new Date(data.saleBanner.endDate).toISOString().split("T")[0]
          : "",

        logoPreview: data.logo || "",
        faviconPreview: data.favicon || "",
        bannerDesktopPreview: data.saleBanner?.desktopImage || "",
        bannerMobilePreview: data.saleBanner?.mobileImage || ""
      });
    } catch (err) {
      console.error("Lỗi lấy settings:", err);
      error("Không thể tải dữ liệu cài đặt!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleColorChange = (color) => {
    setForm((prev) => ({
      ...prev,
      themeColor: color
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    const file = inputFiles?.[0];
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [name]: file
    }));

    const previewUrl = URL.createObjectURL(file);

    if (name === "logo") {
      setForm((prev) => ({ ...prev, logoPreview: previewUrl }));
    }
    if (name === "favicon") {
      setForm((prev) => ({ ...prev, faviconPreview: previewUrl }));
    }
    if (name === "bannerDesktop") {
      setForm((prev) => ({ ...prev, bannerDesktopPreview: previewUrl }));
    }
    if (name === "bannerMobile") {
      setForm((prev) => ({ ...prev, bannerMobilePreview: previewUrl }));
    }
  };

  const handleSubmit = async () => {
    const isConfirm = await confirm("Bạn có chắc muốn lưu thay đổi cài đặt không?");
    if (!isConfirm) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("websiteName", form.websiteName);
      formData.append("contactEmail", form.contactEmail);
      formData.append("contactPhone", form.contactPhone);
      formData.append("address", form.address);

      formData.append("themeColor", form.themeColor);
      formData.append("themeMode", form.themeMode);

      formData.append("postPerPage", form.postPerPage);
      formData.append("autoApprovePost", form.autoApprovePost);
      formData.append("showFeaturedPost", form.showFeaturedPost);

      formData.append("sessionTimeout", form.sessionTimeout);
      formData.append("twoFactorAuth", form.twoFactorAuth);
      formData.append("strangeLoginAlert", form.strangeLoginAlert);

      formData.append("saleBannerIsActive", form.saleBannerIsActive);
      formData.append("saleBannerTitle", form.saleBannerTitle);
      formData.append(
        "saleBannerShortDescription",
        form.saleBannerShortDescription
      );
      formData.append("saleBannerDiscountText", form.saleBannerDiscountText);
      formData.append("saleBannerRedirectLink", form.saleBannerRedirectLink);
      formData.append("saleBannerStartDate", form.saleBannerStartDate);
      formData.append("saleBannerEndDate", form.saleBannerEndDate);

      if (files.logo) {
        formData.append("logo", files.logo);
      }
      if (files.favicon) {
        formData.append("favicon", files.favicon);
      }
      if (files.bannerDesktop) {
        formData.append("bannerDesktop", files.bannerDesktop);
      }
      if (files.bannerMobile) {
        formData.append("bannerMobile", files.bannerMobile);
      }

      const res = await settingService.update(formData);
      console.log("Cập nhật thành công:", res);

      success("Lưu cài đặt thành công!");
      await fetchSetting();
    } catch (err) {
      console.error("Lỗi cập nhật settings:", err);
      error(err?.response?.data?.message || "Cập nhật cài đặt thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setting-page">
      <div className="page-header">
        <div>
          <h2>Cài đặt hệ thống</h2>
          <p>Thiết lập giao diện và thông tin chung cho trang quản trị</p>
        </div>
        <button className="save-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="setting-grid">
        <div className="setting-card">
          <h3>Thông tin website</h3>

          <div className="form-group">
            <label>Tên website</label>
            <input
              type="text"
              name="websiteName"
              value={form.websiteName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email liên hệ</label>
            <input
              type="text"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>

        <div className="setting-card">
          <h3>Giao diện</h3>

          <div className="form-group">
            <label>Màu chủ đạo</label>
            <div className="color-list">
              {["blue", "green", "orange", "purple"].map((color) => (
                <span
                  key={color}
                  className={`color-item ${color} ${
                    form.themeColor === color ? "active" : ""
                  }`}
                  onClick={() => handleColorChange(color)}
                ></span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Chế độ giao diện</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="themeMode"
                  value="light"
                  checked={form.themeMode === "light"}
                  onChange={handleChange}
                />
                Sáng
              </label>
              <label>
                <input
                  type="radio"
                  name="themeMode"
                  value="dark"
                  checked={form.themeMode === "dark"}
                  onChange={handleChange}
                />
                Tối
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Logo</label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.logoPreview && (
              <img
                src={form.logoPreview}
                alt="logo"
                style={{ width: 120, marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Favicon</label>
            <input
              type="file"
              name="favicon"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.faviconPreview && (
              <img
                src={form.faviconPreview}
                alt="favicon"
                style={{ width: 50, marginTop: 8 }}
              />
            )}
          </div>
        </div>

        <div className="setting-card">
          <h3>Cấu hình bài viết</h3>

          <div className="form-group">
            <label>Số bài viết mỗi trang</label>
            <input
              type="number"
              name="postPerPage"
              value={form.postPerPage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Duyệt bài tự động</label>
            <div className="switch-row">
              <input
                type="checkbox"
                name="autoApprovePost"
                checked={form.autoApprovePost}
                onChange={handleChange}
              />
              <span>{form.autoApprovePost ? "Đang bật" : "Đang tắt"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Hiển thị bài nổi bật</label>
            <div className="switch-row">
              <input
                type="checkbox"
                name="showFeaturedPost"
                checked={form.showFeaturedPost}
                onChange={handleChange}
              />
              <span>{form.showFeaturedPost ? "Đang bật" : "Đang tắt"}</span>
            </div>
          </div>
        </div>

        <div className="setting-card">
          <h3>Bảo mật</h3>

          <div className="form-group">
            <label>Thời gian hết phiên đăng nhập</label>
            <select
              name="sessionTimeout"
              value={form.sessionTimeout}
              onChange={handleChange}
            >
              <option value="30">30 phút</option>
              <option value="60">60 phút</option>
              <option value="120">120 phút</option>
            </select>
          </div>

          <div className="form-group">
            <label>Xác thực 2 bước</label>
            <div className="switch-row">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={form.twoFactorAuth}
                onChange={handleChange}
              />
              <span>{form.twoFactorAuth ? "Đang bật" : "Đang tắt"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Thông báo đăng nhập lạ</label>
            <div className="switch-row">
              <input
                type="checkbox"
                name="strangeLoginAlert"
                checked={form.strangeLoginAlert}
                onChange={handleChange}
              />
              <span>{form.strangeLoginAlert ? "Đang bật" : "Đang tắt"}</span>
            </div>
          </div>
        </div>

        <div className="setting-card banner-setting-card">
          <h3>Cài đặt banner sale</h3>

          <div className="form-group">
            <label>Bật banner sale</label>
            <div className="switch-row">
              <input
                type="checkbox"
                name="saleBannerIsActive"
                checked={form.saleBannerIsActive}
                onChange={handleChange}
              />
              <span>{form.saleBannerIsActive ? "Đang bật" : "Đang tắt"}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Tiêu đề banner</label>
            <input
              type="text"
              name="saleBannerTitle"
              value={form.saleBannerTitle}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mô tả ngắn</label>
            <textarea
              rows="3"
              name="saleBannerShortDescription"
              value={form.saleBannerShortDescription}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phần trăm giảm giá nổi bật</label>
            <input
              type="text"
              name="saleBannerDiscountText"
              value={form.saleBannerDiscountText}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Link điều hướng</label>
            <input
              type="text"
              name="saleBannerRedirectLink"
              value={form.saleBannerRedirectLink}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Ảnh desktop banner</label>
            <input
              type="file"
              name="bannerDesktop"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.bannerDesktopPreview && (
              <img
                src={form.bannerDesktopPreview}
                alt="banner desktop"
                style={{ width: 160, marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Ảnh mobile banner</label>
            <input
              type="file"
              name="bannerMobile"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.bannerMobilePreview && (
              <img
                src={form.bannerMobilePreview}
                alt="banner mobile"
                style={{ width: 120, marginTop: 8 }}
              />
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày bắt đầu</label>
              <input
                type="date"
                name="saleBannerStartDate"
                value={form.saleBannerStartDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Ngày kết thúc</label>
              <input
                type="date"
                name="saleBannerEndDate"
                value={form.saleBannerEndDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="banner-preview">
            <span className="preview-label">Xem trước</span>
            <div className="preview-box">
              <div className="preview-content">
                <p className="preview-tag">SALE EVENT</p>
                <h4>{form.saleBannerTitle || "Chưa có tiêu đề"}</h4>
                <p>{form.saleBannerShortDescription || "Chưa có mô tả"}</p>
                <button>Xem ngay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;