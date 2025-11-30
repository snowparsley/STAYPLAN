// src/utils/image.js

// 서버 URL
const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://stayplanserver.onrender.com"
    : "http://localhost:5000";

// 상대경로 → 절대 URL로 변환하는 함수
export const getImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/300x200";

  // 이미 절대경로면 그대로 반환
  if (img.startsWith("http")) return img;

  // /uploads/... → 서버 URL + 경로
  return `${SERVER_URL}${img}`;
};
