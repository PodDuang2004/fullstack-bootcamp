import express from "express";
import cors from "cors";
import { Resend } from "resend";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// สร้าง Resend Client ด้วย API Key จาก Environment
const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/contact", async (req, res) => {
  console.log("-> [Backend] ได้รับข้อมูล:", req.body);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // 1. บันทึกลงตาราง Neon Database
    const query = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [name, email, message]);
    console.log("-> [Neon] บันทึกสำเร็จ:", result.rows[0]);

    // 2. ส่งอีเมลแจ้งเตือนผ่าน Resend (HTTP API ไม่โดนบล็อกแน่นอน)
    try {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.MY_EMAIL,
        reply_to: email,
        subject: `[Portfolio Contact] ข้อความใหม่จาก ${name}`,
        html: `
          <h3>มีข้อความใหม่จาก Portfolio</h3>
          <p><strong>ชื่อผู้ติดต่อ:</strong> ${name}</p>
          <p><strong>อีเมล:</strong> ${email}</p>
          <p><strong>ข้อความ:</strong></p>
          <p style="background-color: #f4f4f4; padding: 12px; border-radius: 6px;">${message}</p>
        `,
      });
      console.log("-> [Resend] ส่งอีเมลสำเร็จ!");
    } catch (emailErr) {
      console.error("-> [Resend Error]:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      message: "ส่งข้อความเรียบร้อยแล้ว!",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("-> [Server Error]:", error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการประมวลผล: " + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
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