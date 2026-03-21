const API_KEY = "ec165fa8a1f0661dd141d4aed3680580";

const listDiv = document.getElementById('movieList');
const categoryTitle = document.getElementById('categoryTitle');
const movieInput = document.getElementById('movieInput');
const suggestionsBox = document.getElementById('searchSuggestions');

// ==========================================
// 1. QUẢN LÝ GIAO DIỆN (ẨN/HIỆN TRANG CHỦ)
// ==========================================
function toggleHomeUI(showHome) {
    const heroSection = document.querySelector('.hero-section');
    // Nếu showHome là true -> hiện banner/sidebar. Nếu false -> ẩn hết.
    if (heroSection) {
        heroSection.style.display = showHome ? 'block' : 'none';
    }
    // Luôn cuộn lên đầu trang mỗi khi chuyển mục để người dùng thấy nội dung mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 2. HÀM RENDER PHIM CHUNG
// ==========================================
function render(movies, targetDiv = listDiv) {
    if (!movies || movies.length === 0) {
        targetDiv.innerHTML = "<p style='padding:50px; text-align:center;'>Dữ liệu đang trống...</p>";
        return;
    }
    targetDiv.innerHTML = movies.map(m => `
        <div class="movie-card">
            <span class="badge-score">★ ${m.vote_average ? m.vote_average.toFixed(1) : '0.0'}</span>
            <span class="badge-quality" style="${targetDiv.id === 'recommendGrid' ? 'background:#e50914' : ''}">
                ${targetDiv.id === 'recommendGrid' ? 'TẬP ' + (Math.floor(Math.random() * 15) + 1) : 'Vietsub HD'}
            </span>
            <img src="${m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : 'https://via.placeholder.com/500x750?text=No+Poster'}">
            <div class="movie-info">
                <div class="movie-title">${m.title || m.name}</div>
                ${targetDiv.id === 'recommendGrid' ? `<p style="font-size:10px; color:#666; margin-top:5px;">Lượt xem: ${Math.floor(m.popularity).toLocaleString()}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// ==========================================
// 3. LẤY DỮ LIỆU PHIM (FETCH FUNCTIONS)
// ==========================================

// Lấy phim danh mục chính (Trending, Top Rated...)
async function fetchMovies(type) {
    // Chỉ hiện Banner/Sidebar nếu là mục 'trending' (Trang chủ)
    toggleHomeUI(type === 'trending');

    const sub = (type === 'trending') ? 'popular' : type;
    const url = `https://api.themoviedb.org/3/movie/${sub}?api_key=${API_KEY}&language=vi-VN`;
    try {
        const [r1, r2] = await Promise.all([fetch(`${url}&page=1`), fetch(`${url}&page=2`)]);
        const d1 = await r1.json();
        const d2 = await r2.json();
        render([...d1.results, ...d2.results]);
        
        const titles = { 
            'trending': '🎬 PHIM ĐANG THỊNH HÀNH', 
            'now_playing': '🍿 PHIM ĐANG CHIẾU RẠP', 
            'top_rated': '⭐ TOP PHIM ĐÁNH GIÁ CAO' 
        };
        categoryTitle.innerText = titles[type] || "DANH SÁCH PHIM";
    } catch (e) { console.error(e); }
}

// Lấy phim theo loại (Phim Lẻ / Phim Bộ)
async function fetchMoviesType(type) {
    toggleHomeUI(false); // Ẩn hoàn toàn banner/sidebar

    categoryTitle.innerText = (type === 'movie') ? "🎬 DANH SÁCH PHIM LẺ" : "📺 DANH SÁCH PHIM BỘ";
    const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=vi-VN&sort_by=popularity.desc&page=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        render(data.results);
    } catch (e) { console.error("Lỗi:", e); }
}

// Lọc theo Quốc gia
async function fetchByRegion(code) {
    toggleHomeUI(false);
    categoryTitle.innerText = `🌍 PHIM QUỐC GIA: ${code}`;
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=${code}&language=vi-VN&sort_by=popularity.desc`);
    const data = await res.json();
    render(data.results);
}

// Lọc theo Thể loại
async function fetchByGenre(id) {
    toggleHomeUI(false);
    categoryTitle.innerText = "🔍 LỌC THEO THỂ LOẠI";
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}&language=vi-VN&sort_by=popularity.desc`);
    const data = await res.json();
    render(data.results);
}

// Phần ĐỀ CỬ (Duy trì ở Trang Chủ)
async function fetchRecommended(type, element = null) {
    const grid = document.getElementById('recommendGrid');
    if (!grid) return;

    const tabs = document.querySelectorAll('.rec-tabs .tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (element) element.classList.add('active');
    else tabs[0].classList.add('active');

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=vi-VN&page=1`);
        const data = await res.json();
        const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 10);
        render(shuffled, grid);
    } catch (e) { console.error("Lỗi Đề cử:", e); }
}

// ==========================================
// 4. BANNER & SIDEBAR LOGIC
// ==========================================
let currentBannerIndex = 0;
let bannerList = [];

async function loadExtras() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=vi-VN`);
        const data = await res.json();
        bannerList = data.results;

        if (bannerList.length > 0) {
            updateBannerUI();
            setInterval(() => changeBanner(1), 5000);

            document.getElementById('hotWeekly').innerHTML = bannerList.slice(0, 5).map((m, i) => `
                <div class="side-item">
                    <span style="color:#8bc34a; font-weight:bold; font-size:18px; width:25px;">${i+1}</span>
                    <img src="https://image.tmdb.org/t/p/w92${m.poster_path}">
                    <div class="side-item-info">
                        <h4 style="font-size:13px; color:#fff; margin-bottom:5px;">${m.title || m.name}</h4>
                        <p style="font-size:11px; color:#ffc107;">★ ${m.vote_average.toFixed(1)}</p>
                    </div>
                </div>`).join('');

            document.getElementById('newUpdates').innerHTML = bannerList.slice(5, 13).map(m => `
                <li><a href="#" style="color:#ccc; text-decoration:none;">${m.title || m.name}</a><span style="color:#e50914; font-weight:bold; margin-left:10px;">HD</span></li>
            `).join('');
        }
    } catch (e) { console.log(e); }
}

function updateBannerUI() {
    const movie = bannerList[currentBannerIndex];
    const banner = document.getElementById('heroBanner');
    if(!banner || !movie) return;
    banner.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent), url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
    document.getElementById('heroTitle').innerText = movie.title || movie.name;
    document.getElementById('heroRating').innerText = `⭐ ${movie.vote_average.toFixed(1)}`;
    document.getElementById('heroDesc').innerText = movie.overview ? movie.overview.substring(0, 160) + "..." : "Đang cập nhật...";
}

function changeBanner(dir) {
    if (bannerList.length === 0) return;
    currentBannerIndex = (currentBannerIndex + dir + bannerList.length) % bannerList.length;
    updateBannerUI();
}

// ==========================================
// 5. TÌM KIẾM & AUTH
// ==========================================
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

function toggleAuth() { 
    const m = document.getElementById('authModal');
    m.style.display = (m.style.display === "block") ? "none" : "block"; 
}

function switchTab(t) {
    document.getElementById('loginTab').className = (t === 'login') ? 'tab-btn active' : 'tab-btn';
    document.getElementById('registerTab').className = (t === 'register') ? 'tab-btn active' : 'tab-btn';
    document.getElementById('registerFields').style.display = (t === 'register') ? 'block' : 'none';
}

// ==========================================
// 6. KHỞI CHẠY (ON LOAD)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    fetchMovies('trending');
    loadExtras();
    fetchRecommended('today');
});