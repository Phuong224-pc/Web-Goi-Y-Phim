// ==========================================
// 5. TÌM KIẾM & AUTH (ĐÃ SỬA LỖI)
// ==========================================

// Tìm kiếm phim
movieInput.addEventListener('input', async function() {
    if (this.value.length < 2) return suggestionsBox.style.display = 'none';
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(this.value)}&language=vi-VN`);
    const data = await res.json();
    suggestionsBox.innerHTML = data.results.slice(0, 6).map(m => `
        <div class="suggestion-item" onclick="selectSearch('${(m.title || m.name).replace(/'/g, "\\'")}')">
            <img src="${m.poster_path ? 'https://image.tmdb.org/t/p/w92' + m.poster_path : 'https://via.placeholder.com/92x138'}">
            <span>${m.title || m.name}</span>
        </div>`).join('');
    suggestionsBox.style.display = 'block';
});

function selectSearch(t) { movieInput.value = t; suggestionsBox.style.display = 'none'; handleSearch(); }

async function handleSearch() {
    toggleHomeUI(false); 
    const q = movieInput.value;
    categoryTitle.innerText = `🔍 KẾT QUẢ: ${q.toUpperCase()}`;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(q)}&language=vi-VN`);
    const data = await res.json();
    render(data.results);
}

// --- PHẦN LOGIN / REGISTER ---

// Mở/Đóng Modal
function toggleAuth() { 
    const m = document.getElementById('authModal');
    m.style.display = (m.style.display === "block") ? "none" : "block"; 
}

// Chuyển đổi tab Đăng nhập / Đăng ký
function switchTab(t) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const regFields = document.getElementById('registerFields');

    if (t === 'register') {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        regFields.style.display = 'block';
    } else {
        registerTab.classList.remove('active');
        loginTab.classList.add('active');
        regFields.style.display = 'none';
    }
}

// Xử lý khi nhấn nút XÁC NHẬN
document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn trang web bị load lại khi nhấn nút
    
    const email = this.querySelector('input[type="text"]').value;
    const isRegister = document.getElementById('registerTab').classList.contains('active');

    if (email) {
        alert(isRegister ? "Đăng ký thành công!" : "Đăng nhập thành công!");
        toggleAuth(); // Đóng bảng
        document.querySelector('.login-btn').innerText = "HELLO!"; // Đổi chữ trên Menu
    }
});