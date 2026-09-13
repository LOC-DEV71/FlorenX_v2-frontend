import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Avatar, Typography, Row, Col, Tag, Spin, Divider } from 'antd';
import { UserOutlined, MailOutlined, SafetyCertificateOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { getPermissions } from '../../../services/admin/permission.admin.service';
import SEO from '../../../utils/SEO';
import './ProfileAdmin.scss';

const { Title, Text } = Typography;

const ProfileAdmin = () => {
  const { admin, role } = useSelector(state => state.auth);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await getPermissions();
        if (res.data.code) {
          setPermissionGroups(res.data.permissions);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách quyền:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const adminPermissions = role?.permissions || [];

  return (
    <div className="admin-profile-page">
      <SEO title="Hồ sơ cá nhân" />
      <div className="profile-header-banner"></div>
      
      <div className="profile-container">
        <Card className="profile-card" bordered={false}>
          <div className="profile-info-section">
            <Avatar 
              size={120} 
              src={admin?.avatar} 
              icon={<UserOutlined />} 
              className="profile-avatar"
            />
            <Title level={2} className="profile-name">{admin?.fullname}</Title>
            <div className="profile-meta">
              <span className="meta-item">
                <MailOutlined /> {admin?.email}
              </span>
              <span className="meta-item role-badge">
                <SafetyCertificateOutlined /> {role?.title || 'Quản trị viên'}
              </span>
            </div>
          </div>

          <Divider />

          <div className="profile-permissions-section">
            <Title level={4} className="section-title">
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              Quyền hạn của bạn
            </Title>
            
            {loading ? (
              <div className="loading-container"><Spin /></div>
            ) : (
              <Row gutter={[24, 24]}>
                {permissionGroups.map(group => {
                  // Lọc ra các quyền trong nhóm này mà admin đang sở hữu
                  const grantedPermissions = group.permissions.filter(p => adminPermissions.includes(p.value));
                  
                  // Nếu không có quyền nào trong nhóm này thì không hiển thị nhóm
                  if (grantedPermissions.length === 0) return null;

                  return (
                    <Col xs={24} md={12} lg={8} key={group._id}>
                      <Card className="permission-group-card" title={group.title} size="small" bordered={false}>
                        <div className="permission-tags">
                          {grantedPermissions.map(p => (
                            <Tag color="processing" key={p.value} className="permission-tag">
                              {p.label}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
            {!loading && adminPermissions.length === 0 && (
              <Text type="secondary" className="no-permission-text">
                Bạn chưa được cấp quyền hạn nào trong hệ thống.
              </Text>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileAdmin;
