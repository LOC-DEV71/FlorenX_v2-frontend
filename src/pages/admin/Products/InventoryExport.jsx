import "./InventoryExport.scss";
import SEO from "../../../utils/SEO";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { success, error } from "../../../utils/notift";

function InventoryExport() {
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouse_id: "",
        ref_code: `EXP-${Date.now()}`,
        export_date: new Date().toISOString().slice(0, 10),
        customer_name: "",
        note: ""
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            available_stock: 0
        }
    ]);

    useEffect(() => {
        setWarehouses([
            { _id: "w1", name: "Kho HCM" },
            { _id: "w2", name: "Kho Hà Nội" }
        ]);

        setProducts([
            { _id: "p1", title: "iPhone 15", sku: "IP15", stock: 20 },
            { _id: "p2", title: "MacBook Air M3", sku: "MBA-M3", stock: 12 },
            { _id: "p3", title: "AirPods Pro", sku: "APP2", stock: 30 }
        ]);
    }, []);

    const handleChangeForm = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleChangeItem = (index, key, value) => {
        setItems((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;

                if (key === "product_id") {
                    const selectedProduct = products.find((p) => p._id === value);
                    return {
                        ...item,
                        product_id: value,
                        available_stock: selectedProduct?.stock || 0
                    };
                }

                return {
                    ...item,
                    [key]: key === "quantity" ? Number(value) : value
                };
            })
        );
    };

    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            {
                product_id: "",
                quantity: 1,
                available_stock: 0
            }
        ]);
    };

    const handleRemoveItem = (index) => {
        if (items.length === 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const totalQuantity = useMemo(
        () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
        [items]
    );

    const validateForm = () => {
        if (!form.warehouse_id) {
            error("Vui lòng chọn kho xuất");
            return false;
        }

        for (const item of items) {
            if (!item.product_id) {
                error("Vui lòng chọn sản phẩm");
                return false;
            }

            if (!item.quantity || item.quantity <= 0) {
                error("Số lượng xuất phải lớn hơn 0");
                return false;
            }

            if (item.quantity > item.available_stock) {
                error("Có sản phẩm xuất vượt quá tồn kho");
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                ...form,
                items
            };

            console.log("EXPORT PAYLOAD:", payload);
            success("Tạo phiếu xuất kho thành công");
        } catch (err) {
            error(err.response?.data?.message || "Tạo phiếu xuất thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inventory-page">
            <SEO title="Xuất kho" />

            <div className="inventory-page__header">
                <div>
                    <h2>Xuất kho</h2>
                    <p>Tạo phiếu xuất và trừ tồn kho sản phẩm</p>
                </div>

                <div className="inventory-page__actions">
                    <Link to="/admin/products" className="btn btn-light">
                        Quay lại
                    </Link>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu phiếu xuất"}
                    </button>
                </div>
            </div>

            <form className="inventory-layout" onSubmit={handleSubmit}>
                <div className="inventory-main-card">
                    <div className="card">
                        <div className="card__header">
                            <h3>Thông tin phiếu xuất</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Kho xuất</label>
                                <select
                                    value={form.warehouse_id}
                                    onChange={(e) => handleChangeForm("warehouse_id", e.target.value)}
                                >
                                    <option value="">-- Chọn kho --</option>
                                    {warehouses.map((wh) => (
                                        <option key={wh._id} value={wh._id}>
                                            {wh.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Mã phiếu</label>
                                <input
                                    value={form.ref_code}
                                    onChange={(e) => handleChangeForm("ref_code", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Ngày xuất</label>
                                <input
                                    type="date"
                                    value={form.export_date}
                                    onChange={(e) => handleChangeForm("export_date", e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Khách hàng</label>
                                <input
                                    value={form.customer_name}
                                    onChange={(e) => handleChangeForm("customer_name", e.target.value)}
                                    placeholder="Tên khách hàng / đơn vị nhận"
                                />
                            </div>

                            <div className="form-group form-group--full">
                                <label>Ghi chú</label>
                                <textarea
                                    rows="4"
                                    value={form.note}
                                    onChange={(e) => handleChangeForm("note", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header card__header--between">
                            <h3>Sản phẩm xuất</h3>
                            <button type="button" className="btn btn-success" onClick={handleAddItem}>
                                + Thêm sản phẩm
                            </button>
                        </div>

                        <div className="inventory-table">
                            <div className="inventory-table__head">
                                <div>Sản phẩm</div>
                                <div>Tồn hiện tại</div>
                                <div>Số lượng xuất</div>
                                <div>Trạng thái</div>
                                <div>Thao tác</div>
                            </div>

                            {items.map((item, index) => (
                                <div className="inventory-table__row" key={index}>
                                    <div>
                                        <select
                                            value={item.product_id}
                                            onChange={(e) =>
                                                handleChangeItem(index, "product_id", e.target.value)
                                            }
                                        >
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {products.map((product) => (
                                                <option key={product._id} value={product._id}>
                                                    {product.title} - {product.sku}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="stock-number">{item.available_stock}</div>

                                    <div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleChangeItem(index, "quantity", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <span
                                            className={`stock-badge ${
                                                item.quantity > item.available_stock
                                                    ? "stock-badge--danger"
                                                    : "stock-badge--ok"
                                            }`}
                                        >
                                            {item.quantity > item.available_stock
                                                ? "Vượt tồn"
                                                : "Hợp lệ"}
                                        </span>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-danger-outline"
                                            onClick={() => handleRemoveItem(index)}
                                        >
                                            Xoá
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="inventory-side-card">
                    <div className="card summary-card">
                        <h3>Tổng kết phiếu xuất</h3>

                        <div className="summary-row">
                            <span>Số dòng sản phẩm</span>
                            <strong>{items.length}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Tổng số lượng xuất</span>
                            <strong>{totalQuantity}</strong>
                        </div>

                        <div className="summary-note">
                            Khi lưu phiếu:
                            <ul>
                                <li>Stock sẽ giảm theo từng sản phẩm</li>
                                <li>InventoryTransaction sẽ ghi type = export hoặc sale</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default InventoryExport;