import "./InventoryAuditDetail.scss";
import SEO from "../../../utils/SEO";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { formatCustom } from "../../../utils/formatCustomDate";
import LoadingSpinner from "../../../utils/LoadingSpinner";
import { getInventoryAuditDetail } from "../../../services/admin/inventoryAudit.service";

function InventoryAuditDetail() {
    const { code } = useParams();
    const [loading, setLoading] = useState(false);

    const [detail, setDetail] = useState([])

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);

                const res = await getInventoryAuditDetail(code);
                if (res?.data?.code) {
                    setDetail(res.data.audit);
                }

                setTimeout(() => {
                    setLoading(false);
                }, 300);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchDetail();
    }, [code]);

    const summary = useMemo(() => {
        const items = detail?.items || [];

        const totalSystem = items.reduce((sum, item) => sum + (item.system_qty || 0), 0);
        const totalActual = items.reduce((sum, item) => sum + (item.actual_qty || 0), 0);
        const totalDiff = items.reduce((sum, item) => sum + (item.diff_qty || 0), 0);
        const totalDiffRows = items.filter((item) => Number(item.diff_qty) !== 0).length;

        return {
            totalSystem,
            totalActual,
            totalDiff,
            totalDiffRows,
        };
    }, [detail]);

    const getStatusClass = (status) => {
        switch (status) {
            case "Đã kiểm":
                return "success";
            case "Lệch":
                return "danger";
            case "Chưa kiểm":
            default:
                return "warning";
        }
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank", "width=1200,height=800");

        if (!printWindow) return;

        const items = detail?.items || [];
        const warehouseName = detail?.warehouse?.name || "";

        const totalStock = items.reduce((sum, i) => sum + (Number(i?.system_qty) || 0), 0);
        const totalActual = items.reduce((sum, i) => sum + (Number(i?.actual_qty) || 0), 0);
        const totalDiff = items.reduce((sum, i) => sum + (Number(i?.diff_qty) || 0), 0);
        const totalDiffRows = items.filter((i) => Number(i?.diff_qty) !== 0).length;

        const rows = items
            .map(
                (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${item?.product?.thumbnail
                        ? `<img src="${item.product.thumbnail}" style="width:40px;height:40px;object-fit:contain;border:1px solid #ddd;border-radius:4px;" />`
                        : `<div style="width:40px;height:40px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;border-radius:4px;">IMG</div>`
                    }
                        <div>
                            <div style="font-weight:600;">${item?.product?.title || ""}</div>
                            <div style="font-size:12px;color:#666;">${item?.product?.slug || ""}</div>
                        </div>
                    </div>
                </td>
                <td style="text-align:center;">${item?.system_qty ?? 0}</td>
                <td style="text-align:center;">${item?.actual_qty ?? 0}</td>
                <td style="text-align:center;">${item?.diff_qty ?? 0}</td>
                <td style="text-align:center;">${item?.status || "Chưa kiểm"}</td>
            </tr>
        `
            )
            .join("");

        printWindow.document.write(`
        <html>
            <head>
                <title>Phiếu kiểm kê kho</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 24px;
                        color: #000;
                    }
                    h1 {
                        margin: 0 0 10px;
                        font-size: 28px;
                    }
                    .meta {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 6px 20px;
                        font-size: 14px;
                        margin-bottom: 16px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 16px;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        font-size: 14px;
                        vertical-align: middle;
                    }
                    th {
                        background: #f3f3f3;
                    }
                    .summary {
                        margin-top: 20px;
                        width: 350px;
                    }
                    .summary table {
                        margin-top: 0;
                    }
                    .summary td {
                        padding: 6px 8px;
                    }
                    .signature {
                        margin-top: 40px;
                        display: flex;
                        justify-content: space-between;
                        text-align: center;
                    }
                    .signature div {
                        width: 220px;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>PHIẾU KIỂM KÊ KHO</h1>

                <div class="meta">
                    <div><strong>Mã phiếu:</strong> ${detail?.code || ""}</div>
                    <div><strong>Kho:</strong> ${warehouseName}</div>
                    <div><strong>Ngày kiểm kê:</strong> ${detail?.audit_date ? formatCustom(detail.audit_date) : ""
            }</div>
                    <div><strong>Người kiểm kê:</strong> ${detail?.created_by || ""}</div>
                    <div><strong>Ngày in:</strong> ${new Date().toLocaleString("vi-VN")}</div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Sản phẩm</th>
                            <th>Hệ thống</th>
                            <th>Thực tế</th>
                            <th>Chênh lệch</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="6" style="text-align:center;">Không có sản phẩm</td></tr>`}
                    </tbody>
                </table>

                <div class="summary">
                    <table>
                        <tr>
                            <td>Tổng tồn hệ thống</td>
                            <td>${totalStock}</td>
                        </tr>
                        <tr>
                            <td>Tồn thực tế</td>
                            <td>${totalActual}</td>
                        </tr>
                        <tr>
                            <td>Tổng chênh lệch</td>
                            <td>${totalDiff}</td>
                        </tr>
                        <tr>
                            <td>Dòng lệch</td>
                            <td>${totalDiffRows}</td>
                        </tr>
                    </table>
                </div>

                <div class="signature">
                    <div>
                        <p>Người kiểm kê</p>
                        <br /><br />
                        <strong>${detail?.created_by || ""}</strong>
                    </div>
                    <div>
                        <p>Giám đốc điều hành</p>
                        <br /><br />
                        <strong>${detail?.approved_by || "Lâm Chí Lộc"}</strong>
                    </div>
                </div>
            </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };
    return (
        <div className="inventory-audit-detail-page">
            <SEO title="Chi tiết phiếu kiểm kê kho" />

            <div className="inventory-audit-detail-page__top">
                <div>
                    <h2 className="inventory-audit-detail-page__title">
                        Chi tiết phiếu kiểm kê
                    </h2>
                    <p className="inventory-audit-detail-page__desc">
                        Xem thông tin phiếu kiểm kê, danh sách sản phẩm và kết quả đối chiếu tồn kho.
                    </p>
                </div>

                <div className="inventory-audit-detail-page__actions">
                    <Link
                        to="/admin/products/inventory/audit/list"
                        className="inventory-audit-detail-btn inventory-audit-detail-btn--light"
                    >
                        Quay lại
                    </Link>

                    <button className="inventory-audit-detail-btn" onClick={handlePrint}>
                        In phiếu
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="inventory-audit-detail-loading">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="inventory-audit-paper">
                    <div className="inventory-audit-paper__header">
                        <h1 className="inventory-audit-paper__heading">
                            PHIẾU KIỂM KÊ KHO
                        </h1>

                        <div className="inventory-audit-paper__meta">
                            <div className="inventory-audit-paper__meta-col">
                                <p>
                                    <strong>Mã phiếu:</strong> {detail?.code}
                                </p>
                                <p>
                                    <strong>Ngày kiểm kê:</strong>{" "}
                                    {formatCustom(detail?.audit_date)}
                                </p>
                                <p>
                                    <strong>Ngày in:</strong> {formatCustom(detail?.audit_date)}
                                </p>
                            </div>

                            <div className="inventory-audit-paper__meta-col">
                                <p>
                                    <strong>Kho:</strong> {detail?.warehouse?.name}
                                </p>
                                <p>
                                    <strong>Người kiểm kê:</strong> {detail?.created_by}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="inventory-audit-paper__table-wrap">
                        <div className="inventory-audit-paper__table">
                            <div className="inventory-audit-paper__thead">
                                <div>STT</div>
                                <div>Sản phẩm</div>
                                <div>Hệ thống</div>
                                <div>Thực tế</div>
                                <div>Chênh lệch</div>
                                <div>Trạng thái</div>
                            </div>

                            {detail?.items?.length > 0 ? (
                                detail.items.map((item, index) => (
                                    <div className="inventory-audit-paper__row" key={item._id || index}>
                                        <div className="inventory-audit-paper__stt">
                                            {index + 1}
                                        </div>

                                        <div className="inventory-audit-paper__product">
                                            <div className="inventory-audit-paper__thumb">
                                                <img
                                                    src={item?.product?.thumbnail}
                                                    alt={item?.product?.title}
                                                />
                                            </div>

                                            <div className="inventory-audit-paper__product-info">
                                                <h4>{item?.product?.title}</h4>
                                                <p>{item?.product?.slug}</p>
                                            </div>
                                        </div>

                                        <div className="inventory-audit-paper__qty">
                                            {item?.system_qty ?? 0}
                                        </div>

                                        <div className="inventory-audit-paper__qty">
                                            {item?.actual_qty ?? 0}
                                        </div>

                                        <div
                                            className={`inventory-audit-paper__qty ${Number(item?.diff_qty) !== 0 ? "is-diff" : ""
                                                }`}
                                        >
                                            {item?.diff_qty ?? 0}
                                        </div>

                                        <div className="inventory-audit-paper__status">
                                            <span
                                                className={`inventory-audit-status inventory-audit-status--${getStatusClass(
                                                    item?.status
                                                )}`}
                                            >
                                                {item?.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="inventory-audit-paper__empty">
                                    Không có sản phẩm nào trong phiếu kiểm kê
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="inventory-audit-paper__summary">
                        <div className="inventory-audit-summary-card">
                            <span>Tổng tồn hệ thống</span>
                            <strong>{summary.totalSystem}</strong>
                        </div>

                        <div className="inventory-audit-summary-card">
                            <span>Tồn thực tế</span>
                            <strong>{summary.totalActual}</strong>
                        </div>

                        <div className="inventory-audit-summary-card">
                            <span>Tổng chênh lệch</span>
                            <strong>{summary.totalDiff}</strong>
                        </div>

                        <div className="inventory-audit-summary-card">
                            <span>Dòng lệch</span>
                            <strong>{summary.totalDiffRows}</strong>
                        </div>
                    </div>

                    <div className="inventory-audit-paper__signatures">
                        <div className="inventory-audit-sign-box">
                            <p className="inventory-audit-sign-box__label">
                                Người kiểm kê
                            </p>
                            <div className="inventory-audit-sign-box__space" />
                            <p className="inventory-audit-sign-box__name">
                                {detail?.created_by}
                            </p>
                        </div>

                        <div className="inventory-audit-sign-box">
                            <p className="inventory-audit-sign-box__label">
                                Giám đốc điều hành
                            </p>
                            <div className="inventory-audit-sign-box__space" />
                            <p className="inventory-audit-sign-box__name">
                                {detail?.approved_by || "Lâm Chí Lộc"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InventoryAuditDetail;