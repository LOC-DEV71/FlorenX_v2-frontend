import './Users.index.scss';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Statistic } from 'antd';
import CountUp from 'react-countup';
import { CopyOutlined, SearchOutlined } from '@ant-design/icons';
import { MdDeleteOutline, MdClose } from 'react-icons/md';
import { BsCalendarCheck, BsCheck2Circle } from 'react-icons/bs';
import { FaUserSlash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';
import SEO from '../../../utils/SEO';
import { confirm, error, success } from '../../../utils/notift';
import { getListUser, changeMulti, getUserById } from '../../../services/admin/users.admin.service';
import { CiShoppingCart } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { SiVirustotal } from "react-icons/si";
import formatTimeAgo from '../../../utils/formatTimeAgo';

const formatter = (value) => <CountUp end={value} duration={2} separator="," />;

const AVATAR_FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="40" fill="%23e5e7eb"/><text x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%239ca3af">?</text></svg>';

const fmt = (n) => Number(n).toLocaleString('vi-VN') + '₫';

const ORDER_STATUS = {
  delivered: { label: 'Đã giao', cls: 'order-delivered' },
  processing: { label: 'Đang xử lý', cls: 'order-processing' },
  shipped: { label: 'Đang giao', cls: 'order-shipped' },
  cancelled: { label: 'Đã huỷ', cls: 'order-cancelled' },
};

function UserModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('info');
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const copy = (text, orderId) => {
    if (!text) return;

    navigator.clipboard?.writeText(text);
    setCopiedOrderId(orderId);

    setTimeout(() => {
      setCopiedOrderId(null);
    }, 2000);
  };

  useEffect(() => {
    if (!userId) return;

    setTab('info');
    setUser(null);
    setLoading(true);

    const fetchDetail = async () => {
      try {
        const res = await getUserById(userId);
        if (res.data.code) {
          setUser(res.data.user);
        } else {
          error(res.data.message);
          onClose();
        }
      } catch (err) {
        error(err.response?.data?.message || 'Không tải được thông tin người dùng');
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [userId]);

  if (!userId) return null;

  if (loading || !user) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="user-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-user-hero">
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: '#e5e7eb', flexShrink: 0,
                }}
              />
              <div className="modal-hero-text">
                <div style={{ width: 160, height: 18, background: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ width: 100, height: 14, background: '#f3f4f6', borderRadius: 4 }} />
              </div>
            </div>
            <button className="modal-close" onClick={onClose}><MdClose /></button>
          </div>
          <div
            className="modal-body"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}
          >
            <span style={{ color: '#9ca3af', fontSize: 14 }}>Đang tải thông tin...</span>
          </div>
        </div>
      </div>
    );
  }

  const translate = (member) => {
    switch (member) {
      case "bronze":
        return "Hạng Đồng"
      case "silver":
        return "Hạng Bạc"
      case "gold":
        return "Hạng Vàng"
      case "diamond":
        return "Hạng Kim Cương"
    
      default:
        return "Không xác định";
    }
  }

  const totalSpend = (user.orders || []).reduce((s, o) => s + (o.totalPrice ?? o.total ?? 0), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-user-hero">
            <img
              src={user.avatar || AVATAR_FALLBACK}
              alt={user.fullname}
              onError={(e) => { e.target.src = AVATAR_FALLBACK; }}
            />
            <div className="modal-hero-text">
              <h3>{user.fullname}</h3>
              <div className="modal-hero-badges">
                <span className={`role member-${user.member}`}>
                  {translate(user.member)}
                </span>
                <span className={`status ${user.status}`}>
                  {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          {[
            { key: 'info', label: 'Thông tin' },
            { key: 'wishlist', label: `Yêu thích (${(user.likes || []).length})` },
            { key: 'orders', label: `Đơn hàng (${(user.orders || []).length})` },
          ].map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${tab === t.key ? 'tab-active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body">

          {tab === 'info' && (
            <div className="info-section">
              <div className="info-grid">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div>
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div>
                    <span className="info-label">Số điện thoại</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div>
                    <span className="info-label">Địa chỉ</span>
                    <span className="info-value">{user.address || '—'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaVenusMars className="info-icon" />
                  <div>
                    <span className="info-label">Giới tính</span>
                    <span className="info-value">{user.gender || '—'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <BsCalendarCheck className="info-icon" />
                  <div>
                    <span className="info-label">Ngày tạo</span>
                    <span className="info-value">
                      {formatTimeAgo(new Date(user.createdAt)) }
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-stats">
                <div className="info-stat-card">
                  <p className="stat-label"> <CiShoppingCart /> Đơn hàng</p>
                  <span className="stat-number">{user.orderCount ?? (user.orders || []).length}</span>

                </div>
                <div className="info-stat-card">
                  <p className="stat-label"><SiVirustotal /> Tổng chi tiêu</p>
                  <span className="stat-number">{fmt(user.totalSpend ?? totalSpend)}</span>

                </div>
                <div className="info-stat-card">
                  <p className="stat-label"> <CiHeart /> Yêu thích</p>
                  <span className="stat-number">{user.likeCount ?? (user.likes || []).length}</span>

                </div>
              </div>
            </div>
          )}

          {tab === 'wishlist' && (
            <div className="wishlist-section">
              {(user.likes || []).length === 0 ? (
                <p className="empty-msg">Không có sản phẩm yêu thích.</p>
              ) : (
                user.likes.map((like) => {
                  const p = like.product || like;
                  return (
                    <div className="wishlist-item" key={like._id}>
                      <img
                        src={p.thumbnail || p.image}
                        alt={p.title || p.name}
                        onError={(e) => { e.target.src = AVATAR_FALLBACK; }}
                      />
                      <div className="wishlist-info">
                        <p className="wishlist-name">{p.title || p.name}</p>
                        <span className="wishlist-cat">{p.category}</span>
                      </div>
                      <span className="wishlist-price">{fmt(p.price)}</span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'orders' && (
            <div className="orders-section">
              {(user.orders || []).length === 0 ? (
                <p className="empty-msg">Chưa có đơn hàng nào.</p>
              ) : (
                user.orders.map((o) => {
                  const s = ORDER_STATUS[o.status] || { label: o.status, cls: '' };
                  return (
                    <div className="order-item" key={o._id}>
                      <div className="order-left">
                        <span className="order-id">
                          <span className="value" >#{o.code} </span>
                          <button
                            className="copy-btn"
                            onClick={() => copy(o.code, o._id)}
                            style={{ cursor: "pointer", fontSize: "18" }}
                          >
                            <CopyOutlined />
                          </button>

                          {copiedOrderId === o._id && (
                            <span className="copied-flash"> Đã sao chép!</span>
                          )}
                        </span>
                        <span className="order-meta">
                          {o.date
                            ? o.date
                            : formatTimeAgo(new Date(o.createdAt))}
                          {' · '}{o.items ?? (o.products || []).length} sản phẩm
                        </span>
                      </div>
                      <div className="order-right">
                        <span className={`order-badge ${s.cls}`}>{s.label}</span>
                        <span className="order-total">{fmt(o.totalPrice ?? o.total ?? 0)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [selectId, setSelectId] = useState([]);
  const [typeChange, setTypeChange] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reload, setReload] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  const statusFilter = sort.startsWith('status-') ? sort.replace('status-', '') : '';

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getListUser({ page, limit, sort, search });
        if (res.data.code) {
          setUsers(res.data.users);
          setStats({
            total: res.data.totalUsers ?? 0,
            active: res.data.usersActive ?? 0,
            inactive: res.data.usersInactive ?? 0,
          });
        }
      } catch (err) {
        error(err.response?.data?.message || 'Có lỗi xảy ra');
      }
    };
    fetchApi();
  }, [reload, page, limit, sort, search]);

  const allChecked = users.length > 0 && selectId.length === users.length;

  const handleSelectAll = (e) =>
    setSelectId(e.target.checked ? users.map((u) => u._id) : []);

  const handleSelectOne = (id, checked) =>
    setSelectId((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));

  const handleChangeMulti = async () => {
    if (!typeChange || selectId.length === 0) return;
    try {
      if (typeChange === 'delete') {
        const ok = await confirm('Xoá người dùng?', 'Người dùng bị xoá sẽ chuyển vào thùng rác');
        if (!ok) return;
      }
      const res = await changeMulti({ selectId, typeChange });
      if (res.data.code) {
        success(res.data.message);
      } else {
        error(res.data.message);
      }
      setSelectId([]);
      setTypeChange('');
      setReload((prev) => !prev);
    } catch (err) {
      error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDeleteOne = async (e, id) => {
    e.stopPropagation();
    try {
      const ok = await confirm('Xoá tài khoản?', 'Tài khoản bị xoá sẽ chuyển vào thùng rác');
      if (!ok) return;
      const res = await changeMulti({ selectId: [id], typeChange: 'delete' });
      if (res.data.code) {
        success(res.data.message);
        setReload((prev) => !prev);
        setSelectId((prev) => prev.filter((x) => x !== id));
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Có lỗi xảy ra');
    }
    
  };

  const translate = (member) => {
    switch (member) {
      case "bronze":
        return "Hạng Đồng"
      case "silver":
        return "Hạng Bạc"
      case "gold":
        return "Hạng Vàng"
      case "diamond":
        return "Hạng Kim Cương"
    
      default:
        return "Không xác định";
    }
  }

  const handleReset = () => navigate('/admin/users');

  return (
    <div className="users-page">
      <SEO title="Quản lý người dùng" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="users-page__title">Quản Lý Người Dùng</h2>
        <button 
          onClick={() => navigate('/admin/member-tiers')}
          style={{ background: '#ecc94b', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Quản Lý Đặc Quyền Hạng
        </button>
      </div>
      {/* Stats */}
      <div className="account-stats">
        <div className="stat-card stat-total">
          <p><BsCalendarCheck /> Total Users</p>
          <Statistic value={stats.total} formatter={formatter} />
        </div>
        <div className="stat-card stat-active">
          <p><BsCheck2Circle /> Active Users</p>
          <Statistic value={stats.active} formatter={formatter} />
        </div>
        <div className="stat-card stat-blocked">
          <p><FaUserSlash /> Blocked Users</p>
          <Statistic value={stats.inactive} formatter={formatter} />
        </div>
      </div>

      {/* Filters */}
      <div className="account-filters">
        <div className="search">
          <SearchOutlined />
          <input
            placeholder="Tìm tên hoặc email..."
            value={search}
            onChange={(e) =>
              setSearchParams({ page: 1, limit, sort, search: e.target.value })
            }
          />
        </div>

        <select
          value={statusFilter ? `status-${statusFilter}` : ''}
          onChange={(e) =>
            setSearchParams({ page: 1, limit, sort: e.target.value, search })
          }
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="status-active">Hoạt động</option>
          <option value="status-inactive">Không hoạt động</option>
        </select>

        <select
          value={sort.startsWith('fullname') ? sort : ''}
          onChange={(e) =>
            setSearchParams({ page: 1, limit, sort: e.target.value, search })
          }
        >
          <option value="">-- Sắp xếp theo --</option>
          <option value="fullname-asc">Tên A-Z</option>
          <option value="fullname-desc">Tên Z-A</option>
        </select>

        <button className="reset" onClick={handleReset}>
          <MdDeleteOutline /> Xoá lọc
        </button>

        <select value={typeChange} onChange={(e) => setTypeChange(e.target.value)}>
          <option value="">-- Chọn hành động --</option>
          <option value="active">Mở khóa tài khoản (Hoạt động)</option>
          <option value="inactive">Khóa tài khoản</option>
          <option value="delete">Xoá nhiều người dùng</option>
        </select>

        <button className="activity" onClick={handleChangeMulti}>Áp dụng</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="account-table">
          <div className="table-header">
            <div>
              <input type="checkbox" checked={allChecked} onChange={handleSelectAll} />
            </div>
            <div className="col-account">Tài khoản</div>
            <div>Số điện thoại</div>
            <div>Hạng</div>
            <div>Ngày tạo</div>
            <div>Trạng thái</div>
            <div>Hành động</div>
          </div>

          {users.length === 0 && (
            <div className="empty-row">Không tìm thấy người dùng nào.</div>
          )}

          {users.map((item) => (
            <div
              className="table-row clickable-row"
              key={item._id}
              onClick={() => setSelectedUserId(item._id)}
            >
              <div className="account-checkbox" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectId.includes(item._id)}
                  onChange={(e) => handleSelectOne(item._id, e.target.checked)}
                />
              </div>

              <div className="account-info col-account">
                <img
                  src={item.avatar || AVATAR_FALLBACK}
                  alt={item.fullname}
                  onError={(e) => { e.target.src = AVATAR_FALLBACK; }}
                />
                <div>
                  <p className="account-name">{item.fullname}</p>
                  <span className="account-sub">{item.email}</span>
                </div>
              </div>

              <div>{item.phone ? item.phone : "—"}</div>

              <div>
                <span className={`role member-${item.member}`}>
                  {translate(item.member)}
                </span>
              </div>

              <div>{formatTimeAgo(new Date(item.createdAt))}</div>

              <div>
                <span className={`status ${item.status}`}>
                  {item.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </div>

              <div className="actions" onClick={(e) => e.stopPropagation()}>
                <button className="edit" onClick={() => setSelectedUserId(item._id)}>
                  Chi tiết
                </button>
                <button className="delete" onClick={(e) => handleDeleteOne(e, item._id)}>
                  Delete
                </button>
                <button className="delete">
                  Ban
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nhận userId, tự fetch data từ API detail */}
      <UserModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}

export default Users;