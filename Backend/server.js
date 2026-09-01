import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import pool from "./db.js";

const app = express();
// ใช้ PORT จาก Render หรือ 3000 หากรันในเครื่อง
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ตั้งค่าตัวส่งอีเมล (Gmail Transporter)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

// API บันทึกข้อความลงตาราง messages พร้อมส่งอีเมลแจ้งเตือน
app.post("/api/contact", async (req, res) => {
  console.log("-> [Backend] ได้รับข้อมูลจากหน้าเว็บ:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    // บันทึกลงตาราง Neon Database
    const query = `
      INSERT INTO messages (name, email, message) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [name, email, message]);
    console.log("-> [Neon] บันทึกสำเร็จ:", result.rows[0]);

    // ส่งข้อความเข้า Email 
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // ส่งเข้าเมลตัวเอง
      replyTo: email,             // ให้สามารถกด Reply กลับหาผู้ส่งได้ทันที
      subject: `[Portfolio Contact] ข้อความใหม่จาก ${name}`,
      text: `ได้รับข้อความใหม่จากหน้าเว็บ Portfolio:\n\nชื่อ: ${name}\nอีเมล: ${email}\nข้อความ: ${message}`,
      html: `
        <h3>มีข้อความใหม่จากหน้าเว็บ Portfolio</h3>
        <p><strong>ชื่อผู้ติดต่อ:</strong> ${name}</p>
        <p><strong>อีเมล:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("-> [Email] ส่งอีเมลแจ้งเตือนสำเร็จ");

    res.status(200).json({
      success: true,
      message: "ส่งข้อความและบันทึกข้อมูลเรียบร้อยแล้ว!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("-> [Error]:", error);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการประมวลผล: " + error.message,
    });
  }
});

// รัน Server
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