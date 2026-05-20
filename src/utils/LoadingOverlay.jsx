import React from "react";
import "./LoadingOverlay.scss";

const LoadingOverlay = ({ title = "Đang tạo sản phẩm..." }) => {
  return (
    <div className="loading-corner">
      <div className="loading-corner-bar" />
      <div className="loading-corner-content">
        <div className="loading-corner-spinner" />
        <span>{title}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;