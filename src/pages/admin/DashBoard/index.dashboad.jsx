import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic, Table, Typography, Tag, Radio, Progress, List, Avatar, Rate, Select, Spin, Button } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  DollarOutlined, 
  RiseOutlined,
  GlobalOutlined,
  LaptopOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import './DashBoard.scss';
import { getDashboardOverview } from '../../../services/admin/dashboard.service';
import formatTimeAgo from '../../../utils/formatTimeAgo';
import { useSocket } from '../../../Socket/useSocket';

const { Title } = Typography;

function DashBoard() {
  const [revenuePeriod, setRevenuePeriod] = useState('week');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ratingPeriod, setRatingPeriod] = useState('week');
  const [topPeriod, setTopPeriod] = useState('month');

  const [statsData, setStatsData] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    trends: { revenue: 0, orders: 0, users: 0, products: 0 },
    revenueWeekly: [],
    revenueMonthly: [],
    membership: { bronze: 0, silver: 0, gold: 0, diamond: 0 },
    topSpenders: [],
    topProducts: { week: [], month: [], year: [] },
    categoryData: { week: [], month: [], year: [] },
    recentOrders: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [showTopUsers, setShowTopUsers] = useState(false);
  const socket = useSocket();

  const fetchStatsSilent = async (year) => {
    try {
      const res = await getDashboardOverview(year);
      if (res.data && res.data.code === 200) {
        setStatsData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      await fetchStatsSilent(selectedYear);
      setLoading(false);
    };
    fetchStats();
  }, [selectedYear]);

  useEffect(() => {
    if (socket) {
      const handleRealTimeUpdate = () => {
        fetchStatsSilent(selectedYear);
      };

      socket.on("server_return_order", handleRealTimeUpdate);
      socket.on("server_return_product_preview", handleRealTimeUpdate);

      return () => {
        socket.off("server_return_order", handleRealTimeUpdate);
        socket.off("server_return_product_preview", handleRealTimeUpdate);
      };
    }
  }, [socket, selectedYear]);

  const { recentReviews = [], ratingData = { week: [], month: [] } } = statsData;

  const RATING_COLORS = ['#52c41a', '#1677ff', '#faad14', '#ff4d4f', '#a8071a'];

  const revenueDataWeekly = statsData.revenueWeekly.length ? statsData.revenueWeekly : [
    { name: 'T2', revenue: 0 }, { name: 'T3', revenue: 0 }, { name: 'T4', revenue: 0 },
    { name: 'T5', revenue: 0 }, { name: 'T6', revenue: 0 }, { name: 'T7', revenue: 0 }, { name: 'CN', revenue: 0 }
  ];

  const revenueDataMonthly = statsData.revenueMonthly.length ? statsData.revenueMonthly : [
    { name: 'T1', revenue: 0 }, { name: 'T2', revenue: 0 }, { name: 'T3', revenue: 0 },
    { name: 'T4', revenue: 0 }, { name: 'T5', revenue: 0 }, { name: 'T6', revenue: 0 },
    { name: 'T7', revenue: 0 }, { name: 'T8', revenue: 0 }, { name: 'T9', revenue: 0 },
    { name: 'T10', revenue: 0 }, { name: 'T11', revenue: 0 }, { name: 'T12', revenue: 0 }
  ];

  const categoryData = statsData.categoryData?.length ? statsData.categoryData : [];

  const membershipData = [
    { name: 'Bronze', value: statsData.membership.bronze },
    { name: 'Silver', value: statsData.membership.silver },
    { name: 'Gold', value: statsData.membership.gold },
    { name: 'Diamond', value: statsData.membership.diamond },
  ];
  const MEMBERSHIP_COLORS = ['#cd7f32', '#c0c0c0', '#ffd700', '#00d2ff'];

  const topProducts = statsData.topProducts?.length ? statsData.topProducts : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: '#fff', padding: '10px 15px', border: '1px solid #f0f0f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>{label}</p>
          <p style={{ margin: 0, color: '#1677ff', fontWeight: 700 }}>
            {payload[0].name === 'revenue' 
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const recentOrders = statsData.recentOrders || [];

  const columns = [
    { title: 'Mã đơn', dataIndex: 'orderId', key: 'orderId', render: text => <Link to={`/admin/orders/${text}`} style={{fontWeight: 500}}>{text}</Link> },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: text => <strong>{text?.toLocaleString()} đ</strong> },
    { 
      title: 'Trạng thái', 
      key: 'status', 
      dataIndex: 'status',
      render: status => {
        const statusMap = {
          'done': { text: 'Hoàn thành', color: 'success' },
          'cancel': { text: 'Đã hủy', color: 'error' },
          'transporting': { text: 'Đang giao', color: 'processing' },
          'pending': { text: 'Chờ xử lý', color: 'default' }
        };
        const st = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={st.color}>{st.text.toUpperCase()}</Tag>;
      }
    },
  ];

  const miniChartData1 = [{v: 40},{v: 30},{v: 45},{v: 50},{v: 35},{v: 60},{v: 80}];
  const miniChartData2 = [{v: 10},{v: 25},{v: 15},{v: 40},{v: 20},{v: 55},{v: 45}];
  const miniChartData3 = [{v: 20},{v: 35},{v: 25},{v: 50},{v: 30},{v: 65},{v: 55}];
  const miniChartData4 = [{v: 30},{v: 40},{v: 35},{v: 60},{v: 45},{v: 75},{v: 65}];

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3}>Tổng quan hệ thống</Title>
          <p>Báo cáo hoạt động kinh doanh và tình hình hệ thống</p>
        </div>
        <div>
          <Select 
            value={selectedYear} 
            onChange={setSelectedYear} 
            style={{ width: 140 }}
            size="large"
            options={[
              { value: 2026, label: 'Năm 2026' },
              { value: 2025, label: 'Năm 2025' },
              { value: 2024, label: 'Năm 2024' },
            ]}
          />
        </div>
      </div>

      <Spin spinning={loading}>
        <Row gutter={[24, 24]} className="admin-dashboard__stats">
          {/* Card 1: Doanh thu */}
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="stat-card-inner">
                <Statistic 
                  title="Tổng Doanh Thu" 
                  value={statsData.totalRevenue} 
                  prefix={<DollarOutlined />} 
                  suffix="đ" 
                  valueStyle={{ color: '#1f2937', fontWeight: 700 }}
                />
                <div className="mini-chart">
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={miniChartData1}>
                      <Area type="monotone" dataKey="v" stroke="#1677ff" fill="#e6f4ff" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className={`trend ${statsData.trends.revenue >= 0 ? 'up' : 'down'}`}>
                  {statsData.trends.revenue > 0 ? '+' : ''}{statsData.trends.revenue}%
                </span> so với năm trước
              </div>
            </Card>
          </Col>

          {/* Card 2: Đơn hàng mới */}
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="stat-card-inner">
                <Statistic 
                  title="Đơn Hàng Mới" 
                  value={statsData.totalOrders} 
                  prefix={<ShoppingCartOutlined />} 
                  valueStyle={{ color: '#1f2937', fontWeight: 700 }}
                />
                <div className="mini-chart">
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={miniChartData2}>
                      <Area type="monotone" dataKey="v" stroke="#52c41a" fill="#f6ffed" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className={`trend ${statsData.trends.orders >= 0 ? 'up' : 'down'}`}>
                  {statsData.trends.orders > 0 ? '+' : ''}{statsData.trends.orders}%
                </span> so với năm trước
              </div>
            </Card>
          </Col>

          {/* Card 3: Khách hàng mới */}
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="stat-card-inner">
                <Statistic 
                  title="Tổng Khách Hàng" 
                  value={statsData.totalUsers} 
                  prefix={<UserOutlined />} 
                  valueStyle={{ color: '#1f2937', fontWeight: 700 }}
                />
                <div className="mini-chart">
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={miniChartData3}>
                      <Area type="monotone" dataKey="v" stroke="#ff4d4f" fill="#fff1f0" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className={`trend ${statsData.trends.users >= 0 ? 'up' : 'down'}`}>
                  {statsData.trends.users > 0 ? '+' : ''}{statsData.trends.users}%
                </span> so với năm trước
              </div>
            </Card>
          </Col>

          {/* Card 4: Tổng sản phẩm */}
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="stat-card-inner">
                <Statistic 
                  title="Tổng Sản Phẩm" 
                  value={statsData.totalProducts} 
                  prefix={<AppstoreOutlined />} 
                  valueStyle={{ color: '#1f2937', fontWeight: 700 }}
                />
                <div className="mini-chart">
                  <ResponsiveContainer width="100%" height={40}>
                    <AreaChart data={miniChartData4}>
                      <Area type="monotone" dataKey="v" stroke="#faad14" fill="#fffbe6" strokeWidth={2} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="stat-card-footer">
                <span className={`trend ${statsData.trends.products >= 0 ? 'up' : 'down'}`}>
                  {statsData.trends.products > 0 ? '+' : ''}{statsData.trends.products}%
                </span> so với năm trước
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>

      {/* CHARTS ROW 1 */}
      <Row gutter={[24, 24]} className="admin-dashboard__charts" style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title="Biểu đồ Doanh Thu" 
            bordered={false} 
            className="content-card"
            extra={
              <div style={{ display: 'flex', gap: '12px' }}>
                <Radio.Group value={revenuePeriod} onChange={(e) => setRevenuePeriod(e.target.value)}>
                  <Radio.Button value="week">Tuần</Radio.Button>
                  <Radio.Button value="month">Tháng</Radio.Button>
                </Radio.Group>
              </div>
            }
          >
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <AreaChart data={revenuePeriod === 'month' ? revenueDataMonthly : revenueDataWeekly} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1677ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c8c8c' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8c8c8c' }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#1677ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={showTopUsers ? "Top 10 Đại Gia" : "Cấp Độ Thành Viên"} 
            bordered={false} 
            className="content-card" 
            style={{ height: '100%' }}
            extra={
              <Button type="link" onClick={() => setShowTopUsers(!showTopUsers)}>
                {showTopUsers ? 'Xem Biểu Đồ' : 'Xem Top Đại Gia'}
              </Button>
            }
          >
            <div className="custom-scrollbar" style={{ height: 320, overflowY: showTopUsers ? 'auto' : 'hidden', paddingRight: showTopUsers ? 8 : 0 }}>
              {showTopUsers ? (
                <List
                  itemLayout="horizontal"
                  dataSource={statsData.topSpenders || []}
                  renderItem={(item, index) => (
                    <List.Item
                      style={{
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '8px',
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{index + 1}</Avatar>}
                        title={<span style={{ fontWeight: 600 }}>{item.fullname || 'Khách hàng'}</span>}
                        description={
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>{item._id}</span>
                            <span>Đã chốt {item.orderCount} đơn</span>
                          </div>
                        }
                      />
                      <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
                        {item.totalSpent?.toLocaleString()}đ
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {membershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MEMBERSHIP_COLORS[index % MEMBERSHIP_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* CHARTS ROW 2 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card 
            title="Sản Phẩm Bán Chạy Nhất" 
            bordered={false} 
            className="content-card"
            extra={
              <Radio.Group value={topPeriod} onChange={(e) => setTopPeriod(e.target.value)} size="small">
                <Radio.Button value="week">Tuần</Radio.Button>
                <Radio.Button value="month">Tháng</Radio.Button>
                <Radio.Button value="year">Năm</Radio.Button>
              </Radio.Group>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={statsData.topProducts[topPeriod] || []}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.thumbnail 
                      ? <Avatar shape="square" size={48} src={item.thumbnail} />
                      : <Avatar shape="square" size={48} icon={<LaptopOutlined />} style={{background: '#f0f2f5', color: '#1677ff'}} />
                    }
                    title={<span style={{fontWeight: 600}}>{item.title}</span>}
                    description={`${item.sales} đã bán`}
                  />
                  <div style={{fontWeight: 700, color: '#1677ff'}}>{item.price?.toLocaleString()} đ</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card 
            title="Doanh Thu Theo Danh Mục" 
            bordered={false} 
            className="content-card"
            extra={
              <Radio.Group value={topPeriod} onChange={(e) => setTopPeriod(e.target.value)} size="small">
                <Radio.Button value="week">Tuần</Radio.Button>
                <Radio.Button value="month">Tháng</Radio.Button>
                <Radio.Button value="year">Năm</Radio.Button>
              </Radio.Group>
            }
          >
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={statsData.categoryData[topPeriod] || []} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontWeight: 500 }} />
                  <RechartsTooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="sales" fill="#52c41a" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Doanh Thu Theo Khu Vực" bordered={false} className="content-card location-card">
            <div className="location-item">
              <div className="loc-head"><span>Hồ Chí Minh</span> <strong>56.2M</strong></div>
              <Progress percent={55} showInfo={false} strokeColor="#1677ff" />
            </div>
            <div className="location-item">
              <div className="loc-head"><span>Hà Nội</span> <strong>37.5M</strong></div>
              <Progress percent={35} showInfo={false} strokeColor="#52c41a" />
            </div>
            <div className="location-item">
              <div className="loc-head"><span>Đà Nẵng</span> <strong>18.7M</strong></div>
              <Progress percent={15} showInfo={false} strokeColor="#faad14" />
            </div>
            <div className="location-item">
              <div className="loc-head"><span>Cần Thơ</span> <strong>12.5M</strong></div>
              <Progress percent={10} showInfo={false} strokeColor="#eb2f96" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* BOTTOM ROW */}
      <Row gutter={[24, 24]} className="admin-dashboard__content" style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Đơn hàng gần đây" bordered={false} className="content-card">
            <Table 
              columns={columns} 
              dataSource={recentOrders} 
              pagination={false} 
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Hoạt động nổi bật" bordered={false} className="content-card">
            <div className="activity-list custom-scrollbar" style={{ height: 320, overflowY: 'auto', paddingRight: '8px' }}>
              {statsData.recentActivities?.map(activity => {
                const colorMap = {
                  'order_new': 'blue',
                  'order_status': 'green',
                  'product_low_stock': 'orange',
                  'user_register': 'purple',
                  'product_out_stock': 'red',
                  'rating': 'orange',
                  'cskh': 'purple',
                  'system': 'blue'
                };
                const dotColor = colorMap[activity.type] || 'blue';
                return (
                  <div className="activity-item" key={activity.id}>
                    <span className={`dot dot-${dotColor}`}></span>
                    <div className="info">
                      <p>
                        {activity.action_url ? (
                          <Link to={activity.action_url} style={{ color: '#1f2937' }} className="activity-link" dangerouslySetInnerHTML={{ __html: activity.message }}></Link>
                        ) : (
                          <span dangerouslySetInnerHTML={{ __html: activity.message }}></span>
                        )}
                      </p>
                      <small>{formatTimeAgo(activity.time)}</small>
                    </div>
                  </div>
                );
              })}
              {(!statsData.recentActivities || statsData.recentActivities.length === 0) && (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0' }}>Không có hoạt động mới</div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* REVIEWS ROW */}
      <Row gutter={[24, 24]} className="admin-dashboard__content">
        <Col xs={24} lg={12}>
          <Card title="Đánh giá gần đây (Previews)" bordered={false} className="content-card">
            <div className="custom-scrollbar" style={{ height: 360, overflowY: 'auto', paddingRight: 8 }}>
              <List
                itemLayout="horizontal"
                dataSource={recentReviews}
                renderItem={item => {
                  const meta = (
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{item.customer.charAt(0)}</Avatar>}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: '#1f2937' }}>{item.customer}</span>
                          <span style={{ fontSize: 12, color: '#9ca3af' }}>{formatTimeAgo(item.time)}</span>
                        </div>
                      }
                      description={
                        <div style={{ marginTop: 4 }}>
                          <div style={{ color: '#1677ff', fontSize: 13, marginBottom: 4, fontWeight: 500 }}>
                            Sản phẩm: {item.product}
                          </div>
                          <Rate disabled defaultValue={item.rating} style={{ fontSize: 14, color: '#faad14', margin: 0 }} />
                          <p style={{ margin: '8px 0 0', color: '#4b5563', fontStyle: 'italic' }}>"{item.comment}"</p>
                        </div>
                      }
                    />
                  );

                  return (
                    <List.Item className="review-list-item" style={{ padding: '12px', borderRadius: '8px', transition: 'all 0.3s' }}>
                      {item.productSlug ? (
                        <Link to={`/admin/products/detail/${item.productSlug}`} style={{ display: 'block', width: '100%', color: 'inherit', textDecoration: 'none' }}>
                          {meta}
                        </Link>
                      ) : meta}
                    </List.Item>
                  );
                }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Mức độ hài lòng" 
            bordered={false} 
            className="content-card"
            extra={
              <Radio.Group value={ratingPeriod} onChange={(e) => setRatingPeriod(e.target.value)}>
                <Radio.Button value="week">Tuần</Radio.Button>
                <Radio.Button value="month">Tháng</Radio.Button>
              </Radio.Group>
            }
          >
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={ratingData[ratingPeriod] || []} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontWeight: 500 }} />
                  <RechartsTooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                    {
                      (ratingData[ratingPeriod] || []).map((entry, index) => {
                        const colors = ['#52c41a', '#1677ff', '#faad14', '#ff4d4f', '#a8071a'];
                        return <Cell key={`cell-${index}`} fill={colors[index]} />;
                      })
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashBoard;