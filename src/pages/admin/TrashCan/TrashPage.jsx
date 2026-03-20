import React, { useEffect, useMemo, useState } from "react";
import "./TrashPage.scss";
import {
  getTrashList,
  restoreTrashItem,
  restoreAllTrash,
  deleteTrashItem,
  deleteSelectedTrash,
  deleteAllTrash,
} from "../../../services/admin/trashcan.service";
import { confirm, success, error } from "../../../utils/notift";

const TrashPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await getTrashList();
      setData(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách thùng rác:", err);
      error("Không thể tải dữ liệu thùng rác");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchKeyword = item.name
        ?.toLowerCase()
        .includes(keyword.toLowerCase());
      const matchType = typeFilter === "all" ? true : item.type === typeFilter;
      return matchKeyword && matchType;
    });
  }, [data, keyword, typeFilter]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredData.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  const handleDeleteSelected = async () => {
    const isConfirmed = await confirm(
      "Xóa các mục đã chọn?",
      `Bạn sẽ xóa vĩnh viễn ${selected.length} mục đã chọn!`
    );
    if (!isConfirmed) return;

    try {
      const items = data
        .filter((item) => selected.includes(item.id))
        .map((item) => ({
          id: item.id,
          type: item.type,
        }));

      await deleteSelectedTrash(items);
      await fetchTrash();
      setSelected([]);
      success("Đã xóa các mục đã chọn");
    } catch (err) {
      console.error("Lỗi xóa đã chọn:", err);
      error("Xóa các mục đã chọn thất bại");
    }
  };

  const handleRestoreItem = async (type, id) => {
    const isConfirmed = await confirm(
      "Khôi phục mục này?",
      "Dữ liệu sẽ được đưa trở lại hệ thống."
    );
    if (!isConfirmed) return;

    try {
      await restoreTrashItem(type, id);
      await fetchTrash();
      setSelected((prev) => prev.filter((item) => item !== id));
      success("Khôi phục thành công");
    } catch (err) {
      console.error("Lỗi khôi phục:", err);
      error("Khôi phục thất bại");
    }
  };

  const handleDeleteItem = async (type, id) => {
    const isConfirmed = await confirm(
      "Xóa vĩnh viễn mục này?",
      "Hành động này không thể hoàn tác!"
    );
    if (!isConfirmed) return;

    try {
      await deleteTrashItem(type, id);
      await fetchTrash();
      setSelected((prev) => prev.filter((item) => item !== id));
      success("Đã xóa vĩnh viễn");
    } catch (err) {
      console.error("Lỗi xóa vĩnh viễn:", err);
      error("Xóa vĩnh viễn thất bại");
    }
  };

  const handleDeleteAll = async () => {
    const isConfirmed = await confirm(
      "Xóa toàn bộ thùng rác?",
      "Tất cả dữ liệu trong thùng rác sẽ bị xóa vĩnh viễn!"
    );
    if (!isConfirmed) return;

    try {
      await deleteAllTrash();
      await fetchTrash();
      setSelected([]);
      success("Đã xóa toàn bộ thùng rác");
    } catch (err) {
      console.error("Lỗi xóa tất cả:", err);
      error("Xóa toàn bộ thất bại");
    }
  };

  const handleRestoreAll = async () => {
    const isConfirmed = await confirm(
      "Khôi phục tất cả?",
      "Tất cả dữ liệu trong thùng rác sẽ được khôi phục."
    );
    if (!isConfirmed) return;

    try {
      await restoreAllTrash();
      await fetchTrash();
      setSelected([]);
      success("Đã khôi phục tất cả");
    } catch (err) {
      console.error("Lỗi khôi phục tất cả:", err);
      error("Khôi phục tất cả thất bại");
    }
  };

  return (
    <div className="trash-page">
      <div className="page-header">
        <div>
          <h2>Thùng rác</h2>
          <p>Quản lý các dữ liệu đã xoá tạm thời</p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-danger"
            disabled={selected.length === 0}
            onClick={handleDeleteSelected}
          >
            Xóa đã chọn ({selected.length})
          </button>

          <button className="btn btn-outline" onClick={handleDeleteAll}>
            Xóa tất cả
          </button>

          <button className="btn btn-primary" onClick={handleRestoreAll}>
            Khôi phục tất cả
          </button>
        </div>
      </div>

      <div className="trash-filter">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Tìm theo tên dữ liệu..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="product">Sản phẩm</option>
            <option value="product_category">Danh mục</option>
            <option value="news">Bài viết</option>
            <option value="news_category">Danh mục bài viết</option>
            <option value="account">Tài khoản</option>
            <option value="role">Nhóm quyền</option>
          </select>
        </div>

        <div className="filter-right">
          <button className="btn btn-light" onClick={fetchTrash}>
            Làm mới
          </button>
        </div>
      </div>

      <div className="trash-table-wrap">
        <table className="trash-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredData.length > 0 &&
                    selected.length === filteredData.length
                  }
                />
              </th>
              <th>#</th>
              <th>Loại dữ liệu</th>
              <th>Tên</th>
              <th>Người xóa</th>
              <th>Thời gian xóa</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <span className="type-badge">{item.typeLabel}</span>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.deletedBy || "Không rõ"}</td>
                  <td>
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleString("vi-VN")
                      : ""}
                  </td>
                  <td>
                    <div className="action-group">
                      <button
                        className="btn-action restore"
                        onClick={() => handleRestoreItem(item.type, item.id)}
                      >
                        Khôi phục
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => handleDeleteItem(item.type, item.id)}
                      >
                        Xóa vĩnh viễn
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Không có dữ liệu trong thùng rác
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrashPage;