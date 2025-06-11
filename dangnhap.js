const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // THÊM bcrypt

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Cấu hình kết nối SQL Server
const dbConfig = {
    user: "sa",
    password: "123",
    server: "localhost\\MSSQLSERVER",
    database: "user_database",
    port: 5600,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

// Kết nối SQL Server
sql.connect(dbConfig)
    .then(() => console.log("✅ Kết nối SQL Server thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối SQL Server:", err));

// API POST /login
app.post('/login', async (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    console.log("📩 Dữ liệu nhận từ client:", req.body);

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM dbo.users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu." });
        }

        const user = result.recordset[0];

        // So sánh mật khẩu nhập vào với mật khẩu mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu." });
        }

        // Đăng nhập thành công
        res.json({ success: true, message: "Đăng nhập thành công!", user });

    } catch (err) {
        console.error("❌ Lỗi truy vấn SQL:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
});

// Khởi chạy server
const PORT = 5600;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
