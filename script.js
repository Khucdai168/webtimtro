document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Lấy các phần tử từ form
        const fullnameEl = document.getElementById("fullname");
        const emailEl = document.getElementById("email");
        const passwordEl = document.getElementById("password");
        const phoneEl = document.getElementById("phone");
        const genderEls = document.getElementsByName("gender");
        const messageEl = document.getElementById("message");

        // Kiểm tra xem các phần tử có tồn tại không
        if (!fullnameEl || !emailEl || !passwordEl || !phoneEl || !genderEls.length) {
            console.error("❌ Một hoặc nhiều trường không tồn tại!");
            return;
        }

        // Lấy giá trị từ form
        const fullname = fullnameEl.value.trim();
        const email = emailEl.value.trim();
        const password = passwordEl.value;
        const phone = phoneEl.value;

        // Lấy giá trị giới tính (radio)
        let gender = "";
        genderEls.forEach(el => {
            if (el.checked) {
                gender = el.value;
            }
        });

        // Kiểm tra dữ liệu trước khi gửi
        if (!fullname || !email || !password || !phone || !gender) {
            messageEl.textContent = "❌ Vui lòng nhập đầy đủ thông tin!";
            messageEl.style.color = "red";
            return;
        }

        console.log("📩 Dữ liệu gửi đi:", { fullname, email, password, phone, gender });

        try {
            const response = await fetch("http://localhost:5300/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, password, phone, gender })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("✅ Phản hồi từ server:", data);

            messageEl.textContent = "🎉 Đăng ký thành công!";
            messageEl.style.color = "green";
            document.getElementById("registerForm").reset();
        } catch (error) {
            console.error("❌ Lỗi khi gửi yêu cầu:", error);
            messageEl.textContent = "❌ Lỗi hệ thống, vui lòng thử lại sau!";
            messageEl.style.color = "red";
        }
    });
});
