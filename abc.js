document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const emailEl = document.getElementById("email");
    const passwordEl = document.getElementById("password");
    const messageEl = document.getElementById("message");

    if (!form || !emailEl || !passwordEl || !messageEl) {
        console.error("❌ Form hoặc các phần tử input không tồn tại trong DOM.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        if (!email || !password) {
            messageEl.textContent = "❌ Vui lòng nhập đầy đủ thông tin!";
            messageEl.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:5600/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                messageEl.textContent = "✅ Đăng nhập thành công!";
                messageEl.style.color = "green";
                form.reset();
                window.location.href = "./trangchu.html"; // Nếu có trang giao diện
            } else {
                messageEl.textContent = "❌ " + (data.message || "Sai email hoặc mật khẩu!");
                messageEl.style.color = "red";
            }
        } catch (error) {
            console.error("❌ Lỗi khi gửi yêu cầu:", error);
            messageEl.textContent = "❌ Lỗi hệ thống, vui lòng thử lại sau!";
            messageEl.style.color = "red";
        }
    });
});
