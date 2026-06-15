import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Banned = () => {
    const navigate = useNavigate();

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
            <Result
                status="403"
                title={<span style={{ color: '#ff4d4f', fontSize: '32px', fontWeight: 'bold' }}>TÀI KHOẢN ĐÃ BỊ KHÓA</span>}
                subTitle={<span style={{ color: '#ff7875', fontSize: '18px' }}>DO VI PHẠM BẢO MẬT NGHIÊM TRỌNG. HỆ THỐNG AI ĐÃ GHI NHẬN HÀNH VI VÀ BÁO CÁO SUPER ADMIN.</span>}
                extra={
                    <Button type="primary" danger onClick={() => navigate('/admin/auth/login')}>
                        Quay lại trang Đăng nhập
                    </Button>
                }
            />
        </div>
    );
};

export default Banned;
