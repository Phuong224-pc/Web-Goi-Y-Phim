// Mở hoặc Đóng bảng đăng nhập
function toggleAuth() {
    const modal = document.getElementById('authModal');
    modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}

// Chuyển giữa Đăng nhập và Đăng ký ngay trên cái bảng đó
function switchAuth() {
    const title = document.getElementById('authTitle');
    const regFields = document.getElementById('registerFields');
    const switchText = document.getElementById('switchText');

    if (title.innerText === "Đăng Nhập") {
        title.innerText = "Đăng Ký";
        regFields.style.display = "block";
        switchText.innerText = "Đã có tài khoản? Đăng nhập";
    } else {
        title.innerText = "Đăng Nhập";
        regFields.style.display = "none";
        switchText.innerText = "Chưa có tài khoản? Đăng ký ngay";
    }
}

// Xử lý khi nhấn nút Xác nhận
function handleAuthSubmit() {
    const email = document.getElementById('userEmail').value;
    if (email) {
        alert("Thao tác thành công cho: " + email);
        toggleAuth(); // Đóng bảng
        document.querySelector('.login-btn').innerText = "HELLO!"; // Đổi chữ trên Menu
    }
}