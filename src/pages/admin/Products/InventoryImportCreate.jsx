import "./InventoryImportCreate.scss";
import SEO from "../../../utils/SEO";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getListProductNoQuery } from "../../../services/admin/product.admin.service";
import { getWarehouseList } from "../../../services/admin/warehouse.service";
import { inventoryImport } from "../../../services/admin/InventoryTransaction.service";
import { error, success } from "../../../utils/notift";
import Loading from "../../../utils/loading";
import {generateInventoryRefId} from "../../../utils/generateInventoryRefId"; 
import { MdOutlineKeyboardBackspace } from "react-icons/md";


function InventoryImportCreate() {
    const [products, setProducts] = useState([]);
    const [warehouse, setWarehouse] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        warehouse: "",
        code: generateInventoryRefId("NK"),
        date: "",
        createdBy: "",
        note: "",
        items: [],
    });

    const [items, setItems] = useState([
        {
            id: Date.now(),
            productId: "",
            quantity: 1,
            importPrice: 0,
        },
    ]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                setLoading(true);
                const res = await getListProductNoQuery();
                setProducts(res?.data?.products || []);
            } catch (err) {
                console.log(err?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApi();
    }, []);

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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                productId: "",
                quantity: 1,
                importPrice: 0,
            },
        ]);
    };

    const removeItem = (id) => {
        setItems((prev) => {
            if (prev.length === 1) return prev;
            return prev.filter((item) => item.id !== id);
        });
    };

    const updateItem = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]:
                            field === "productId"
                                ? value
                                : Math.max(0, Number(value) || 0),
                    }
                    : item
            )
        );
    };

    const getProductById = (productId) => {
        return products.find((p) => String(p._id) === String(productId));
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString("vi-VN") + " VND";
    };

    const summary = useMemo(() => {
        const selectedRows = items.filter((item) => item.productId).length;
        const totalQuantity = items.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );
        const totalValue = items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0) * Number(item.importPrice || 0),
            0
        );

        return {
            selectedRows,
            totalQuantity,
            totalValue,
        };
    }, [items]);

    const [loadingPost, setLoadingPost] = useState(false)
    const handleImport = async (e) => {
        e.preventDefault();
        setLoadingPost(true);

        try {
            const payload = {
                ...form,
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    importPrice: item.importPrice,
                })),
            };

            const res = await inventoryImport(payload);

            if (res.data?.code) {
                success(res.data?.message);
            }
        } catch (err) {
            error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoadingPost(false);
        }
    };



    return (
        <div className="inventory-import-page">
            <SEO title="Nhập kho" />
            {loadingPost && <Loading/> }

            <div className="inventory-import-page__header">
                <div>
                    <h2>Nhập kho</h2>
                    <p>Tạo phiếu nhập và cập nhật tồn kho sản phẩm</p>
                </div>
                <Link to={"/admin/products/inventory/import/list"}>
                   <MdOutlineKeyboardBackspace/> Quay lại
                </Link>
            </div>

            <div className="inventory-import-layout">
                <div className="inventory-import-main">
                    <section className="inventory-card">
                        <div className="inventory-card__header">
                            <h3>Thông tin phiếu nhập</h3>
                        </div>

                        <div className="inventory-form-grid">
                            <div className="inventory-form-group">
                                <label>Kho nhập</label>
                                <select
                                    name="warehouse"
                                    value={form.warehouse}
                                    onChange={handleFormChange}
                                >
                                    <option value="" >-- Chọn kho nhập --</option>
                                    {warehouse.map(item => (
                                        <option value={item._id} key={item._id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="inventory-form-group">
                                <label>Mã phiếu</label>
                                <input
                                    name="code"
                                    value={form.code}
                                    onChange={handleFormChange}
                                    placeholder="Nhập mã phiếu"
                                />
                            </div>

                            <div className="inventory-form-group">
                                <label>Ngày nhập</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleFormChange}
                                />
                            </div>

                            <div className="inventory-form-group">
                                <label>Người lập phiếu</label>
                                <input
                                    name="createdBy"
                                    value={form.createdBy}
                                    onChange={handleFormChange}
                                    placeholder="Nhập người lập phiếu"
                                />
                            </div>

                            <div className="inventory-form-group inventory-form-group--full">
                                <label>Ghi chú</label>
                                <textarea
                                    name="note"
                                    rows="4"
                                    value={form.note}
                                    onChange={handleFormChange}
                                    placeholder="Nhập ghi chú chi tiết về lô hàng..."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="inventory-card">
                        <div className="inventory-card__header inventory-card__header--between">
                            <h3>Danh sách sản phẩm</h3>

                            <button
                                type="button"
                                className="btn btn-soft-primary"
                                onClick={addItem}
                            >
                                + Thêm sản phẩm
                            </button>
                        </div>

                        <div className="inventory-product-table">
                            <div className="inventory-product-table__head">
                                <div>Sản phẩm</div>
                                <div>Số lượng</div>
                                <div>Giá nhập (VND)</div>
                                <div>Thành tiền</div>
                                <div></div>
                            </div>

                            {items.map((item) => {
                                const product = getProductById(item.productId);
                                const subtotal =
                                    Number(item.quantity || 0) *
                                    Number(item.importPrice || 0);

                                return (
                                    <div
                                        className="inventory-product-table__row"
                                        key={item.id}
                                    >
                                        <div className="inventory-product-cell">
                                            <div className="inventory-product-cell__thumb">
                                                {product?.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                    />
                                                ) : (
                                                    <div className="inventory-product-cell__placeholder">
                                                        IMG
                                                    </div>
                                                )}
                                            </div>

                                            <div className="inventory-product-cell__info">
                                                <select
                                                    value={item.productId}
                                                    onChange={(e) => {
                                                        updateItem(
                                                            item.id,
                                                            "productId",
                                                            e.target.value
                                                        )

                                                    }}
                                                >
                                                    <option value="">
                                                        -- Chọn sản phẩm --
                                                    </option>
                                                    {products.map((p) => (
                                                        <option
                                                            key={p._id}
                                                            value={p._id}
                                                        >
                                                            {p.title}
                                                        </option>
                                                    ))}
                                                </select>

                                                {product && (
                                                    <>
                                                        <strong>{product.title}</strong>
                                                        <span>
                                                            SKU:{" "}
                                                            {product.sku ||
                                                                product.slug ||
                                                                "N/A"}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="number"
                                                value={item.importPrice}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "importPrice",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="inventory-money">
                                            {formatCurrency(subtotal)}
                                        </div>

                                        <div className="inventory-product-table__action">
                                            <button
                                                type="button"
                                                className="btn-icon btn-icon-danger"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!loading && products.length === 0 && (
                            <div className="inventory-empty">
                                Chưa có sản phẩm để chọn.
                            </div>
                        )}
                    </section>
                </div>

                <aside className="inventory-import-side">
                    <section className="inventory-card inventory-summary-card">
                        <h3>Tổng kết phiếu nhập</h3>

                        <div className="inventory-summary-row">
                            <span>Số lượng mặt hàng</span>
                            <strong>
                                {String(summary.selectedRows).padStart(2, "0")} Sản phẩm
                            </strong>
                        </div>

                        <div className="inventory-summary-row">
                            <span>Tổng số lượng</span>
                            <strong>{summary.totalQuantity} sản phẩm</strong>
                        </div>

                        <div className="inventory-summary-total">
                            <span>Tổng giá trị</span>
                            <h2>{summary.totalValue.toLocaleString("vi-VN")}</h2>
                            <small>VND</small>
                        </div>

                        <div className="inventory-summary-note">
                            <strong>Lưu ý:</strong> Sau khi hoàn tất, số lượng tồn
                            kho của các sản phẩm trên sẽ được cộng trực tiếp vào kho
                            đã chọn. Hành động này không thể hoàn tác dễ dàng.
                        </div>

                        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={handleImport}>
                            Hoàn tất nhập kho
                        </button>
                    </section>

                    <section className="inventory-card inventory-quick-actions">
                        <button type="button" className="inventory-quick-btn">
                            In nhãn sản phẩm
                        </button>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default InventoryImportCreate;