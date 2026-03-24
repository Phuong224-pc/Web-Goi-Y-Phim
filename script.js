const API_KEY = "ec165fa8a1f0661dd141d4aed3680580";

const listDiv = document.getElementById('movieList');
const categoryTitle = document.getElementById('categoryTitle');
const movieInput = document.getElementById('movieInput');
const suggestionsBox = document.getElementById('searchSuggestions');

// Biến quản lý trạng thái
let currentMovieId = null;
let currentBannerIndex = 0;
let bannerList = [];
let countdownInterval;

// ==========================================
// 1. QUẢN LÝ GIAO DIỆN (ẨN/HIỆN TRANG CHỦ)
// ==========================================
function toggleHomeUI(showHome) {
    const heroSection = document.querySelector('.hero-section');
    const upcomingGrid = document.getElementById('upcomingGrid');
    const upcomingSection = upcomingGrid ? upcomingGrid.closest('.container') : null;

    if (heroSection) heroSection.style.display = showHome ? 'block' : 'none';

    if (upcomingSection) {
        upcomingSection.style.display = showHome ? 'block' : 'none';
        const divider = upcomingSection.nextElementSibling;
        if (divider && divider.tagName === 'HR') {
            divider.style.display = showHome ? 'block' : 'none';
        }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 2. HÀM RENDER PHIM (CÓ SỰ KIỆN CLICK CHI TIẾT)
// ==========================================
function render(movies, targetDiv = listDiv) {
    if (!movies || movies.length === 0) {
        targetDiv.innerHTML = "<p style='padding:50px; text-align:center;'>Dữ liệu đang trống...</p>";
        return;
    }
    targetDiv.innerHTML = movies.map(m => `
        <div class="movie-card" onclick="showDetails(${m.id})">
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
// 3. LOGIC CHI TIẾT & TRÌNH PHÁT PHIM
// ==========================================
async function showDetails(id) {
    currentMovieId = id;
    const detailPage = document.getElementById('movieDetailsPage');
    if(!detailPage) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits`);
        const m = await res.json();

        // Đổ dữ liệu vào Overlay
        document.getElementById('detailsHero').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${m.backdrop_path}')`;
        document.getElementById('detailsImg').src = `https://image.tmdb.org/t/p/w500${m.poster_path}`;
        document.getElementById('detailsTitle').innerText = m.title;
        document.getElementById('detailsYear').innerText = m.release_date ? m.release_date.split('-')[0] : "N/A";
        document.getElementById('detailsRating').innerText = `⭐ ${m.vote_average.toFixed(1)}`;
        document.getElementById('detailsRuntime').innerText = `${m.runtime || 0} phút`;
        document.getElementById('detailsOverview').innerText = m.overview || "Nội dung đang được cập nhật...";
        document.getElementById('detailsGenres').innerHTML = m.genres.map(g => `<span>${g.name}</span>`).join('');
        document.getElementById('detailsCast').innerHTML = m.credits.cast.slice(0, 6).map(c => `
            <div class="cast-item">
                <img src="${c.profile_path ? 'https://image.tmdb.org/t/p/w185' + c.profile_path : 'https://via.placeholder.com/100x150'}">
                <p>${c.name}</p>
            </div>
        `).join('');

        // Gán sự kiện nút xem phim
        document.getElementById('detailsPlayBtn').onclick = () => watchMovie(id, m.title);

        detailPage.classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (e) { console.error("Lỗi lấy chi tiết:", e); }
}

function closeDetails() {
    document.getElementById('movieDetailsPage').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function watchMovie(id, title) {
    currentMovieId = id;
    const modal = document.getElementById('playerModal');
    const titleEl = document.getElementById('playerTitle');
    if(titleEl) titleEl.innerText = `Đang xem: ${title}`;
    
    switchServer(1);
    modal.style.display = 'block';
}

function switchServer(serverNum) {
    const iframe = document.getElementById('moviePlayer');
    const btns = document.querySelectorAll('.btn-server');
    btns.forEach((btn, index) => btn.classList.toggle('active', index === (serverNum - 1)));

    let url = "";
    if (serverNum === 1) url = `https://vidsrc.pro/embed/movie/${currentMovieId}`;
    else if (serverNum === 2) url = `https://vidsrc.me/embed/movie/${currentMovieId}`;
    else url = `https://www.2embed.cc/embed/${currentMovieId}`;
    iframe.src = url;
}

function closePlayer() {
    document.getElementById('playerModal').style.display = 'none';
    document.getElementById('moviePlayer').src = "";
}

// ==========================================
// 4. FETCH DATA & SIDEBAR
// ==========================================
async function fetchMovies(type) {
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

async function loadExtras() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=vi-VN`);
        const data = await res.json();
        bannerList = data.results;

        if (bannerList.length > 0) {
            updateBannerUI();
            setInterval(() => changeBanner(1), 5000);

            // Sidebar: Mới cập nhật / Hot Weekly
            const hotDiv = document.getElementById('hotWeekly');
            if(hotDiv) {
                hotDiv.innerHTML = bannerList.slice(0, 5).map((m, i) => `
                    <div class="side-item" onclick="showDetails(${m.id})">
                        <span style="color:#8bc34a; font-weight:bold; font-size:18px; width:25px;">${i+1}</span>
                        <img src="https://image.tmdb.org/t/p/w92${m.poster_path}">
                        <div class="side-item-info">
                            <h4 style="font-size:13px; color:#fff; margin-bottom:5px;">${m.title}</h4>
                            <p style="font-size:11px; color:#ffc107;">★ ${m.vote_average.toFixed(1)}</p>
                        </div>
                    </div>`).join('');
            }
        }
    } catch (e) { console.error(e); }
}

function updateBannerUI() {
    const movie = bannerList[currentBannerIndex];
    const banner = document.getElementById('heroBanner');
    if(!banner || !movie) return;

    banner.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent), url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
    document.getElementById('heroTitle').innerText = movie.title || movie.name;
    document.getElementById('heroRating').innerText = `⭐ ${movie.vote_average.toFixed(1)}`;
    document.getElementById('heroDesc').innerText = movie.overview ? movie.overview.substring(0, 160) + "..." : "Xem ngay bộ phim cực hot này tại MovieZ...";
    
    // Gán sự kiện click cho nút Xem Phim trên Banner
    const playBtn = document.querySelector('.btn-play');
    if(playBtn) playBtn.onclick = () => showDetails(movie.id);
}

function changeBanner(dir) {
    if (bannerList.length === 0) return;
    currentBannerIndex = (currentBannerIndex + dir + bannerList.length) % bannerList.length;
    updateBannerUI();
}

// ==========================================
// 5. COUNTDOWN & UPCOMING
// ==========================================
function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        document.querySelectorAll('.countdown-bar').forEach(timer => {
            const releaseDate = new Date(timer.getAttribute('data-date')).getTime();
            const distance = releaseDate - new Date().getTime();
            if (distance < 0) {
                timer.innerHTML = "ĐÃ CÔNG CHIẾU";
                timer.style.background = "#4CAF50"; 
            } else {
                const d = Math.floor(distance / (1000 * 60 * 60 * 24));
                const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);
                timer.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
            }
        });
    }, 1000);
}

async function fetchUpcoming() {
    const grid = document.getElementById('upcomingGrid');
    if (!grid) return;
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=vi-VN&page=1`);
        const data = await res.json();
        const movies = data.results.filter(m => new Date(m.release_date) > new Date()).slice(0, 5);

        grid.innerHTML = movies.map(m => {
            const dateParts = m.release_date.split('-');
            return `
                <div class="movie-card" onclick="showDetails(${m.id})">
                    <div class="poster-wrapper" style="position: relative; overflow: hidden; border-radius: 8px;">
                        <span class="badge-score">★ ${m.vote_average.toFixed(1)}</span>
                        <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" style="width:100%; display:block;">
                        <div class="upcoming-date-overlay">
                            <div class="year-month">${dateParts[0]}-${dateParts[1]}</div>
                            <div class="day">${dateParts[2]}</div>
                        </div>
                        <div class="countdown-bar" data-date="${m.release_date}">Đang tính toán...</div>
                    </div>
                    <div class="movie-info"><div class="movie-title">${m.title}</div></div>
                </div>`;
        }).join('');
        startCountdown(); 
    } catch (e) { console.error(e); }
}

// --- TÌM KIẾM ---
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
    categoryTitle.innerText = `🔍 KẾT QUẢ: ${movieInput.value.toUpperCase()}`;
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(movieInput.value)}&language=vi-VN`);
    const data = await res.json();
    render(data.results);
}

// ==========================================
// 6. KHỞI CHẠY (ON LOAD)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    fetchMovies('trending');
    loadExtras();
    fetchUpcoming();
    
    // Load Đề cử nếu có grid
    const recommendGrid = document.getElementById('recommendGrid');
    if(recommendGrid) {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=vi-VN&page=1`)
            .then(res => res.json())
            .then(data => render(data.results.slice(0, 10), recommendGrid));
    }
});
