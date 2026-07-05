import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./checkout.scss";
import { useSelector } from "react-redux";
import { error, success } from "../../../utils/notift";
import { getVoucher } from "../../../services/client/voucher.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { capturePaypalOrder, createPaypalOrder, OrderSubmit, getPaymentConfig } from "../../../services/client/checkout.service";
import { getTiers } from "../../../services/client/tier.client.service";
import Loading from "../../../utils/loading";
import { useSocket } from "../../../Socket/useSocket";
import LocationSelector from "../../../components/client/LocationSelector/LocationSelector";

function Checkout() {
  const location = useLocation();
  const naviagte = useNavigate();
  const products = location.state?.data || [];
  const account = useSelector((state) => state.authClient.user);
  const [loading, setLoading] = useState(false)
  const [orderReturn, setOrderReturn] = useState([]);
  const socket = useSocket();
  const [useAccountInfo, setUseAccountInfo] = useState(false);

  const totalPrice = products.reduce(
    (total, item) =>
      total + (item.price - item.price * item.discountPercentage / 100)*item.quantity,
    0
  );

  const productSnapshots = products?.map(item => ({
    productId: item._id,
    title: item.title,
    thumbnail: item.thumbnail,
    price: item.price,
    discountPercentage: item.discountPercentage,
    quantity: item.quantity,
    finalPrice: item.price - (item.price * item.discountPercentage / 100),
    slug: item.slug
  }));

  const [form, setForm] = useState({
    fullname: "",
    address: "",
    phone: "",
    email: "",
    voucher: "",
    typeVoucher: "",
    valueVoucher: "",
    maxVoucher: "",
    minOrderValue: "",
    pay: "cod",
    products: productSnapshots 
  });

  const [vouchers, setVouchers] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [banks, setBanks] = useState([]);

  // useEffect(() => {
  //   setForm(prev => ({
  //     ...prev,
  //     products: productSnapshots
  //   }));
  // }, [products]);

  const memberDiscount = (() => {
    if (!account || !account.member || !tiers.length) return 0;
    const memberTier = account.member.toLowerCase();
    const tierConfig = tiers.find(t => t.slug === memberTier);

    if (!tierConfig) return 0;
    if (totalPrice < tierConfig.minOrderValue) return 0;
    const discountAmount = totalPrice * (tierConfig.discountRate / 100);
    return Math.min(discountAmount, tierConfig.maxDiscount);
  })();


  useEffect(() => {
    const fetchApi = async () => {
      const res = await getVoucher();
      if (res?.data?.code) {
        setVouchers(res.data.vouchers);
      }
      const tiersRes = await getTiers();
      if (tiersRes?.data) {
        setTiers(tiersRes.data);
      }
      const paymentRes = await getPaymentConfig();
      if (paymentRes?.data?.code === 200) {
        setBanks(paymentRes.data.banks);
      }
    };
    fetchApi();
  }, []);

  const discountVoucher = (() => {
    if (!form.voucher) return 0;
    if (totalPrice < form.minOrderValue) return 0;

    if (form.typeVoucher === "percentage") {
      const percentDiscount = totalPrice * form.valueVoucher / 100;
      return Math.min(percentDiscount, form.maxVoucher || Infinity);
    }
    return form.valueVoucher;
  })();

  const finalTotal = Math.max(totalPrice - discountVoucher - memberDiscount, 0);

  const checkInfo = () => {
    if (!form.fullname.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      error("Vui lòng nhập đầy đủ thông tin người nhận");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!checkInfo()) return;
    setLoading(true)
    try {
      const res = await OrderSubmit({
        ...form,
        totalPrice: finalTotal
      });

      if (res?.data?.code) {
        const order = res.data.orderReturn;
        socket.emit("newOrder", {
          order
        });
        console.log("Checkout socket ID:", socket.id)
        success(res?.data?.message || "Đặt hàng thành công");
        naviagte(`/order-success/${res?.data?.orderReturn?.code}`);
      }
    } catch (err) {
      error(err.response?.data?.message || "Đặt hàng thất bại");
    } finally{
      setLoading(false)
    }
  };


  return (
    <div className="checkout">
      {loading && <Loading/>}
      <div className="checkout__wrapper">
        <h1 className="checkout__title">THANH TOÁN</h1>

        <div className="checkout__container">

          <div className="checkout__summary">
            <h2>Tóm tắt đơn hàng</h2>

            {products.map(item => (
              <div className="item" key={item._id}>
                <img src={item.thumbnail} alt={item.title} />
                <div className="info">
                  <div className="price">
                    {(item.price - item.price * item.discountPercentage / 100).toLocaleString("vi-VN")} VNĐ
                  </div>
                  <div>
                    <p>{item.title}</p>
                    <div className="qty"><span> x {item.quantity}</span></div>
                  </div>
                </div>
              </div>
            ))}

            <div className="discount">
              <h3>Chọn mã giảm giá</h3>

              <div>
                {vouchers.map(item => (
                  <div
                    className={`item ${form.voucher === item?.code ? "active" : ""} ${item.isUsed ? "disabled" : ""}`}
                    key={item?._id}
                    style={item.isUsed ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "auto" } : {}}
                    onClick={() => {
                      if (item.isUsed) {
                        error("Bạn đã sử dụng mã giảm giá này rồi.");
                        return;
                      }
                      setForm(prev => ({
                        ...prev,
                        voucher: prev.voucher === item?.code ? "" : item?.code,
                        typeVoucher: prev.voucher === item?.code ? "" : item.discountType,
                        valueVoucher: prev.voucher === item?.code ? "" : item.discountValue,
                        maxVoucher: prev.voucher === item?.code ? "" : item.maxDiscount,
                        minOrderValue: prev.voucher === item?.code ? "" : item.minOrderValue
                      }));
                    }}
                  >
                    <div className="left">
                      <div className="code">{item?.code}</div>
                      <div className="desc">{item?.description}</div>
                      <div className="date">
                        Từ {formatCustom(item?.startDate)} - {formatCustom(item?.endDate)}
                      </div>
                    </div>
                    <div className="right">
                      {item.isUsed ? "Đã sử dụng" : (form.voucher === item?.code ? "Đã áp dụng" : "Áp dụng")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="calc">
              <div>
                <span>Tạm tính</span>
                <span>{totalPrice.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div>
                <span>Giảm giá Voucher</span>
                <span className="red">- {discountVoucher.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div>
                <span>Ưu đãi thành viên ({account?.member || "N/A"})</span>
                <span className="red">- {memberDiscount.toLocaleString("vi-VN")} VNĐ</span>
              </div>
              <div>
                <span>Phí vận chuyển</span>
                <span className="delivery">Miễn Phí</span>
              </div>
            </div>

            <div className="total">
              <span>Tổng cộng</span>
              <span>{finalTotal.toLocaleString("vi-VN")} VNĐ</span>
            </div>
          </div>

          {/* ===== FORM GIỮ NGUYÊN ===== */}
          <div className="checkout__form">
            <h2>Thông tin giao hàng</h2>

            <input
              placeholder="Họ và tên"
              value={form.fullname}
              onChange={e => setForm({ ...form, fullname: e.target.value })}
            />

            <div className="row">
              <input
                placeholder="Địa chỉ Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {!useAccountInfo && (
              <LocationSelector 
                onChange={(addr) => setForm(prev => ({ ...prev, address: addr }))} 
              />
            )}
            
            {useAccountInfo && (
              <input
                placeholder="Địa chỉ nhận hàng"
                value={form.address}
                disabled
              />
            )}

            <textarea placeholder="Lời nhắn cho shipper..." />

            <div className="checkbox-checkout">
              <input
                type="checkbox"
                id="account"
                checked={useAccountInfo}
                onChange={e => {
                  const checked = e.target.checked;
                  setUseAccountInfo(checked);
                  if (checked && account) {
                    setForm({
                      ...form,
                      fullname: account.fullname || "",
                      address: account.address || "",
                      phone: account.phone || "",
                      email: account.email || ""
                    });
                  } else {
                    setForm({
                      ...form,
                      fullname: "",
                      address: "",
                      phone: "",
                      email: ""
                    });
                  }
                }}
              />
              <label htmlFor="account">
                {account ? `${account.fullname} - ${account.address} - ${account.email} - ${account.phone}` : "Chưa có thông tin tài khoản"}
              </label>
            </div>

            <h2>Phương thức thanh toán</h2>

            <div className="payment-method">
              <label
                className={`method ${form.pay === "cod" ? "active" : ""}`}
                onClick={() => setForm({ ...form, pay: "cod" })}
              >
                <input type="radio" checked={form.pay === "cod"} readOnly />
                Tiền mặt (COD)
              </label>

              <label
                className={`method ${form.pay === "paypal" ? "active" : ""}`}
                onClick={() => setForm({ ...form, pay: "paypal" })}
              >
                <input type="radio" checked={form.pay === "paypal"} readOnly />
                PayPal
              </label>

              <label
                className={`method ${form.pay === "bank" ? "active" : ""}`}
                onClick={() => setForm({ ...form, pay: "bank" })}
              >
                <input type="radio" checked={form.pay === "bank"} readOnly />
                Chuyển khoản ngân hàng
              </label>

              {form.pay === "bank" && banks.length > 0 && (
                <div style={{ marginTop: 15, padding: 15, border: '1px dashed #16a34a', borderRadius: 8, background: '#f0fdf4' }}>
                  <p style={{ fontWeight: 600, color: '#166534', marginBottom: 10 }}>Vui lòng quét mã QR hoặc chuyển khoản vào các tài khoản sau:</p>
                  <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
                    {banks.map((bank, idx) => (
                      <div key={idx} style={{ flex: 1, minWidth: 250, padding: 10, background: 'white', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: 15, alignItems: 'center' }}>
                        {bank.qrCode && <img src={bank.qrCode} alt="QR Code" style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 4, border: '1px solid #e5e7eb' }} />}
                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                          <div style={{ fontWeight: 600, color: '#1f2937' }}>{bank.bankName}</div>
                          <div style={{ color: '#4b5563' }}>STK: <strong style={{ color: '#2563eb' }}>{bank.accountNumber}</strong></div>
                          <div style={{ color: '#4b5563' }}>Tên: <strong>{bank.accountName}</strong></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ marginTop: 15, fontSize: 13, fontStyle: 'italic', color: '#dc2626' }}>
                    * Lời nhắn chuyển tiền: <strong>VELTRIX [SỐ ĐIỆN THOẠI CỦA BẠN]</strong>
                  </p>
                  <p style={{ fontSize: 13, fontStyle: 'italic', color: '#dc2626' }}>
                    * Vui lòng nhấn <strong>ĐẶT HÀNG NGAY</strong> sau khi chuyển khoản thành công.
                  </p>
                </div>
              )}

              {form.pay === "paypal" && (
                <PayPalScriptProvider
                  options={{
                    "client-id": "AVLmCQeDTY4V61Oz3EDPhSaDLkIAMEy8ldzQHa7Q5BingPpqAntPqRoI40NY-8TKbxlJrkaZad9nNb1t",
                    currency: "USD",
                    intent: "capture"
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={async () => {
                      const res = await createPaypalOrder(
                        (Number(finalTotal) / 24000).toFixed(2)
                      );
                      return res.data.orderID;
                    }}
                    onApprove={async (data) => {
                      const res = await capturePaypalOrder(data.orderID);
                      if (res.data.status === "COMPLETED") await handleSubmit();
                    }}
                  />
                </PayPalScriptProvider>
              )}
            </div>

            {form.pay !== "paypal" && (
              <button className="submit" onClick={handleSubmit}>
                ĐẶT HÀNG NGAY - {finalTotal.toLocaleString("vi-VN")} VNĐ
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;