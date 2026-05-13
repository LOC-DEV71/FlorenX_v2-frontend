import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./Checkout.scss";
import { useSelector } from "react-redux";
import { error, success } from "../../../utils/notift";
import { getVoucher } from "../../../services/client/voucher.service";
import { formatCustom } from "../../../utils/formatCustomDate";
import { capturePaypalOrder, createPaypalOrder, OrderSubmit } from "../../../services/client/checkout.service";
import Loading from "../../../utils/loading";
import { useSocket } from "../../../Socket/useSocket";

function Checkout() {
  const location = useLocation();
  const naviagte = useNavigate();
  const products = location.state?.data || [];
  const account = useSelector((state) => state.authClient.user);
  const [loading, setLoading] = useState(false)
  const [orderReturn, setOrderReturn] = useState([]);
  const socket = useSocket();

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

  // useEffect(() => {
  //   setForm(prev => ({
  //     ...prev,
  //     products: productSnapshots
  //   }));
  // }, [products]);

  const memberDiscount = (() => {
    if (!account || !account.member) return 0;
    const memberTier = account.member.toLowerCase();
    let tierConfig = null;

    switch (memberTier) {
      case "diamond":
        tierConfig = { rate: 0.15, max: 5000000, minOrder: 10000000 };
        break;
      case "gold":
        tierConfig = { rate: 0.08, max: 3000000, minOrder: 10000000 };
        break;
      case "silver":
        tierConfig = { rate: 0.06, max: 2000000, minOrder: 10000000 };
        break;
      case "bronze":
        tierConfig = { rate: 0.05, max: 1000000, minOrder: 10000000 };
        break;
      default:
        return 0;
    }

    if (totalPrice < tierConfig.minOrder) return 0;
    const discountAmount = totalPrice * tierConfig.rate;
    return Math.min(discountAmount, tierConfig.max);
  })();


  useEffect(() => {
    const fetchApi = async () => {
      const res = await getVoucher();
      if (res?.data?.code) {
        setVouchers(res.data.vouchers);
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
                    className={`item ${form.voucher === item?.code && "active"}`}
                    key={item?._id}
                    onClick={() => {
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
                      {form.voucher === item?.code ? "Đã áp dụng" : "Áp dụng"}
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

            <input
              placeholder="Địa chỉ nhận hàng"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />

            <textarea placeholder="Lời nhắn cho shipper..." />

            <div className="checkbox-checkout">
              <input
                type="checkbox"
                id="account"
                onChange={e => {
                  if (e.target.checked && account) {
                    setForm({
                      ...form,
                      fullname: account.fullname || "",
                      address: account.address || "",
                      phone: account.phone || "",
                      email: account.email || ""
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

            {form.pay === "cod" && (
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