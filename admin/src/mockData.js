// Mock Data for Movie Streaming Platform Admin Dashboard

export const initialMovies = [
  // Top 5 Most Viewed (High views overall)
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi / Adventure",
    image: "https://image.tmdb.org/t/p/w185/1pdfxrq84lG654gNVpG2645VLIg.jpg", // Dune 2 poster
    views: {
      week: 12450,
      month: 48900,
      allTime: 189200
    },
    rating: 8.4,
    status: "Trending"
  },
  {
    id: 2,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation / Action",
    image: "https://image.tmdb.org/t/p/w185/8Vt1egmZJD596IIT7tOr6WrPH0C.jpg", // Spiderman poster
    views: {
      week: 9800,
      month: 42300,
      allTime: 254100
    },
    rating: 8.7,
    status: "Popular"
  },
  {
    id: 3,
    title: "Interstellar",
    genre: "Sci-Fi / Drama",
    image: "https://image.tmdb.org/t/p/w185/gEU2Qv4zcyFg7SL36E31336uTYq.jpg", // Interstellar poster
    views: {
      week: 7200,
      month: 35100,
      allTime: 420500
    },
    rating: 8.6,
    status: "Classic"
  },
  {
    id: 4,
    title: "The Dark Knight",
    genre: "Action / Drama",
    image: "https://image.tmdb.org/t/p/w185/qJ2tWGBbeZ561vJ63zZg6S0jmoR.jpg", // Dark Knight poster
    views: {
      week: 8500,
      month: 38700,
      allTime: 398000
    },
    rating: 9.0,
    status: "Classic"
  },
  {
    id: 5,
    title: "Oppenheimer",
    genre: "Biography / Drama",
    image: "https://image.tmdb.org/t/p/w185/8Gxl0d3Dgo1wsq2CcR15Ev4PyMV.jpg", // Oppenheimer poster
    views: {
      week: 11200,
      month: 46200,
      allTime: 195400
    },
    rating: 8.3,
    status: "Trending"
  },

  // Bottom 5 Least Viewed (Low views overall)
  {
    id: 6,
    title: "Superbabies: Baby Geniuses 2",
    genre: "Comedy / Family",
    image: "https://image.tmdb.org/t/p/w185/jK88uO291s3dG7u5B6j1x7Z7k6R.jpg", // Bad movie poster placeholder style
    views: {
      week: 120,
      month: 480,
      allTime: 1200
    },
    rating: 1.5,
    status: "Underperforming"
  },
  {
    id: 7,
    title: "Birdemic: Shock and Terror",
    genre: "Horror / Thriller",
    image: "https://image.tmdb.org/t/p/w185/f3yPZ5jR7hSjXvOin48c8bU5Qd.jpg",
    views: {
      week: 85,
      month: 320,
      allTime: 850
    },
    rating: 1.8,
    status: "Underperforming"
  },
  {
    id: 8,
    title: "Foodfight!",
    genre: "Animation / Comedy",
    image: "https://image.tmdb.org/t/p/w185/tN3v3o3x5kK2hH7z4tqfP6dK9N9.jpg",
    views: {
      week: 45,
      month: 190,
      allTime: 540
    },
    rating: 1.3,
    status: "Underperforming"
  },
  {
    id: 9,
    title: "Titanic II",
    genre: "Action / Adventure",
    image: "https://image.tmdb.org/t/p/w185/yL3p5j0K7mZ4O1zJ5kK2hH7z4tq.jpg",
    views: {
      week: 190,
      month: 760,
      allTime: 2300
    },
    rating: 2.0,
    status: "Underperforming"
  },
  {
    id: 10,
    title: "The Room",
    genre: "Drama / Romance",
    image: "https://image.tmdb.org/t/p/w185/4cE5hWwG7zD8m1x7Z7k6R12345.jpg",
    views: {
      week: 250,
      month: 980,
      allTime: 3400
    },
    rating: 3.7,
    status: "Cult / Underperforming"
  }
];

