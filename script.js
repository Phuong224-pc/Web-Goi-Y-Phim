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
    // Tìm container chứa phần Sắp Chiếu (thẻ div bao quanh upcomingGrid)
    const upcomingGrid = document.getElementById('upcomingGrid');
    const upcomingSection = upcomingGrid ? upcomingGrid.closest('.container') : null;

    if (heroSection) {
        heroSection.style.display = showHome ? 'block' : 'none';
    }

    // Ẩn/Hiện luôn cả phần Sắp Chiếu và đường kẻ ngang trang trí
    if (upcomingSection) {
        upcomingSection.style.display = showHome ? 'block' : 'none';
        // Ẩn luôn thẻ <hr> liền sau nó nếu có
        const divider = upcomingSection.nextElementSibling;
        if (divider && divider.tagName === 'HR') {
            divider.style.display = showHome ? 'block' : 'none';
        }
    }

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
    toggleHomeUI(false); 
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
    <li class="new-update-item">
        <div class="update-thumb">
            <img src="${m.poster_path ? 'https://image.tmdb.org/t/p/w92' + m.poster_path : 'https://via.placeholder.com/92x138?text=No+Poster'}" alt="${m.title || m.name}">
        </div>
        <div class="update-info">
            <a href="#" class="update-name-link">${m.title || m.name}</a>
            <span class="update-hd-tag">HD</span>
        </div>
    </li>
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
    fetchUpcoming();
});

// ==========================================
// 3.5. LOGIC SẮP CHIẾU & ĐẾM NGƯỢC (ĐÃ SỬA LỖI)
// ==========================================
let countdownInterval;

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const timers = document.querySelectorAll('.countdown-bar');
        timers.forEach(timer => {
            const releaseDate = new Date(timer.getAttribute('data-date')).getTime();
            const now = new Date().getTime();
            const distance = releaseDate - now;

            if (distance < 0) {
                timer.innerHTML = "ĐÃ CÔNG CHIẾU";
                timer.style.background = "#4CAF50"; 
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        });
    }, 1000);
}

async function fetchUpcoming() {
    const grid = document.getElementById('upcomingGrid');
    if (!grid) return;

    // KIỂM TRA: Nếu không ở trang chủ thì thoát, không nạp dữ liệu vào grid ẩn
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && heroSection.style.display === 'none') return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=vi-VN&page=1`);
        const data = await res.json();
        const movies = data.results.filter(m => new Date(m.release_date) > new Date()).slice(0, 5);

        grid.innerHTML = movies.map(m => {
            const dateParts = m.release_date.split('-');
            const yearMonth = `${dateParts[0]}-${dateParts[1]}`;
            const day = dateParts[2];

            return `
                <div class="movie-card">
                    <div class="poster-wrapper" style="position: relative; overflow: hidden; border-radius: 8px;">
                        <span class="badge-score">★ ${m.vote_average.toFixed(1)}</span>
                        <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" style="width:100%; display:block;">
                        <div class="upcoming-date-overlay">
                            <div class="year-month">${yearMonth}</div>
                            <div class="day">${day}</div>
                        </div>
                        <div class="countdown-bar" data-date="${m.release_date}">Đang tính toán...</div>
                    </div>
                    <div class="movie-info">
                        <div class="movie-title">${m.title}</div>
                        <p style="font-size:10px; color:#666; margin-top:5px;">Lượt xem: ${Math.floor(m.popularity * 10).toLocaleString()}</p>
                    </div>
                </div>
            `;
        }).join('');
        startCountdown(); 
    } catch (e) { console.error("Lỗi Upcoming:", e); }

}
// ==========================================
// 7. LOGIC CHI TIẾT PHIM & XEM PHIM (MỚI)
// ==========================================

// Hàm mở trang chi tiết khi click vào Movie Card
async function openDetails(movieId) {
    const detailsPage = document.getElementById('movieDetailsPage');
    if (!detailsPage) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits,recommendations`);
        const m = await res.json();

        // 1. Cập nhật Banner Chi tiết
        const hero = detailsPage.querySelector('.details-hero');
        hero.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${m.backdrop_path}')`;

        // 2. Cập nhật thông tin cơ bản
        detailsPage.querySelector('.details-poster img').src = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
        detailsPage.querySelector('.details-info h1').innerText = m.title;
        detailsPage.querySelector('.meta-row').innerHTML = `
            <span>📅 ${m.release_date.split('-')[0]}</span>
            <span>⭐ ${m.vote_average.toFixed(1)}</span>
            <span>⏱️ ${m.runtime} phút</span>
        `;
        
        // 3. Cập nhật thể loại
        detailsPage.querySelector('.genre-tags').innerHTML = m.genres.map(g => `<span>${g.name}</span>`).join('');
        
        // 4. Cập nhật nội dung
        detailsPage.querySelector('.overview-text').innerText = m.overview || "Nội dung đang được cập nhật...";

        // 5. Cập nhật dàn diễn viên (Lấy 6 người đầu)
        detailsPage.querySelector('.cast-grid').innerHTML = m.credits.cast.slice(0, 6).map(c => `
            <div class="cast-item">
                <img src="${c.profile_path ? 'https://image.tmdb.org/t/p/w185' + c.profile_path : 'https://via.placeholder.com/100x150'}">
                <p>${c.name}</p>
            </div>
        `).join('');

        // 6. Gán ID cho nút xem phim
        const playBtn = detailsPage.querySelector('.btn-play-now');
        if (playBtn) {
            playBtn.onclick = () => playMovie(m.id, m.title);
        }

        // Hiển thị Overlay
        detailsPage.classList.add('active');
        document.body.style.overflow = 'hidden'; // Chống cuộn trang chính khi đang xem chi tiết

    } catch (e) { console.error("Lỗi lấy chi tiết:", e); }
}

