import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationSelector.scss";

const LocationSelector = ({ onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState({ code: "", name: "" });
  const [selectedDistrict, setSelectedDistrict] = useState({ code: "", name: "" });
  const [selectedWard, setSelectedWard] = useState({ code: "", name: "" });
  const [street, setStreet] = useState("");

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince.code) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`);
          setDistricts(response.data.districts);
          setWards([]);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince.code]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict.code) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`);
          setWards(response.data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict.code]);

  // Whenever any address part changes, emit to parent
  useEffect(() => {
    if (onChange) {
      const parts = [];
      if (street.trim()) parts.push(street.trim());
      if (selectedWard.name) parts.push(selectedWard.name);
      if (selectedDistrict.name) parts.push(selectedDistrict.name);
      if (selectedProvince.name) parts.push(selectedProvince.name);
      
      if (parts.length > 0) {
        onChange(parts.join(", "));
      }
    }
  }, [street, selectedWard, selectedDistrict, selectedProvince, onChange]);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedProvince({ code, name: code ? name : "" });
    setSelectedDistrict({ code: "", name: "" });
    setSelectedWard({ code: "", name: "" });
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedDistrict({ code, name: code ? name : "" });
    setSelectedWard({ code: "", name: "" });
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedWard({ code, name: code ? name : "" });
  };

  return (
    <div className="location-selector">
      <div className="location-selector__row">
        <div className="location-selector__group">
          <label>Tỉnh/Thành phố</label>
          <select value={selectedProvince.code} onChange={handleProvinceChange}>
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="location-selector__group">
          <label>Quận/Huyện</label>
          <select 
            value={selectedDistrict.code} 
            onChange={handleDistrictChange}
            disabled={!selectedProvince.code}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="location-selector__group">
          <label>Phường/Xã</label>
          <select 
            value={selectedWard.code} 
            onChange={handleWardChange}
            disabled={!selectedDistrict.code}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="location-selector__group location-selector__group--full">
        <label>Số nhà, Tên đường</label>
        <input 
          type="text" 
          placeholder="Nhập số nhà, tên đường, tòa nhà..." 
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LocationSelector;
