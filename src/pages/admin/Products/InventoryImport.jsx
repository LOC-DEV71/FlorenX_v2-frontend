import "./InventoryImport.scss";
import SEO from "../../../utils/SEO";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { success, error } from "../../../utils/notift";

// Demo services - thay bằng service thật của anh
// import { getWarehouses } from "../../../services/admin/warehouse.admin.service";
// import { getProducts } from "../../../services/admin/product.admin.service";
// import { createImportReceipt } from "../../../services/admin/inventory.admin.service";

function InventoryImport() {
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouse_id: "",
        ref_code: `IMP-${Date.now()}`,
        import_date: new Date().toISOString().slice(0, 10),
        note: ""
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1,
            import_price: 0
        }
    ]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);

                // fake data
                setWarehouses([
                    { _id: "w1", name: "Kho HCM" },
                    { _id: "w2", name: "Kho Hà Nội" }
                ]);

                setProducts([
                    { _id: "p1", title: "iPhone 15", sku: "IP15", thumbnail: "" },
                    { _id: "p2", title: "MacBook Air M3", sku: "MBA-M3", thumbnail: "" },
                    { _id: "p3", title: "AirPods Pro", sku: "APP2", thumbnail: "" }
                ]);
            } catch (err) {
                error(err.response?.data?.message || "Không tải được dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, []);

    const handleChangeForm = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleChangeItem = (index, key, value) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [key]: key === "quantity" || key === "import_price"
                            ? Number(value)
                            : value
                    }
                    : item
            )
        );
    };

    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            {
                product_id: "",
                quantity: 1,
                import_price: 0
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

    const totalAmount = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum + (Number(item.quantity) || 0) * (Number(item.import_price) || 0),
                0
            ),
        [items]
    );

    const validateForm = () => {
        if (!form.warehouse_id) {
            error("Vui lòng chọn kho nhập");
            return false;
        }

        for (const item of items) {
            if (!item.product_id) {
                error("Vui lòng chọn đầy đủ sản phẩm");
                return false;
            }

            if (!item.quantity || item.quantity <= 0) {
                error("Số lượng nhập phải lớn hơn 0");
                return false;
            }

            if (item.import_price < 0) {
                error("Giá nhập không hợp lệ");
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

            console.log("IMPORT PAYLOAD:", payload);

            // const res = await createImportReceipt(payload);
            success("Tạo phiếu nhập kho thành công");
        } catch (err) {
            error(err.response?.data?.message || "Tạo phiếu nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inventory-page">
            <SEO title="Nhập kho" />

            <div className="inventory-page__header">
                <div>
                    <h2>Nhập kho</h2>
                    <p>Tạo phiếu nhập và cập nhật tồn kho sản phẩm</p>
                </div>

                <div className="inventory-page__actions">
                    <Link to="/admin/products" className="btn btn-light">
                        Quay lại
                    </Link>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu phiếu nhập"}
                    </button>
                </div>
            </div>

            <form className="inventory-layout" onSubmit={handleSubmit}>
                <div className="inventory-main-card">
                    <div className="card">
                        <div className="card__header">
                            <h3>Thông tin phiếu nhập</h3>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Kho nhập</label>
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
                                    placeholder="Mã phiếu nhập"
                                />
                            </div>

                            <div className="form-group">
                                <label>Ngày nhập</label>
                                <input
                                    type="date"
                                    value={form.import_date}
                                    onChange={(e) => handleChangeForm("import_date", e.target.value)}
                                />
                            </div>

                            <div className="form-group form-group--full">
                                <label>Ghi chú</label>
                                <textarea
                                    rows="4"
                                    value={form.note}
                                    onChange={(e) => handleChangeForm("note", e.target.value)}
                                    placeholder="Ghi chú phiếu nhập..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card__header card__header--between">
                            <h3>Sản phẩm nhập</h3>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleAddItem}
                            >
                                + Thêm sản phẩm
                            </button>
                        </div>

                        <div className="inventory-table">
                            <div className="inventory-table__head">
                                <div>Sản phẩm</div>
                                <div>Số lượng</div>
                                <div>Giá nhập</div>
                                <div>Thành tiền</div>
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
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.import_price}
                                            onChange={(e) =>
                                                handleChangeItem(index, "import_price", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="money">
                                        {(
                                            (Number(item.quantity) || 0) *
                                            (Number(item.import_price) || 0)
                                        ).toLocaleString("vi-VN")}đ
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
                        <h3>Tổng kết phiếu nhập</h3>

                        <div className="summary-row">
                            <span>Số dòng sản phẩm</span>
                            <strong>{items.length}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Tổng số lượng</span>
                            <strong>{totalQuantity}</strong>
                        </div>

                        <div className="summary-row">
                            <span>Tổng giá trị</span>
                            <strong>{totalAmount.toLocaleString("vi-VN")}đ</strong>
                        </div>

                        <div className="summary-note">
                            Khi lưu phiếu:
                            <ul>
                                <li>Stock sẽ tăng theo từng sản phẩm</li>
                                <li>InventoryTransaction sẽ ghi type = import</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default InventoryImport;