// Hàm đóng trang chi tiết
function closeDetails() {
    const detailsPage = document.getElementById('movieDetailsPage');
    detailsPage.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Dừng phim nếu đang phát khi đóng
    const playerModal = document.getElementById('playerModal');
    if (playerModal) playerModal.style.display = 'none';
    document.getElementById('moviePlayer').src = '';
}

// Hàm xử lý phát phim với Multi-Server
function playMovie(id, title) {
    const playerModal = document.getElementById('playerModal');
    const iframe = document.getElementById('moviePlayer');
    const serverBtns = document.querySelectorAll('.btn-server');

    playerModal.style.display = 'block';
    
    // Mặc định chạy Server 1 (Vidsrc.pro)
    const servers = [
        `https://vidsrc.pro/embed/movie/${id}`,
        `https://vidsrc.me/embed/movie/${id}`,
        `https://2embed.org/embed/movie/${id}`
    ];

    iframe.src = servers[0];

    // Xử lý đổi Server khi click
    serverBtns.forEach((btn, index) => {
        btn.onclick = () => {
            serverBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            iframe.src = servers[index];
        };
    });
}

// ==========================================
// 8. CẬP NHẬT HÀM RENDER (THÊM SỰ KIỆN CLICK)
// ==========================================

// Ghi đè hàm render cũ của bạn để thêm thuộc tính onclick
function render(movies, targetDiv = listDiv) {
    if (!movies || movies.length === 0) {
        targetDiv.innerHTML = "<p style='padding:50px; text-align:center;'>Dữ liệu đang trống...</p>";
        return;
    }
    targetDiv.innerHTML = movies.map(m => `
        <div class="movie-card" onclick="openDetails(${m.id})">
            <span class="badge-score">★ ${m.vote_average ? m.vote_average.toFixed(1) : '0.0'}</span>
            <span class="badge-quality">Vietsub HD</span>
            <img src="${m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : 'https://via.placeholder.com/500x750?text=No+Poster'}">
            <div class="movie-info">
                <div class="movie-title">${m.title || m.name}</div>
            </div>
        </div>
    `).join('');
}