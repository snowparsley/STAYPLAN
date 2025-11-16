import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();

/* -------------------------------------------------------
   ⭐ 기존 CORS 유지 + 배포용 CORS 추가
------------------------------------------------------- */
app.use(cors()); // ← 기존 코드 그대로 유지

// ⭐ Vercel / Render 배포 환경에서도 허용
app.use(
  cors({
    origin: [
      "http://localhost:5173", // 로컬 개발
      "https://your-vercel-domain.vercel.app", // ← 배포된 Vercel 프론트 주소
      "https://your-render-domain.onrender.com", // ← Render 서버 주소
    ],
    credentials: true,
  })
);

app.use(express.json());

// 📌 프로필 업로드 폴더 생성
const profileDir = "./uploads/profile";
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// 📌 Multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, profileDir),
    filename: (req, file, cb) =>
      cb(null, `user_${Date.now()}_${file.originalname}`),
  }),
});

// 정적 파일 제공
app.use("/uploads", express.static("uploads"));

/* -------------------------------------------------------
   DB 연결
------------------------------------------------------- */
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* -------------------------------------------------------
   JWT 시크릿 키
------------------------------------------------------- */
const JWT_SECRET = process.env.JWT_SECRET || "stayplan_secret_key";

/* -------------------------------------------------------
   기본 라우트
------------------------------------------------------- */
app.get("/", (req, res) => res.send("✅ Express Server Running"));

/* -------------------------------------------------------
   숙소 관련 API
------------------------------------------------------- */
app.get("/api/listings", async (req, res) => {
  try {
    const { type } = req.query;

    let query = "SELECT * FROM listings";
    const params = [];

    if (type === "domestic" || type === "abroad") {
      query += " WHERE type = ?";
      params.push(type);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/listings/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM listings WHERE id = ?", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

/* -------------------------------------------------------
   회원가입
------------------------------------------------------- */
app.post("/api/signup", async (req, res) => {
  try {
    const { userId, password, name, email } = req.body;

    if (!userId || !password || !name || !email) {
      return res.status(400).json({ message: "모든 항목을 입력해주세요." });
    }

    const [exists] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (exists.length > 0) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (user_id, password, name, email, profile_image) VALUES (?, ?, ?, ?, '')",
      [userId, hashedPassword, name, email]
    );

    res.json({ ok: true, message: "회원가입 완료 🎉" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

/* -------------------------------------------------------
   로그인
------------------------------------------------------- */
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ message: "존재하지 않는 아이디입니다." });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    const token = jwt.sign(
      { id: user.id, userId: user.user_id, name: user.name },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      ok: true,
      message: `${user.name}님 환영합니다 🎉`,
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

/* -------------------------------------------------------
   JWT 인증 미들웨어
------------------------------------------------------- */
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "인증 토큰이 없습니다." });

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
}

/* -------------------------------------------------------
   프로필 이미지 업로드
------------------------------------------------------- */
app.post(
  "/api/profile/upload",
  authRequired,
  upload.single("profile"),
  async (req, res) => {
    try {
      const filePath = `uploads/profile/${req.file.filename}`;

      await db.query("UPDATE users SET profile_image = ? WHERE id = ?", [
        filePath,
        req.user.id,
      ]);

      res.json({ ok: true, profile_image: filePath });
    } catch (err) {
      console.error("❌ Upload Error:", err);
      res.status(500).json({ message: "업로드 실패" });
    }
  }
);

/* -------------------------------------------------------
   내 정보 업데이트
------------------------------------------------------- */
app.patch("/api/profile/update", authRequired, async (req, res) => {
  try {
    const { name, email } = req.body;

    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      req.user.id,
    ]);

    res.json({ ok: true, message: "정보가 수정되었습니다." });
  } catch (err) {
    res.status(500).json({ message: "업데이트 실패" });
  }
});

/* -------------------------------------------------------
   예약 생성
------------------------------------------------------- */
app.post("/api/reservations", authRequired, async (req, res) => {
  try {
    const {
      user_name,
      listing_id,
      check_in,
      check_out,
      guests,
      total_price,
      status,
    } = req.body;

    if (!user_name || !listing_id || !check_in || !check_out || !total_price) {
      return res.status(400).json({ message: "필수 항목 누락" });
    }

    const [result] = await db.query(
      `
      INSERT INTO reservations (user_id, user_name, listing_id, check_in, check_out, guests, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        user_name,
        listing_id,
        check_in,
        check_out,
        guests,
        total_price,
        status || "paid",
      ]
    );

    res.json({
      ok: true,
      id: result.insertId,
      message: "예약 완료되었습니다.",
    });
  } catch (err) {
    console.error("❌ Reservation Error:", err);
    res.status(500).json({ message: "예약 중 오류 발생" });
  }
});

/* -------------------------------------------------------
   내 예약 조회
------------------------------------------------------- */
app.get("/api/my-reservations", authRequired, async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT r.*, l.title, l.thumbnail
      FROM reservations r
      JOIN listings l ON r.listing_id = l.id
      WHERE r.user_id = ?
      ORDER BY r.id DESC
      `,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "예약 내역을 불러오지 못했습니다." });
  }
});

/* -------------------------------------------------------
   서버 실행
------------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
