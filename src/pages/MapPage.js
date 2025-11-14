//지도
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Link } from "react-router-dom";
import { OpenStreetMapProvider } from "leaflet-geosearch";

// ✅ 마커 커스텀 가격 라벨
function createPriceMarker(price) {
  const iconHtml = `
    <div style="
      background: white;
      border: 1px solid #ddd;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #ff5a5f;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    ">
      ₩${price.toLocaleString()}
    </div>`;
  return L.divIcon({
    html: iconHtml,
    className: "",
    iconSize: [60, 25],
    iconAnchor: [30, 25],
  });
}

// ✅ 지도 이동 이벤트 처리 (보이는 영역 내 숙소만 필터링)
function MapEventHandler({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
  });
  return null;
}

function MapPage() {
  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState([]);
  const [center, setCenter] = useState([36.3, 127.9]);
  const [search, setSearch] = useState("");
  const provider = new OpenStreetMapProvider();
  const mapRef = useRef();

  // ✅ 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/listings")
      .then((res) => {
        setListings(res.data);
        setVisibleListings(res.data);
      })
      .catch((err) => console.error("❌ 데이터 오류:", err));
  }, []);

  // ✅ 검색 기능
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const results = await provider.search({ query: search });
    if (results.length > 0) {
      const { x, y } = results[0];
      setCenter([y, x]);
    } else {
      alert("지역을 찾을 수 없습니다 😥");
    }
  };

  // ✅ 현재 지도 범위 내 숙소 필터링
  const handleBoundsChange = (bounds) => {
    const filtered = listings.filter((item) => {
      const lat = item.latitude || 37.5665;
      const lng = item.longitude || 126.978;
      return bounds.contains([lat, lng]);
    });
    setVisibleListings(filtered);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 80px)",
      }}
    >
      {/* 🔍 검색창 */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          padding: "10px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="지역 또는 숙소명 검색"
          style={{
            width: "300px",
            padding: "10px 15px",
            borderRadius: "30px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            border: "none",
            backgroundColor: "#ff5a5f",
            color: "white",
            borderRadius: "30px",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </form>

      {/* 🗺️ 지도 영역 */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={center}
          zoom={7}
          style={{ width: "100%", height: "100%" }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapEventHandler onBoundsChange={handleBoundsChange} />

          {listings.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude || 37.5665, item.longitude || 126.978]}
              icon={createPriceMarker(item.price || 0)}
            >
              <Popup>
                <div style={{ width: "200px" }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  />
                  <strong>{item.title}</strong>
                  <p style={{ color: "#666" }}>{item.location}</p>
                  <p style={{ color: "#ff5a5f", fontWeight: "bold" }}>
                    ₩{item.price?.toLocaleString()} / 박
                  </p>
                  <Link
                    to={`/listing/${item.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "5px",
                      backgroundColor: "#ff5a5f",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                    }}
                  >
                    상세보기
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* 📋 지도 아래 리스트 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            maxHeight: "250px",
            backgroundColor: "rgba(255,255,255,0.98)",
            overflowX: "auto",
            display: "flex",
            gap: "20px",
            padding: "15px 20px",
            borderTop: "1px solid #ddd",
            backdropFilter: "blur(6px)",
          }}
        >
          {visibleListings.length === 0 ? (
            <p style={{ color: "#666" }}>현재 화면에 숙소가 없습니다.</p>
          ) : (
            visibleListings.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: "0 0 220px",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: "100%", height: "140px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px" }}>
                  <strong style={{ display: "block", marginBottom: "5px" }}>
                    {item.title}
                  </strong>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    {item.location}
                  </p>
                  <p style={{ color: "#ff5a5f", fontWeight: "bold" }}>
                    ₩{item.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 반응형 */}
      <style>
        {`
          @media (max-width: 768px) {
            form {
              flex-direction: column;
              gap: 8px;
            }
            input {
              width: 80% !important;
            }
            .leaflet-container {
              height: 60vh !important;
            }
            div[style*="maxHeight: 250px"] {
              max-height: 180px !important;
              overflow-x: scroll;
            }
          }
        `}
      </style>
    </div>
  );
}

export default MapPage;