export const initialUsers = [
  // Registered Users (emails, names, join dates)
  {
    id: "USR-4829",
    name: "Trần Thanh Phương",
    email: "phuongtt@moviepro.vn",
    type: "Registered",
    joinDate: "2026-01-10",
    watchTime: "124 hrs",
    status: "Active"
  },
  {
    id: "USR-7491",
    name: "Alex Johnson",
    email: "alex.j@gmail.com",
    type: "Registered",
    joinDate: "2026-03-15",
    watchTime: "87 hrs",
    status: "Active"
  },
  {
    id: "USR-1029",
    name: "Nguyễn Văn Hùng",
    email: "hungnv@outlook.com",
    type: "Registered",
    joinDate: "2026-04-02",
    watchTime: "210 hrs",
    status: "Active"
  },
  {
    id: "USR-8842",
    name: "Sarah Parker",
    email: "sarah.p@yahoo.com",
    type: "Registered",
    joinDate: "2026-05-19",
    watchTime: "45 hrs",
    status: "Blocked"
  },
  {
    id: "USR-3051",
    name: "Phạm Minh Đức",
    email: "ducpm@fpt.edu.vn",
    type: "Registered",
    joinDate: "2026-06-01",
    watchTime: "12 hrs",
    status: "Active"
  },

  // Guest Users (IP / Session ID)
  {
    id: "GST-9482",
    name: "Anonymous (IP: 113.161.43.12)",
    email: "Session: sess_a8f902de",
    type: "Guest",
    joinDate: "2026-06-15",
    watchTime: "3.5 hrs",
    status: "Active"
  },
  {
    id: "GST-2957",
    name: "Anonymous (IP: 14.232.89.102)",
    email: "Session: sess_b230df8c",
    type: "Guest",
    joinDate: "2026-06-15",
    watchTime: "1.2 hrs",
    status: "Active"
  },
  {
    id: "GST-6381",
    name: "Anonymous (IP: 27.72.145.30)",
    email: "Session: sess_7f2cd4ba",
    type: "Guest",
    joinDate: "2026-06-14",
    watchTime: "15 mins",
    status: "Active"
  },
  {
    id: "GST-4820",
    name: "Anonymous (IP: 115.79.201.8)",
    email: "Session: sess_6d83e29f",
    type: "Guest",
    joinDate: "2026-06-14",
    watchTime: "8.4 hrs",
    status: "Active"
  },
  {
    id: "GST-0294",
    name: "Anonymous (IP: 42.113.204.55)",
    email: "Session: sess_c92de102",
    type: "Guest",
    joinDate: "2026-06-13",
    watchTime: "0 mins",
    status: "Blocked"
  }
];

export const systemStats = {
  views: {
    total: 384920,
    growth: 14.8,
    timeframe: "vs last month"
  },
  comments: {
    total: 12480,
    recentCount: 142,
    timeframe: "in the last 24h"
  },
  users: {
    registered: 18450,
    guest: 45920,
    ratio: "28.6% Registered"
  }
};

// Last 7 days traffic metrics (Registered Views vs Guest Views)
export const trafficTrendData = [
  { day: "Mon", registered: 4200, guest: 8500 },
  { day: "Tue", registered: 4600, guest: 9100 },
  { day: "Wed", registered: 5100, guest: 10400 },
  { day: "Thu", registered: 4800, guest: 9800 },
  { day: "Fri", registered: 6200, guest: 12500 },
  { day: "Sat", registered: 8500, guest: 16800 },
  { day: "Sun", registered: 9200, guest: 18200 }
];

export const recentComments = [
  {
    id: 1,
    user: "Trần Thanh Phương",
    avatar: "TP",
    movie: "Dune: Part Two",
    text: "Phim quá đỉnh, kỹ xảo và âm thanh xem rạp phê thực sự. Vietsub của MoviePro chuẩn nhất!",
    time: "5 phút trước"
  },
  {
    id: 2,
    user: "Alex Johnson",
    avatar: "AJ",
    movie: "Oppenheimer",
    text: "A masterpiece by Nolan. The tension buildup is amazing.",
    time: "25 phút trước"
  },
  {
    id: 3,
    user: "Anonymous (IP: 14.232.89.102)",
    avatar: "IP",
    movie: "Interstellar",
    text: "Phim này xem đi xem lại 5 lần rồi vẫn khóc ở đoạn xem tin nhắn video.",
    time: "1 giờ trước"
  },
  {
    id: 4,
    user: "Nguyễn Văn Hùng",
    avatar: "VH",
    movie: "Spider-Man: Across the Spider-Verse",
    text: "Visuals are mindblowing! Can't wait for the next part.",
    time: "2 giờ trước"
  }
];
