import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// หน้าแรก
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API ดึงข้อมูลผู้ใช้
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// API บันทึกข้อความลงตาราง messages
app.post("/api/contact", async (req, res) => {
  console.log("-> [Backend] ได้รับข้อมูลจากหน้าเว็บ:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const query = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [name, email, message]);
    console.log("-> [Neon] บันทึกสำเร็จ:", result.rows[0]);

    res.status(200).json({
      success: true,
      message: "ส่งข้อความและบันทึกข้อมูลเรียบร้อยแล้ว!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("-> [Neon Error]:", error);
    res.status(500).json({
      error: "Database Error: " + error.message,
    });
  }
});

// รัน Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

/*import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/api/users", (req, res) => {
    const users = [
        {
            id: 1,
            name: "Krittawat",
            email: "krittawat@gmail.com"
        },
        {
            id: 2,
            name: "Test User",
            email: "test@gmail.com"
        }
    ];

    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); */