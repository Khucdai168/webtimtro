const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5300;

app.use(cors());
app.use(bodyParser.json());

// Cấu hình SQL Server
const dbConfig = {
    user: "sa",
    password: "123",
    server: "localhost\\MSSQLSERVER", // Giữ nguyên nếu đúng
    database: "user_database",
    port: 5300,  // ✅ PORT SQL SERVER mặc định là 1433, KHÔNG phải 5300
    options: {
        encrypt: false, // Nếu test local thì để false
        trustServerCertificate: true,
    },
};

// Kết nối SQL Server
sql.connect(dbConfig)
    .then(() => console.log("✅ Kết nối SQL Server thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối SQL Server:", err));

// API Đăng ký
app.post("/register", async (req, res) => {
    try {
        const { fullname, email, password, phone, gender } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!fullname || !email || !password || !phone || !gender) {
            return res.status(400).json({ message: "❌ Vui lòng nhập đầy đủ thông tin!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input("fullname", sql.NVarChar, fullname)
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, hashedPassword)
            .input("phone", sql.NVarChar, phone)
            .input("gender", sql.NVarChar, gender)
            .query(`
                INSERT INTO users (fullname, email, password, phone, gender)
                VALUES (@fullname, @email, @password, @phone, @gender)
            `);

        res.status(201).json({ message: "✅ Đăng ký thành công!" });
    } catch (error) {
        console.error("❌ Lỗi SQL:", error);
        res.status(500).json({ message: "❌ Lỗi hệ thống, vui lòng thử lại sau!", error: error.message });
    }
});

// Khởi động server
app.listen(PORT,() => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
