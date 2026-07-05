import "./VouchersAdmin.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Statistic, Skeleton } from "antd";
import CountUp from "react-countup";
import { SearchOutlined } from "@ant-design/icons";
import { CgMathPlus } from "react-icons/cg";
import { MdDeleteOutline } from "react-icons/md";
import { BsCalendarCheck, BsCheck2Circle } from "react-icons/bs";
import { FaLayerGroup, FaEyeSlash } from "react-icons/fa6";
import SEO from "../../../utils/SEO";
import { useEffect, useState } from "react";
import { error, success, confirm } from "../../../utils/notift";
import { getVouchers, deleteVoucher } from "../../../services/admin/vouchers.admin.service";
import { renderpagination } from "../../../utils/pagination";

const formatter = (value) => (
  <CountUp end={value} duration={2} separator="," />
);

function VouchersAdmin() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [keywordInput, setKeywordInput] = useState("");
  const [selectId, setSelectId] = useState([]);
  const [typeChange, setTypeChange] = useState("");

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const sort = searchParams.get("sort") || "";
  const status = searchParams.get("status") || "";
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        // Note: For full functionality, we should pass pagination/filter params to backend.
        // For now, doing simple fetch and client-side filtering if backend not fully supported.
        const res = await getVouchers({ page, limit, sort, status, keyword });
        setVouchers(res.data.vouchers || []);
      } catch (err) {
        error(err.response?.data?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [reload, page, limit, sort, status, keyword]);

  const handleSearch = () => {
    const params = { page: 1, limit };
    if (sort) params.sort = sort;
    if (status) params.status = status;
    if (keywordInput.trim()) params.keyword = keywordInput.trim();
    setSearchParams(params);
  };

  const handleChangeMulti = async () => {
    error("Chức năng thay đổi nhiều đang được cập nhật...");
  };

  const handleDelete = async (id) => {
    try {
      const ok = await confirm(
        "Xoá Voucher?",
        "Mã giảm giá này sẽ bị xoá vĩnh viễn"
      );
      if (!ok) return;

      const res = await deleteVoucher(id);
      if (res.data.code === 200) {
        success("Xóa voucher thành công");
        setReload(!reload);
      }
    } catch (err) {
      error(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="vouchers_admin">
      <SEO title="Quản lý Voucher" />
      <h2 className="vouchers_admin__title">Quản Lý Voucher (Mã Giảm Giá)</h2>

      <div className="vouchers_admin__stats">
        <div className="vouchers_admin__stat-card vouchers_admin__stat-total">
          <p><BsCalendarCheck /> Tổng Voucher</p>
          {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={vouchers.length} formatter={formatter} />}
        </div>
        <div className="vouchers_admin__stat-card vouchers_admin__stat-active">
          <p><BsCheck2Circle /> Đang hoạt động</p>
          {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={vouchers.filter(v => v.isActive).length} formatter={formatter} />}
        </div>
        <div className="vouchers_admin__stat-card vouchers_admin__stat-category">
          <p><FaLayerGroup /> Lượt sử dụng</p>
          {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={vouchers.reduce((acc, v) => acc + v.usedCount, 0)} formatter={formatter} />}
        </div>
        <div className="vouchers_admin__stat-card vouchers_admin__stat-hidden">
          <p><FaEyeSlash /> Tạm ẩn</p>
          {loading ? <Skeleton.Avatar active shape style={{ width: 35, height: 35 }} /> : <Statistic value={vouchers.filter(v => !v.isActive).length} formatter={formatter} />}
        </div>
      </div>

      <div className="vouchers_admin__filters">
        <div className="vouchers_admin__search">
          <SearchOutlined />
          <input
            placeholder="Tìm mã Code..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setSearchParams({ page: 1, limit, ...(sort && { sort }), ...(keyword && { keyword }), ...(e.target.value && { status: e.target.value }) })
          }
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSearchParams({ page: 1, limit, ...(status && { status }), ...(keyword && { keyword }), ...(e.target.value && { sort: e.target.value }) })
          }
        >
          <option value="">-- Sắp xếp theo --</option>
          <option value="code-asc">Mã A-Z</option>
          <option value="code-desc">Mã Z-A</option>
          <option value="createdAt-desc">Mới nhất</option>
        </select>

        <button className="vouchers_admin__reset" onClick={() => navigate("/admin/vouchers")}>
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select value={typeChange} onChange={(e) => setTypeChange(e.target.value)}>
          <option value="">-- Chọn hành động --</option>
          <option value="active">Chuyển hoạt động</option>
          <option value="inactive">Chuyển không hoạt động</option>
          <option value="delete">Xoá voucher</option>
        </select>

        <button className="vouchers_admin__activity" onClick={handleChangeMulti}>
          Áp dụng
        </button>

        <Link className="vouchers_admin__create" to="/admin/vouchers/create">
          <CgMathPlus /> Tạo mới
        </Link>
      </div>

      <div className="vouchers_admin__table-wrapper">
        <div className="vouchers_admin__table">
          <div className="vouchers_admin__table-header">
            <div>
              <input 
                type="checkbox" 
                checked={vouchers.length > 0 && vouchers.length === selectId.length}
                onChange={(e) => setSelectId(e.target.checked ? vouchers.map((v) => v._id) : [])}
              />
            </div>
            <div>Mã Code</div>
            <div>Mô tả</div>
            <div>Giảm giá</div>
            <div>Tối thiểu</div>
            <div>Lượt dùng</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {loading ? (
            <div style={{ padding: 20 }}><Skeleton active /></div>
          ) : (
            vouchers.map((item) => (
              <div className="vouchers_admin__table-row" key={item._id}>
                <div>
                  <input
                    type="checkbox"
                    checked={selectId.includes(item._id)}
                    onChange={(e) => setSelectId((prev) => e.target.checked ? [...prev, item._id] : prev.filter((id) => id !== item._id))}
                  />
                </div>
                <div>
                  <span className="vouchers_admin__code">{item.code}</span>
                </div>
                <div>{item.description || "Không có mô tả"}</div>
                <div>
                  {item.discountType === "percentage" 
                    ? item.discountValue + "%" 
                    : item.discountValue.toLocaleString() + "đ"}
                </div>
                <div>{item.minOrderValue ? item.minOrderValue.toLocaleString() + "đ" : "0đ"}</div>
                <div>{item.usedCount} / {item.quantity}</div>
                <div>
                  <span className={`vouchers_admin__status ${item.isActive ? 'active' : 'inactive'}`}>
                    {item.isActive ? "Hoạt động" : "Ngừng"}
                  </span>
                </div>
                <div className="vouchers_admin__actions">
                  <Link className="vouchers_admin__edit" to={`/admin/vouchers/update/${item._id}`}>
                    Sửa
                  </Link>
                  <button className="vouchers_admin__delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </div>
              </div>
            ))
          )}
          
          {!loading && vouchers.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
              Chưa có mã giảm giá nào được tạo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VouchersAdmin;
