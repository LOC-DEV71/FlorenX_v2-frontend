import { RiListSettingsLine } from "react-icons/ri";
import { GiPlatform } from "react-icons/gi";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { MdDriveFolderUpload } from "react-icons/md";
import { MdOutlineViewCarousel } from "react-icons/md";
import { BsImages } from "react-icons/bs";
import { Switch } from "antd";
import "./SettingPage.scss";
import { useEffect, useState } from "react";
import settingService from "../../../services/admin/setting.service";
import { error, success } from "../../../utils/notift";

const defaultForm = {
  websiteName: "",
  contactEmail: "",
  contactPhone: "",
  address: "",

  themeColor: "blue",
  themeMode: "light",

  logo: "",
  favicon: "",

  postPerPage: 10,
  autoApprovePost: false,
  showFeaturedPost: false,

  sessionTimeout: 60,
  twoFactorAuth: false,
  strangeLoginAlert: false,

  saleBanner: {
    isActive: false,
    title: "",
    shortDescription: "",
    discountText: "",
    redirectLink: "",
    desktopImage: "",
    mobileImage: "",
    startDate: "",
    endDate: ""
  },

  section_hero: [
    {
      image: "",
      title: "",
      desc: "",
      tag: "",
      link: ""
    }
  ],

  section_hero_slider: [
    {
      image: "",
      title: "",
      tag: "",
      link: ""
    }
  ]
};

function SettingPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const normalizeDate = (dateValue) => {
    if (!dateValue) return "";
    try {
      return new Date(dateValue).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await settingService.getDetail();
      const data = res?.data || {};

      setForm({
        websiteName: data.websiteName || "",
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        address: data.address || "",

        themeColor: data.themeColor || "blue",
        themeMode: data.themeMode || "light",

        logo: data.logo || "",
        favicon: data.favicon || "",

        postPerPage: data.postPerPage ?? 10,
        autoApprovePost: data.autoApprovePost ?? false,
        showFeaturedPost: data.showFeaturedPost ?? false,

        sessionTimeout: data.sessionTimeout ?? 60,
        twoFactorAuth: data.twoFactorAuth ?? false,
        strangeLoginAlert: data.strangeLoginAlert ?? false,

        saleBanner: {
          isActive: data.saleBanner?.isActive ?? false,
          title: data.saleBanner?.title || "",
          shortDescription: data.saleBanner?.shortDescription || "",
          discountText: data.saleBanner?.discountText || "",
          redirectLink: data.saleBanner?.redirectLink || "",
          desktopImage: data.saleBanner?.desktopImage || "",
          mobileImage: data.saleBanner?.mobileImage || "",
          startDate: normalizeDate(data.saleBanner?.startDate),
          endDate: normalizeDate(data.saleBanner?.endDate)
        },

        section_hero:
          data.section_hero?.length > 0
            ? data.section_hero.map((item) => ({
                image: item.image || "",
                title: item.title || "",
                desc: item.desc || "",
                tag: item.tag || "",
                link: item.link || ""
              }))
            : [
                {
                  image: "",
                  title: "",
                  desc: "",
                  tag: "",
                  link: ""
                }
              ],

        section_hero_slider:
          data.section_hero_slider?.length > 0
            ? data.section_hero_slider.map((item) => ({
                image: item.image || "",
                title: item.title || "",
                tag: item.tag || "",
                link: item.link || ""
              }))
            : [
                {
                  image: "",
                  title: "",
                  tag: "",
                  link: ""
                }
              ]
      });
    } catch (error) {
      console.error("Get setting detail error:", error);
      alert("Không thể tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const onChangeSwitch = (field, checked) => {
    setForm((prev) => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaleBannerChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      saleBanner: {
        ...prev.saleBanner,
        [id]: value
      }
    }));
  };

  const handleSaleBannerSwitch = (checked) => {
    setForm((prev) => ({
      ...prev,
      saleBanner: {
        ...prev.saleBanner,
        isActive: checked
      }
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSaleBannerFile = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      saleBanner: {
        ...prev.saleBanner,
        [field]: file
      }
    }));
  };

  const handleHeroChange = (index, field, value) => {
    const updated = [...form.section_hero];
    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      section_hero: updated
    }));
  };

  const handleHeroImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updated = [...form.section_hero];
    updated[index].image = file;
    updated[index].hasNewImage = true;

    setForm((prev) => ({
      ...prev,
      section_hero: updated
    }));
  };

  const addHeroItem = () => {
    setForm((prev) => ({
      ...prev,
      section_hero: [
        ...prev.section_hero,
        {
          image: "",
          title: "",
          desc: "",
          tag: "",
          link: ""
        }
      ]
    }));
  };

  const removeHeroItem = (index) => {
    const updated = form.section_hero.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      section_hero: updated.length
        ? updated
        : [
            {
              image: "",
              title: "",
              desc: "",
              tag: "",
              link: ""
            }
          ]
    }));
  };

  const handleSliderChange = (index, field, value) => {
    const updated = [...form.section_hero_slider];
    updated[index][field] = value;

    setForm((prev) => ({
      ...prev,
      section_hero_slider: updated
    }));
  };

  const handleSliderImageChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updated = [...form.section_hero_slider];
    updated[index].image = file;
    updated[index].hasNewImage = true;

    setForm((prev) => ({
      ...prev,
      section_hero_slider: updated
    }));
  };

  const addSliderItem = () => {
    setForm((prev) => ({
      ...prev,
      section_hero_slider: [
        ...prev.section_hero_slider,
        {
          image: "",
          title: "",
          tag: "",
          link: ""
        }
      ]
    }));
  };

  const removeSliderItem = (index) => {
    const updated = form.section_hero_slider.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      section_hero_slider: updated.length
        ? updated
        : [
            {
              image: "",
              title: "",
              tag: "",
              link: ""
            }
          ]
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("websiteName", form.websiteName || "");
      formData.append("contactEmail", form.contactEmail || "");
      formData.append("contactPhone", form.contactPhone || "");
      formData.append("address", form.address || "");

      formData.append("themeColor", form.themeColor || "blue");
      formData.append("themeMode", form.themeMode || "light");

      formData.append("postPerPage", form.postPerPage ?? 10);
      formData.append("autoApprovePost", form.autoApprovePost);
      formData.append("showFeaturedPost", form.showFeaturedPost);

      formData.append("sessionTimeout", form.sessionTimeout ?? 60);
      formData.append("twoFactorAuth", form.twoFactorAuth);
      formData.append("strangeLoginAlert", form.strangeLoginAlert);

      formData.append("saleBannerIsActive", form.saleBanner.isActive);
      formData.append("saleBannerTitle", form.saleBanner.title || "");
      formData.append(
        "saleBannerShortDescription",
        form.saleBanner.shortDescription || ""
      );
      formData.append(
        "saleBannerDiscountText",
        form.saleBanner.discountText || ""
      );
      formData.append(
        "saleBannerRedirectLink",
        form.saleBanner.redirectLink || ""
      );
      formData.append("saleBannerStartDate", form.saleBanner.startDate || "");
      formData.append("saleBannerEndDate", form.saleBanner.endDate || "");

      if (form.logo instanceof File) {
        formData.append("logo", form.logo);
      }

      if (form.favicon instanceof File) {
        formData.append("favicon", form.favicon);
      }

      if (form.saleBanner.desktopImage instanceof File) {
        formData.append("bannerDesktop", form.saleBanner.desktopImage);
      }

      if (form.saleBanner.mobileImage instanceof File) {
        formData.append("bannerMobile", form.saleBanner.mobileImage);
      }

      const heroItems = form.section_hero.map((item) => ({
        title: item.title || "",
        desc: item.desc || "",
        tag: item.tag || "",
        link: item.link || "",
        image: item.image instanceof File ? "" : item.image || "",
        hasNewImage: item.image instanceof File
      }));

      const sliderItems = form.section_hero_slider.map((item) => ({
        title: item.title || "",
        tag: item.tag || "",
        link: item.link || "",
        image: item.image instanceof File ? "" : item.image || "",
        hasNewImage: item.image instanceof File
      }));

      formData.append("sectionHeroItems", JSON.stringify(heroItems));
      formData.append("sectionHeroSliderItems", JSON.stringify(sliderItems));

      form.section_hero.forEach((item) => {
        if (item.image instanceof File) {
          formData.append("sectionHeroImages", item.image);
        }
      });

      form.section_hero_slider.forEach((item) => {
        if (item.image instanceof File) {
          formData.append("sectionHeroSliderImages", item.image);
        }
      });

      const res = await settingService.update(formData);
      console.log("UPDATE RES:", res);
      success(res?.message || "Cập nhật thành công!");
      fetchDetail();
    } catch (err) {
      console.log("Update setting error:", err);
      error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const renderFileInfo = (value, label = "Đã chọn file") => {
    if (value instanceof File) {
      return <span className="file-name">{value.name}</span>;
    }

    if (typeof value === "string" && value) {
      return <img src={value} alt={label} />;
    }

    return null;
  };

  if (loading) {
    return <div className="setting">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="setting">
      <div className="setting_top">
        <span>
          <RiListSettingsLine /> ADMIN SETTINGS
        </span>
        <h1>Cài đặt hệ thống</h1>
        <p>
          Quản lý bản sắc cốt lõi, nhận diện thương hiệu và các tùy chọn khu
          vực của tổ chức bạn trên toàn bộ môi trường Veltrix Gear.
        </p>
      </div>

      <div className="setting_bot">
        <div className="setting_bot-left">
          <div className="setting_bot-left--identify">
            <span>
              <GiPlatform /> NHẬN DIỆN HỆ THỐNG
            </span>

            <div className="main">
              <div className="form-input">
                <label htmlFor="websiteName">Tên website</label>
                <input
                  type="text"
                  id="websiteName"
                  value={form.websiteName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="contactEmail">Email liên hệ</label>
                <input
                  type="text"
                  id="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="contactPhone">Phone liên hệ</label>
                <input
                  type="text"
                  id="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="setting_bot-left--basic">
            <span>
              <IoIosColorPalette /> STYLE CƠ BẢN
            </span>

            <div className="main">
              <div className="form-input">
                <label htmlFor="logo" id="file">
                  <div>
                    <MdDriveFolderUpload /> <br />
                    <span className="des">Click để tải logo</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
                {renderFileInfo(form.logo, "logo-preview")}
              </div>

              <div className="form-input">
                <label htmlFor="favicon" id="file">
                  <div>
                    <MdDriveFolderUpload /> <br />
                    <span className="des">Click để tải icon logo</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="favicon"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "favicon")}
                />
                {renderFileInfo(form.favicon, "favicon-preview")}
              </div>
            </div>
          </div>

          <div className="setting_bot-left--saleBanner">
            <span>
              <IoIosColorPalette /> CHƯƠNG TRÌNH GIẢM GIÁ
            </span>

            <div className="main">
              <div className="isActive full-width">
                TRẠNG THÁI:
                <Switch
                  checked={form.saleBanner.isActive}
                  onChange={handleSaleBannerSwitch}
                />
              </div>

              <div className="form-input">
                <label htmlFor="title">Tiêu đề</label>
                <input
                  type="text"
                  id="title"
                  value={form.saleBanner.title}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="shortDescription">Mô tả ngắn</label>
                <input
                  type="text"
                  id="shortDescription"
                  value={form.saleBanner.shortDescription}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="discountText">Text giảm giá</label>
                <input
                  type="text"
                  id="discountText"
                  value={form.saleBanner.discountText}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="redirectLink">Link điều hướng</label>
                <input
                  type="text"
                  id="redirectLink"
                  value={form.saleBanner.redirectLink}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="startDate">Ngày bắt đầu</label>
                <input
                  type="date"
                  id="startDate"
                  value={form.saleBanner.startDate}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="endDate">Ngày kết thúc</label>
                <input
                  type="date"
                  id="endDate"
                  value={form.saleBanner.endDate}
                  onChange={handleSaleBannerChange}
                />
              </div>

              <div className="form-input">
                <label htmlFor="desktopImage" id="file">
                  <div>
                    <MdDriveFolderUpload /> <br />
                    <span className="des">Banner desktop</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="desktopImage"
                  accept="image/*"
                  onChange={(e) => handleSaleBannerFile(e, "desktopImage")}
                />
                {renderFileInfo(form.saleBanner.desktopImage, "desktop-banner")}
              </div>

              <div className="form-input">
                <label htmlFor="mobileImage" id="file">
                  <div>
                    <MdDriveFolderUpload /> <br />
                    <span className="des">Banner mobile</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="mobileImage"
                  accept="image/*"
                  onChange={(e) => handleSaleBannerFile(e, "mobileImage")}
                />
                {renderFileInfo(form.saleBanner.mobileImage, "mobile-banner")}
              </div>
            </div>
          </div>

          <div className="setting_bot-left--hero">
            <span>
              <BsImages /> HERO SECTION
            </span>

            <div className="main-column">
              {form.section_hero.map((item, index) => (
                <div className="dynamic-card" key={index}>
                  <div className="card-header">
                    <h4>Hero item #{index + 1}</h4>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => removeHeroItem(index)}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="card-grid">
                    <div className="form-input">
                      <label htmlFor={`hero-image-${index}`} id="file">
                        <div>
                          <MdDriveFolderUpload /> <br />
                          <span className="des">Upload ảnh hero</span>
                        </div>
                      </label>
                      <input
                        type="file"
                        id={`hero-image-${index}`}
                        accept="image/*"
                        onChange={(e) => handleHeroImageChange(e, index)}
                      />
                      {renderFileInfo(item.image, `hero-${index}`)}
                    </div>

                    <div className="form-input">
                      <label>Tiêu đề</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleHeroChange(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-input">
                      <label>Mô tả</label>
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) =>
                          handleHeroChange(index, "desc", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-input">
                      <label>Tag</label>
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) =>
                          handleHeroChange(index, "tag", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-input full-width">
                      <label>Link</label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) =>
                          handleHeroChange(index, "link", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add" onClick={addHeroItem}>
                + Thêm hero item
              </button>
            </div>
          </div>

          <div className="setting_bot-left--slider">
            <span>
              <MdOutlineViewCarousel /> HERO SECTION SLIDER
            </span>

            <div className="main-column">
              {form.section_hero_slider.map((item, index) => (
                <div className="dynamic-card" key={index}>
                  <div className="card-header">
                    <h4>Slider item #{index + 1}</h4>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => removeSliderItem(index)}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="card-grid">
                    <div className="form-input">
                      <label htmlFor={`slider-image-${index}`} id="file">
                        <div>
                          <MdDriveFolderUpload /> <br />
                          <span className="des">Upload ảnh slider</span>
                        </div>
                      </label>
                      <input
                        type="file"
                        id={`slider-image-${index}`}
                        accept="image/*"
                        onChange={(e) => handleSliderImageChange(e, index)}
                      />
                      {renderFileInfo(item.image, `slider-${index}`)}
                    </div>

                    <div className="form-input">
                      <label>Tiêu đề</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleSliderChange(index, "title", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-input">
                      <label>Tag</label>
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) =>
                          handleSliderChange(index, "tag", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-input full-width">
                      <label>Link</label>
                      <input
                        type="text"
                        value={item.link}
                        onChange={(e) =>
                          handleSliderChange(index, "link", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="btn-add" onClick={addSliderItem}>
                + Thêm slider item
              </button>
            </div>
          </div>
        </div>

        <div className="setting_bot-right">
          <div className="setting_bot-right--feature">
            <h3>
              <MdOutlineFeaturedPlayList /> QUẢN LÝ TÍNH NĂNG
            </h3>

            <div className="main">
              <div className="form-feature">
                <span className="des">
                  Auto Approve Post
                  <p>Tự động duyệt bài viết</p>
                </span>
                <Switch
                  checked={form.autoApprovePost}
                  onChange={(checked) =>
                    onChangeSwitch("autoApprovePost", checked)
                  }
                />
              </div>

              <div className="form-feature">
                <span className="des">
                  Show Featured Post
                  <p>Hiển thị bài viết nổi bật</p>
                </span>
                <Switch
                  checked={form.showFeaturedPost}
                  onChange={(checked) =>
                    onChangeSwitch("showFeaturedPost", checked)
                  }
                />
              </div>

              <div className="form-feature">
                <span className="des">
                  Two Factor Auth
                  <p>Xác thực 2 bước</p>
                </span>
                <Switch
                  checked={form.twoFactorAuth}
                  onChange={(checked) =>
                    onChangeSwitch("twoFactorAuth", checked)
                  }
                />
              </div>

              <div className="form-feature">
                <span className="des">
                  Strange Login Alert
                  <p>Cảnh báo đăng nhập bất thường</p>
                </span>
                <Switch
                  checked={form.strangeLoginAlert}
                  onChange={(checked) =>
                    onChangeSwitch("strangeLoginAlert", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="setting-change">
        <p>Bạn có muốn lưu bảng cài đặt?</p>
        <button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Đang lưu..." : "Lưu Cài Đặt"}
        </button>
      </div>
    </div>
  );
}

export default SettingPage;