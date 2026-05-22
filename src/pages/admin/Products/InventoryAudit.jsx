import "./InventoryAudit.scss";
import SEO from "../../../utils/SEO";
import { useState, useEffect, useMemo } from "react";
import { getListProduct } from "../../../services/admin/product.admin.service";
import { useSearchParams } from "react-router-dom";
import { renderpagination } from "../../../utils/pagination";
import { getWarehouseList } from "../../../services/admin/warehouse.service";
import { error, success } from "../../../utils/notift";
import { generateInventoryRefId } from "../../../utils/generateInventoryRefId";
import { createInventoryAudit } from "../../../services/admin/inventoryAudit.service";
import Loading from "../../../utils/loading";
import {
    MdOutlineInventory,
    MdRefresh,
    MdCompareArrows,
    MdPrint,
    MdCheckCircle,
    MdWarehouse,
    MdTrendingUp,
    MdTrendingDown,
    MdRemove,
    MdHourglassEmpty,
} from "react-icons/md";

function InventoryAudit() {
    const [items, setItems] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pagination, setPagination] = useState([]);
    const [warehouse, setWarehouse] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        code: generateInventoryRefId("KK"),
        audit_date: "",
        created_by: "",
        note: "",
    });

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;
    const sort = searchParams.get("sort") || "";
    const sortByCategory = searchParams.get("sortByCategory") || "";

    useEffect(() => {
        const fetchData = async () => {
            const res = await getListProduct({ page, limit, sort, sortByCategory, selectedWarehouse });
            if (res?.data?.code) {
                setItems(
                    res.data.products.map((item) => ({
                        id: item._id,
                        title: item.title,
                        slug: item.slug,
                        thumbnail: item.thumbnail,
                        stocks: Number(item.stock) || 0,
                        actualQuantity: 0,
                        diffQuantity: 0,
                        status: "Chưa kiểm",
                    }))
                );
                setPagination(res.data.pagination);
            }
        };
        fetchData();
    }, [page, limit, sort, sortByCategory, selectedWarehouse]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await getWarehouseList();
                setWarehouse(res?.data?.warehouse || []);
            } catch (err) {
                console.log(err?.response?.data?.message);
            }
        };
        fetchApi();
    }, []);

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleActualQuantityChange = (id, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, actualQuantity: Math.max(0, Number(value) || 0) }
                    : item
            )
        );
    };

    const handleSoSanh = () => {
        if (!selectedWarehouse) { error("Vui lòng chọn kho"); return; }
        setItems((prev) =>
            prev.map((item) => {
                const diff = Number(item.actualQuantity) - Number(item.stocks);
                return {
                    ...item,
                    diffQuantity: diff,
                    status: diff > 0 ? "Dư" : diff < 0 ? "Thiếu" : "Khớp",
                };
            })
        );
    };

    const handleRefresh = () => {
        setItems((prev) =>
            prev.map((item) => ({ ...item, actualQuantity: 0, diffQuantity: 0, status: "Chưa kiểm" }))
        );
        setFormData({ code: generateInventoryRefId("KK"), audit_date: "", created_by: "", note: "" });
        setSelectedWarehouse("");
    };

    const validateForm = () => {
        if (!selectedWarehouse) { error("Vui lòng chọn kho"); return false; }
        if (!formData.code?.trim()) { error("Vui lòng nhập mã phiếu"); return false; }
        if (!formData.audit_date) { error("Vui lòng chọn ngày kiểm kê"); return false; }
        if (!formData.created_by?.trim()) { error("Vui lòng nhập tên người kiểm"); return false; }
        if (!items.length) { error("Không có sản phẩm để kiểm kê"); return false; }
        return true;
    };

    const handleConfirm = async () => {
        if (!validateForm()) return;
        try {
            setSubmitting(true);
            const payload = {
                code: formData.code.trim(),
                warehouse_id: selectedWarehouse,
                audit_date: formData.audit_date,
                created_by: formData.created_by.trim(),
                note: formData.note?.trim() || "",
                items: items.map((item) => ({
                    product_id: item.id,
                    system_qty: Number(item.stocks) || 0,
                    actual_qty: Number(item.actualQuantity) || 0,
                    diff_qty: Number(item.diffQuantity) || 0,
                    status: item.status || "Chưa kiểm",
                })),
            };
            const res = await createInventoryAudit(payload);
            if (res?.data?.code) {
                success("Tạo phiếu kiểm kê thành công");
                setFormData({ code: generateInventoryRefId("KK"), audit_date: "", created_by: "", note: "" });
                setItems((prev) =>
                    prev.map((item) => ({ ...item, actualQuantity: 0, diffQuantity: 0, status: "Chưa kiểm" }))
                );
            } else {
                error(res?.data?.message || "Tạo phiếu kiểm kê thất bại");
            }
        } catch (err) {
            error(err?.response?.data?.message || "Có lỗi xảy ra khi tạo phiếu kiểm kê");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrint = () => {
        const warehouseName = warehouse.find((w) => w._id === selectedWarehouse)?.name || "";
        if (!selectedWarehouse) { error("Vui lòng chọn kho"); return; }
        if (!formData.audit_date) { error("Vui lòng chọn ngày nhập"); return; }
        if (!formData.created_by) { error("Vui lòng nhập tên người kiểm"); return; }

        const totalStock = items.reduce((s, i) => s + (Number(i.stocks) || 0), 0);
        const totalActual = items.reduce((s, i) => s + (Number(i.actualQuantity) || 0), 0);
        const totalDiff = items.reduce((s, i) => s + (Number(i.diffQuantity) || 0), 0);
        const totalDiffRows = items.filter((i) => i.diffQuantity !== 0).length;

        const rows = items
            .map(
                (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${
                            item.thumbnail
                                ? `<img src="${item.thumbnail}" style="width:40px;height:40px;object-fit:contain;border:1px solid #ddd;border-radius:4px;" />`
                                : `<div style="width:40px;height:40px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;">IMG</div>`
                        }
                        <div>
                            <div style="font-weight:600;">${item.title || ""}</div>
                            <div style="font-size:12px;color:#666;">${item.slug || ""}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align:center;">${item.stocks ?? 0}</td>
                <td style="text-align:center;">${item.actualQuantity ?? 0}</td>
                <td style="text-align:center;">${item.diffQuantity ?? 0}</td>
                <td style="text-align:center;">${item.status || "Chưa kiểm"}</td>
            </tr>`
            )
            .join("");

        const printWindow = window.open("", "_blank", "width=1200,height=800");
        printWindow.document.write(`
            <html><head><title>Phiếu kiểm kê kho</title>
            <style>
                body { font-family: Arial; padding: 24px; color: #000; }
                h1 { margin-bottom: 10px; }
                .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 14px; margin-bottom: 16px; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th, td { border: 1px solid #ccc; padding: 8px; font-size: 14px; }
                th { background: #f3f3f3; }
                .summary { margin-top: 20px; width: 350px; }
                .signature { margin-top: 40px; display: flex; justify-content: space-between; text-align: center; }
                .signature div { width: 200px; }
            </style></head>
            <body>
                <h1>PHIẾU KIỂM KÊ KHO</h1>
                <div class="meta">
                    <div><strong>Mã phiếu:</strong> ${formData.code}</div>
                    <div><strong>Kho:</strong> ${warehouseName}</div>
                    <div><strong>Ngày kiểm kê:</strong> ${formData.audit_date}</div>
                    <div><strong>Người kiểm kê:</strong> ${formData.created_by}</div>
                    <div><strong>Ngày in:</strong> ${new Date().toLocaleString("vi-VN")}</div>
                </div>
                <table>
                    <thead><tr><th>STT</th><th>Sản phẩm</th><th>Hệ thống</th><th>Thực tế</th><th>Chênh lệch</th><th>Trạng thái</th></tr></thead>
                    <tbody>${rows || `<tr><td colspan="6">Không có sản phẩm</td></tr>`}</tbody>
                </table>
                <div class="summary">
                    <table>
                        <tr><td>Tổng tồn hệ thống</td><td>${totalStock}</td></tr>
                        <tr><td>Tồn thực tế</td><td>${totalActual}</td></tr>
                        <tr><td>Tổng chênh lệch</td><td>${totalDiff}</td></tr>
                        <tr><td>Dòng lệch</td><td>${totalDiffRows}</td></tr>
                    </table>
                </div>
                <div class="signature">
                    <div><p>Người kiểm kê</p><br><br><strong>${formData.created_by}</strong></div>
                    <div><p>Giám Đốc Điều Hành</p><br><br><strong>Lâm Chí Lộc</strong></div>
                </div>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    const totalStock = useMemo(() => items.reduce((s, i) => s + (Number(i.stocks) || 0), 0), [items]);
    const totalActual = useMemo(() => items.reduce((s, i) => s + (Number(i.actualQuantity) || 0), 0), [items]);
    const totalDiff = useMemo(() => items.reduce((s, i) => s + (Number(i.diffQuantity) || 0), 0), [items]);
    const totalDiffRows = useMemo(() => items.filter((i) => Number(i.diffQuantity) !== 0).length, [items]);

    const getStatusMeta = (status) => {
        switch (status) {
            case "Khớp":   return { cls: "ia-badge--match",   icon: <MdCheckCircle />,   label: "Khớp" };
            case "Dư":     return { cls: "ia-badge--excess",  icon: <MdTrendingUp />,    label: "Dư" };
            case "Thiếu":  return { cls: "ia-badge--missing", icon: <MdTrendingDown />,  label: "Thiếu" };
            default:       return { cls: "ia-badge--waiting", icon: <MdHourglassEmpty />,label: "Chưa kiểm" };
        }
    };

    return (
        <div className="ia-page">
            {submitting && <Loading />}
            <SEO title="Kiểm kê kho" />

            {/* ── Header ── */}
            <div className="ia-header no-print">
                <div className="ia-header__left">
                    <div className="ia-header__icon">
                        <MdOutlineInventory />
                    </div>
                    <div>
                        <p className="ia-header__eyebrow">Nghiệp vụ kho</p>
                        <h2>Kiểm kê kho</h2>
                        <p className="ia-header__sub">Đối chiếu tồn hệ thống với số lượng thực tế, in phiếu và xác nhận kiểm kê.</p>
                    </div>
                </div>

                <div className="ia-toolbar">
                    <button type="button" className="ia-btn ia-btn--ghost" onClick={handleRefresh}>
                        <MdRefresh /> Làm mới
                    </button>
                    <button type="button" className="ia-btn ia-btn--soft" onClick={handleSoSanh}>
                        <MdCompareArrows /> So sánh
                    </button>
                    <button type="button" className="ia-btn ia-btn--outline" onClick={handlePrint}>
                        <MdPrint /> In phiếu
                    </button>
                    <button
                        type="button"
                        className="ia-btn ia-btn--primary"
                        onClick={handleConfirm}
                        disabled={submitting}
                    >
                        <MdCheckCircle />
                        {submitting ? "Đang xác nhận..." : "Xác nhận"}
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="ia-shell">
                <div className="ia-main">
                    {/* Info form */}
                    <section className="ia-card">
                        <div className="ia-card__header">
                            <h3>Thông tin phiếu</h3>
                            <p>Nhập thông tin cơ bản cho lần kiểm kê này</p>
                        </div>
                        <div className="ia-form-grid">
                            <div className="ia-field">
                                <label><MdWarehouse className="ia-field__icon" /> Kho kiểm kê</label>
                                <select
                                    name="warehouse"
                                    value={selectedWarehouse}
                                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                                >
                                    <option value="">-- Chọn kho --</option>
                                    {warehouse.map((item) => (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="ia-field">
                                <label>Mã phiếu</label>
                                <input name="code" value={formData.code} onChange={handleChangeForm} placeholder="Mã phiếu" />
                            </div>

                            <div className="ia-field">
                                <label>Ngày kiểm kê</label>
                                <input type="date" name="audit_date" value={formData.audit_date} onChange={handleChangeForm} />
                            </div>

                            <div className="ia-field">
                                <label>Người kiểm kê</label>
                                <input name="created_by" value={formData.created_by} onChange={handleChangeForm} placeholder="Nhập tên người kiểm kê" />
                            </div>

                            <div className="ia-field ia-field--full">
                                <label>Ghi chú</label>
                                <textarea rows="3" name="note" value={formData.note} onChange={handleChangeForm} placeholder="Nhập ghi chú thêm nếu có..." />
                            </div>
                        </div>
                    </section>

                    {/* Product table */}
                    <section className="ia-card">
                        <div className="ia-card__header ia-card__header--row">
                            <div>
                                <h3>Danh sách sản phẩm</h3>
                                <p>Nhập số lượng thực tế rồi bấm So sánh</p>
                            </div>
                            <span className="ia-counter">{items.length} sản phẩm</span>
                        </div>

                        <div className="ia-table-wrap">
                            <div className="ia-table">
                                <div className="ia-table__head">
                                    <div>Sản phẩm</div>
                                    <div>Hệ thống</div>
                                    <div>Thực tế</div>
                                    <div>Chênh lệch</div>
                                    <div>Trạng thái</div>
                                </div>

                                {items.map((item) => {
                                    const meta = getStatusMeta(item.status);
                                    const diffClass =
                                        item.diffQuantity > 0
                                            ? "ia-diff--excess"
                                            : item.diffQuantity < 0
                                            ? "ia-diff--missing"
                                            : "";

                                    return (
                                        <div className="ia-row" key={item.id}>
                                            <div className="ia-product">
                                                <div className="ia-product__thumb">
                                                    {item.thumbnail ? (
                                                        <img src={item.thumbnail} alt={item.title} />
                                                    ) : (
                                                        <span>IMG</span>
                                                    )}
                                                </div>
                                                <div className="ia-product__info">
                                                    <strong>{item.title}</strong>
                                                    <span>{item.slug}</span>
                                                </div>
                                            </div>

                                            <div className="ia-sys-qty">{item.stocks}</div>

                                            <div>
                                                <input
                                                    className="ia-qty-input"
                                                    type="number"
                                                    min="0"
                                                    value={item.actualQuantity}
                                                    onChange={(e) => handleActualQuantityChange(item.id, e.target.value)}
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className={`ia-diff ${diffClass}`}>
                                                {item.diffQuantity > 0 && "+"}
                                                {item.diffQuantity}
                                            </div>

                                            <div>
                                                <span className={`ia-badge ${meta.cls}`}>
                                                    {meta.icon}
                                                    {meta.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {renderpagination(pagination, setSearchParams, limit, sort, sortByCategory)}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="ia-sidebar">
                    <section className="ia-card ia-summary">
                        <div className="ia-card__header">
                            <h3>Tổng quan</h3>
                            <p>Tóm tắt nhanh lần kiểm kê</p>
                        </div>

                        <div className="ia-summary__grid">
                            <div className="ia-stat">
                                <span>Sản phẩm</span>
                                <strong>{items.length}</strong>
                            </div>
                            <div className="ia-stat ia-stat--warn">
                                <span>Dòng lệch</span>
                                <strong>{totalDiffRows}</strong>
                            </div>
                            <div className="ia-stat">
                                <span>Tồn hệ thống</span>
                                <strong>{totalStock}</strong>
                            </div>
                            <div className="ia-stat ia-stat--green">
                                <span>Tồn thực tế</span>
                                <strong>{totalActual}</strong>
                            </div>
                        </div>

                        <div className={`ia-summary__total ${totalDiff > 0 ? "ia-summary__total--pos" : totalDiff < 0 ? "ia-summary__total--neg" : ""}`}>
                            <span>Tổng chênh lệch</span>
                            <h2>
                                {totalDiff > 0 && "+"}{totalDiff}
                            </h2>
                            <small>sản phẩm</small>
                        </div>

                        <div className="ia-summary__actions no-print">
                            <button type="button" className="ia-btn ia-btn--primary ia-btn--block" onClick={handleConfirm} disabled={submitting}>
                                <MdCheckCircle />
                                {submitting ? "Đang xác nhận..." : "Xác nhận kiểm kê"}
                            </button>
                            <button type="button" className="ia-btn ia-btn--outline ia-btn--block" onClick={handlePrint}>
                                <MdPrint /> In phiếu
                            </button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default InventoryAudit;