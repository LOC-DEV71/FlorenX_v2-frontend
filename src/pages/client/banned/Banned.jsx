import React from "react";
import { WarningOutlined } from "@ant-design/icons";
import SEO from "../../../utils/SEO";
import "./Banned.scss";

function Banned() {
  return (
    <div className="banned-page">
      <SEO title="Access Denied" description="Your IP has been blocked." />
      <div className="banned-container">
        <div className="icon-wrapper">
          <WarningOutlined className="danger-icon" />
        </div>
        
        <h1>Access Denied</h1>
        <p className="subtitle">
          Quyền truy cập bị từ chối. IP của bạn đã bị đưa vào Blacklist do có dấu hiệu Spam / DDoS hệ thống.
        </p>

        <div className="details">
          <p><strong>Error Code:</strong> 403 Forbidden / 429 Too Many Requests</p>
          <p><strong>Host:</strong> Veltrix Gear - Advanced E-commerce System</p>
          <p><strong>Status:</strong> IP Blocked permanently (in-memory).</p>
        </div>

        <div className="banned-footer">
          Hệ thống bảo vệ đa tầng Veltrix Gear (Anti-DDoS Shield) &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default Banned;
