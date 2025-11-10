import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ DB 연결
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || "stayplan_secret_key";

// ✅ 기본 테스트 라우트
app.get("/", (req, res) => res.send("✅ Express Server Running"));

/* -------------------------------------------------------
 ✅ 숙소 관련 API
------------------------------------------------------- */

// ✅ 숙소 전체 or type별 조회 (국내 / 해외 필터링 지원)
app.get("/api/listings", async (req, res) => {
  try {
    const { type } = req.query;

    let query = "SELECT * FROM listings";
    const params = [];

    // ✅ type이 있을 때만 필터링
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

// ✅ 숙소 상세 조회
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
 ✅ 회원가입 API
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
      "INSERT INTO users (user_id, password, name, email) VALUES (?, ?, ?, ?)",
      [userId, hashedPassword, name, email]
    );

    res.json({ ok: true, message: "회원가입이 완료되었습니다 🎉" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

/* -------------------------------------------------------
 ✅ 로그인 API (JWT 발급)
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
      message: `${user.name}님, 환영합니다 🎉`,
      token,
      user: {
        id: user.id,
        userId: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

/* -------------------------------------------------------
 ✅ JWT 인증 미들웨어
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
    console.error("🔐 JWT Verify Error:", err);
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
}

/* -------------------------------------------------------
 ✅ 예약 관련 API
------------------------------------------------------- */

// ✅ 예약 생성
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
      message: "예약이 성공적으로 완료되었습니다 ✅",
    });
  } catch (err) {
    console.error("❌ Reservation Error:", err);
    res.status(500).json({ message: "예약 중 오류 발생" });
  }
});

// ✅ 내 예약 조회
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
    console.error("❌ 예약 내역 불러오기 오류:", err);
    res.status(500).json({ message: "예약 내역을 불러오지 못했습니다." });
  }
});

// ✅ 예약 삭제
app.delete("/api/reservations/:id", authRequired, async (req, res) => {
  try {
    const reservationId = req.params.id;
    const loginUserId = req.user.id;

    const [check] = await db.query(
      "SELECT * FROM reservations WHERE id = ? AND user_id = ?",
      [reservationId, loginUserId]
    );
    if (check.length === 0) {
      return res
        .status(403)
        .json({ ok: false, message: "삭제 권한이 없습니다." });
    }

    await db.query("DELETE FROM reservations WHERE id = ?", [reservationId]);

    res.json({ ok: true, message: "예약 내역이 삭제되었습니다 ✅" });
  } catch (err) {
    console.error("❌ 예약 삭제 오류:", err);
    res.status(500).json({ ok: false, message: "서버 오류 발생" });
  }
});

// ✅ 예약 취소
app.patch("/api/reservations/:id/cancel", authRequired, async (req, res) => {
  try {
    const reservationId = req.params.id;
    const loginUserId = req.user.id;

    const [check] = await db.query(
      "SELECT * FROM reservations WHERE id = ? AND user_id = ?",
      [reservationId, loginUserId]
    );

    if (check.length === 0) {
      return res.status(403).json({
        ok: false,
        message: "해당 예약을 취소할 권한이 없습니다.",
      });
    }

    await db.query("UPDATE reservations SET status='canceled' WHERE id=?", [
      reservationId,
    ]);

    return res.json({
      ok: true,
      message: "예약이 취소되었습니다.",
    });
  } catch (err) {
    console.error("❌ 예약 취소 오류:", err);
    return res.status(500).json({
      ok: false,
      message: "서버 오류 발생",
    });
  }
});

/* -------------------------------------------------------
 ✅ 서버 실행
------------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
