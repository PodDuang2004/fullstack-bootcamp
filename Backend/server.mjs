import express from "express";
import pool from "./db.js";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");

        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

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