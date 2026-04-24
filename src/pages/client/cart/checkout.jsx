import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./Checkout.scss";
import {
  checkOut,
  createVnpayPayment,
  createRepayPayment
} from "../../../services/client/checkOut";
import { useSelector } from "react-redux";

function Checkout() {
  const location = useLocation();
  const products = location.state?.data || [];
  const totalProduct = location.state?.subtotal || 0;
  const account = useSelector((state) => state.authClient.user);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  const [useAccountInfo, setUseAccountInfo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (useAccountInfo && account) {
      setForm((prev) => ({
        ...prev,
        name: account.fullname || "",
        phone: account.phone || "",
        address: account.address || ""
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        name: "",
        phone: "",
        address: ""
      }));
    }
  }, [useAccountInfo, account]);

  const isFormValid =
    form.name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.address.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const buildPayload = (method, extra = {}) => {
    return {
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      note: form.note,
      products,
      total: totalProduct,
      paymentMethod: method,
      ...extra
    };
  };

  const handleCOD = async () => {
    if (!isFormValid || loading) return;

    try {
      setLoading(true);

      const payload = buildPayload("COD", {
        paymentStatus: "UNPAID"
      });

      const res = await checkOut(payload);
      console.log("COD success:", res);

      setSuccessMessage("Đặt hàng COD thành công");
    } catch (error) {
      console.error("COD failed:", error);
      alert("Đặt hàng COD thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleVNPay = async () => {
    if (!isFormValid || loading) return;

    try {
      setLoading(true);

      const payload = buildPayload("VNPAY", {
        paymentStatus: "PENDING"
      });

      const res = await createVnpayPayment(payload);
      console.log("VNPAY response:", res);

      const paymentUrl = res?.data?.paymentUrl || res?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không lấy được link thanh toán VNPAY");
      }
    } catch (error) {
      console.error("VNPAY failed:", error);
      alert("Khởi tạo thanh toán VNPAY thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!isFormValid || loading) return;

    try {
      setLoading(true);

      const payload = buildPayload("REPAY", {
        paymentStatus: "PENDING"
      });

      const res = await createRepayPayment(payload);
      console.log("REPAY response:", res);

      const paymentUrl = res?.data?.paymentUrl || res?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Không lấy được link thanh toán lại");
      }
    } catch (error) {
      console.error("REPAY failed:", error);
      alert("Khởi tạo thanh toán lại thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalSuccess = async (orderID, details) => {
    try {
      setLoading(true);

      const payload = buildPayload("PAYPAL", {
        paymentStatus: "PAID",
        paypalOrderId: orderID,
        paypalDetails: details
      });

      const res = await checkOut(payload);
      console.log("PAYPAL success:", res);

      setSuccessMessage("Thanh toán PayPal và đặt hàng thành công");
    } catch (error) {
      console.error("PAYPAL checkout failed:", error);
      alert("Thanh toán PayPal thành công nhưng gửi đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div className="checkout__left">
          <h2 className="checkout__title">Thông tin nhận hàng</h2>

          <div className="checkout__form">
            <div className="checkout__group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                placeholder="Nhập họ và tên"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="checkout__group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="checkout__group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="checkout__group">
              <label>Ghi chú</label>
              <textarea
                name="note"
                rows="4"
                placeholder="Nhập ghi chú"
                value={form.note}
                onChange={handleChange}
              />
            </div>

            <div className="checkout__account-box">
              <label className="checkout__account-check" htmlFor="change">
                <input
                  type="checkbox"
                  id="change"
                  checked={useAccountInfo}
                  onChange={(e) => setUseAccountInfo(e.target.checked)}
                />
                <span>Dùng thông tin tài khoản</span>
              </label>

              <div className="checkout__account-info">
                <p>
                  <strong>Họ tên:</strong> {account?.fullname || "Chưa có dữ liệu"}
                </p>
                <p>
                  <strong>SĐT:</strong> {account?.phone || "Chưa có dữ liệu"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {account?.address || "Chưa có dữ liệu"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout__right">
          <h2 className="checkout__title">Thanh toán</h2>

          <div className="checkout__summary">
            <div className="checkout__row">
              <span>Số sản phẩm</span>
              <span>{products.length}</span>
            </div>
            <div className="checkout__row">
              <span>Tổng tiền</span>
              <span>{totalProduct.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>

          <div className="checkout__payment">
            <h3 className="checkout__subtitle">Chọn phương thức thanh toán</h3>

            <label
              className={`checkout__method ${
                paymentMethod === "COD" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>

            <label
              className={`checkout__method ${
                paymentMethod === "VNPAY" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán VNPAY</span>
            </label>

            <label
              className={`checkout__method ${
                paymentMethod === "PAYPAL" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="PAYPAL"
                checked={paymentMethod === "PAYPAL"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán PayPal</span>
            </label>

            <label
              className={`checkout__method ${
                paymentMethod === "REPAY" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="REPAY"
                checked={paymentMethod === "REPAY"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Thanh toán lại</span>
            </label>
          </div>

          {!isFormValid && (
            <p className="checkout__warning">
              Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ trước khi thanh toán.
            </p>
          )}

          {successMessage && (
            <div className="checkout__success">{successMessage}</div>
          )}

          <div className="checkout__action">
            {paymentMethod === "COD" && (
              <button
                className="checkout__button"
                disabled={!isFormValid || loading}
                onClick={handleCOD}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng COD"}
              </button>
            )}

            {paymentMethod === "VNPAY" && (
              <button
                className="checkout__button checkout__button--vnpay"
                disabled={!isFormValid || loading}
                onClick={handleVNPay}
              >
                {loading ? "Đang xử lý..." : "Thanh toán với VNPAY"}
              </button>
            )}

            {paymentMethod === "REPAY" && (
              <button
                className="checkout__button checkout__button--repay"
                disabled={!isFormValid || loading}
                onClick={handleRepay}
              >
                {loading ? "Đang xử lý..." : "Thanh toán lại"}
              </button>
            )}

            {paymentMethod === "PAYPAL" && (
              <div
                className={
                  !isFormValid || loading
                    ? "checkout__paypal checkout__paypal--disabled"
                    : "checkout__paypal"
                }
              >
                <PayPalScriptProvider
                  options={{
                    "client-id":
                      "AVLmCQeDTY4V61Oz3EDPhSaDLkIAMEy8ldzQHa7Q5BingPpqAntPqRoI40NY-8TKbxlJrkaZad9nNb1t",
                    currency: "USD"
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    disabled={!isFormValid || loading}
                    forceReRender={[totalProduct, isFormValid]}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: (totalProduct / 24000).toFixed(2)
                            }
                          }
                        ]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(async (details) => {
                        await handlePaypalSuccess(data.orderID, details);
                      });
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      alert("Có lỗi khi thanh toán PayPal");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;