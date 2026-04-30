import React from 'react';
import { IoDiamond, IoMedal } from "react-icons/io5";
import './luxury.scss';

const LuxuryBox = ({ type = 'gold', username = "Lâm Chí Lộc" }) => {
  const renderTierIcon = () => {
    switch (type) {
      case 'diamond':
        return <IoDiamond className="tier-icon diamond-icon" />;
      default:
        return <IoMedal className={`tier-icon coin-icon ${type}`} />;
    }
  };

  return (
    <div className={`luxury-card-container ${type}`}>
      <div className="reflection-layer layer-1"></div>
      <div className="reflection-layer layer-2"></div>
      
      <div className="card-content">
        <div className="card-header">
          <span className="tier-label">THÀNH VIÊN {type.toUpperCase()}</span>
          {renderTierIcon()}
        </div>
        
        <div className="card-body">
          <p className="membership-text">Premium Access</p>
          <h2 className="user-name">{username}</h2>
        </div>

        <div className="card-footer">
          <span className="serial-number">•••• •••• •••• 2026</span>
          <div className="card-chip"></div>
        </div>
      </div>
    </div>
  );
};

export default LuxuryBox;

// Định nghĩa
// type	mô tả hiển thị
// "bronze"	Đồng – tone trầm, cổ điển
// "silver"	Bạc – sáng, hiện đại
// "gold"	Vàng – sang trọng, nổi bật
// "diamond"	Kim cương – trong suốt, lấp lánh