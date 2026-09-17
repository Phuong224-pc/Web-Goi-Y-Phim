import React, { useEffect, useMemo, useState } from 'react';
import { 
  Eye, 
  MessageSquare, 
  Users, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Activity, 
  Play, 
  Tv, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  User, 
  MessageCircle,
  Database,
  Trash2
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import TrafficChart from './components/TrafficChart';
import MovieAnalytics from './components/MovieAnalytics';
import UserManagement from './components/UserManagement';

import { 
  initialMovies, 
  initialUsers, 
  systemStats, 
  trafficTrendData, 
} from './mockData';

const initialComments = [
  {
    id: 1,
    movieId: 1011989,
    movieTitle: 'Dune: Part Two',
    user: 'Trần Thanh Phương',
    avatar: 'TP',
    text: 'Phim quá đỉnh, kỹ xảo và âm thanh xem rạp phê thực sự. Vietsub của MoviePro chuẩn nhất!',
    time: '5 phút trước',
    createdAt: Date.now() - 5 * 60 * 1000
  },
  {
    id: 2,
    movieId: 872585,
    movieTitle: 'Oppenheimer',
    user: 'Alex Johnson',
    avatar: 'AJ',
    text: 'A masterpiece by Nolan. The tension buildup is amazing.',
    time: '25 phút trước',
    createdAt: Date.now() - 25 * 60 * 1000
  },
  {
    id: 3,
    movieId: 157336,
    movieTitle: 'Interstellar',
    user: 'Anonymous (IP: 14.232.89.102)',
    avatar: 'IP',
    text: 'Phim này xem đi xem lại 5 lần rồi vẫn khóc ở đoạn xem tin nhắn video.',
    time: '1 giờ trước',
    createdAt: Date.now() - 60 * 60 * 1000
  },
  {
    id: 4,
    movieId: 569094,
    movieTitle: 'Spider-Man: Across the Spider-Verse',
    user: 'Nguyễn Văn Hùng',
    avatar: 'VH',
    text: 'Visuals are mindblowing! Can\'t wait for the next part.',
    time: '2 giờ trước',
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  }
];

function readStoredComments() {
  const stored = localStorage.getItem('movie_comments');

  if (!stored) {
    return initialComments;
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return initialComments;
    }

    return parsed.map((comment, index) => ({
      ...comment,
      createdAt: comment.createdAt || Date.now() - index * 60000
    }));
  } catch (error) {
    return initialComments;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Lifted states to enable modifications across modules
  const [movies, setMovies] = useState(initialMovies);
  const [users, setUsers] = useState(initialUsers);
  const [comments, setComments] = useState(() => readStoredComments());
  const [commentSearch, setCommentSearch] = useState('');
  
  // Settings States
  const [apiKey, setApiKey] = useState("ec165fa8a1f0661dd141d4aed3680580");
  const [cacheExpiry, setCacheExpiry] = useState("24");
  const [serverDefault, setServerDefault] = useState("vidsrc.pro");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('movie_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'movie_comments') {
        setComments(readStoredComments());
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Statistics summaries derived from lifted states
  const registeredCount = users.filter(u => u.type === 'Registered').length;
  const guestCount = users.filter(u => u.type === 'Guest').length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const blockedCount = users.filter(u => u.status === 'Blocked').length;
  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [comments]
  );
  const liveComments = useMemo(() => sortedComments.slice(0, 4), [sortedComments]);
  const filteredComments = useMemo(() => {
    const needle = commentSearch.trim().toLowerCase();

    if (!needle) {
      return sortedComments;
    }

    return sortedComments.filter((comment) => {
      const haystack = [comment.user, comment.movieTitle, comment.text, comment.time]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [commentSearch, sortedComments]);
  const recentCommentCount = useMemo(
    () => comments.filter((comment) => (Date.now() - (comment.createdAt || 0)) <= 24 * 60 * 60 * 1000).length,
    [comments]
  );

  const handleDeleteComment = (commentId) => {
    const targetComment = comments.find((comment) => comment.id === commentId);

    if (!targetComment) {
      return;
    }

    const confirmed = window.confirm(
      `Xóa bình luận của ${targetComment.user} về ${targetComment.movieTitle}?`
    );

    if (!confirmed) {
      return;
    }

    setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    alert("System settings successfully written to firebase.json & environment configs.");
  };

  const handleClearCache = () => {
    alert("TMDB Movie cache flushed. Re-fetching new trending items on client reload.");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main Content Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header setSidebarOpen={setSidebarOpen} activeTab={activeTab} />

        {/* Dynamic Inner Content Pages */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full animate-fade-in">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Stats Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatsCard 
                  title="Total Page Views" 
                  value={systemStats.views.total.toLocaleString()} 
                  icon={Eye} 
                  trend={`+${systemStats.views.growth}%`} 
                  trendDirection="up" 
                  trendLabel="vs last month" 
                  color="brand"
                />
                <StatsCard 
                  title="Total Reviews / Comments" 
                  value={comments.length.toLocaleString()} 
                  icon={MessageSquare} 
                  trend={`${recentCommentCount} posts`} 
                  trendDirection="neutral" 
                  trendLabel="in the last 24h" 
                  color="info"
                />
                <StatsCard 
                  title="Account Ratios" 
                  value={`${registeredCount} / ${guestCount}`} 
                  icon={Users} 
                  trend={`${((registeredCount / (registeredCount + guestCount)) * 100).toFixed(0)}% Mem`} 
                  trendDirection="info" 
                  trendLabel="Registered vs Guest ratio" 
                  color="gray"
                />
              </div>

              {/* Charts & Feed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Trend Chart (Spans 2 columns on lg screens) */}
                <div className="lg:col-span-2">
                  <TrafficChart data={trafficTrendData} />
                </div>

                {/* Recent Platform Activities */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide border-b border-dark-border pb-3 mb-4 flex items-center gap-2">
                      <Activity size={16} className="text-brand animate-pulse-slow" />
                      Live Feed Comments
                    </h4>
                    
                    <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                      {liveComments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-[#121216]/50 border border-dark-border/40 rounded-xl space-y-1.5 hover:border-dark-border transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-[9px] border border-brand/20">
                                {comment.avatar}
                              </span>
                              <span className="text-[10px] font-bold text-white truncate max-w-[100px]">{comment.user}</span>
                            </div>
                            <span className="text-[9px] text-dark-muted font-medium font-mono">{comment.time}</span>
                          </div>
                          
                          <p className="text-[10px] text-[#8c94a5] font-semibold truncate">
                            Movie: <span className="text-gray-300 italic">"{comment.movie}"</span>
                          </p>
                          <p className="text-[10px] text-gray-300 leading-normal line-clamp-2">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-dark-border/40 text-[10px] text-center text-dark-muted">
                    Platform Event Listeners: <span className="text-green-400 font-bold">ONLINE</span>
                  </div>
                </div>
              </div>

              {/* Comment Management Snapshot */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <MessageCircle size={16} className="text-brand" />
                      Comment Management Snapshot
                    </h4>
                    <p className="text-[10px] text-dark-muted mt-1">Open the dedicated comments tab to filter or delete entries.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className="text-[10px] bg-brand/10 border border-brand/20 text-brand px-3 py-2 rounded-lg font-bold hover:bg-brand/20 transition-colors"
                  >
                    Open Comments Hub
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold">VISIBLE COMMENTS</span>
                    <span className="text-base font-bold text-white mt-1 block font-mono">{comments.length}</span>
                  </div>
                  <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold">RECENT 24H</span>
                    <span className="text-base font-bold text-green-400 mt-1 block font-mono">{recentCommentCount}</span>
                  </div>
                  <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold">ACTIVE MOVIES</span>
                    <span className="text-base font-bold text-brand mt-1 block font-mono">
                      {new Set(comments.map((comment) => comment.movieId)).size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Analytics Previews */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Top Movies Quick Overview */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-dark-border pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Stream This Week</h4>
                    <button 
                      onClick={() => setActiveTab('movies')}
                      className="text-[10px] text-brand font-bold hover:underline"
                    >
                      View All Analytics
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                    <img 
                      src={movies[0].image} 
                      alt={movies[0].title}
                      className="w-12 h-16 rounded object-cover border border-dark-border"
                    />
                    <div className="flex-grow">
                      <h5 className="text-xs font-bold text-white">{movies[0].title}</h5>
                      <p className="text-[10px] text-dark-muted mt-0.5">{movies[0].genre}</p>
                      <span className="text-[9px] bg-brand/10 border border-brand/20 text-brand font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block">
                        🔥 Trending #1
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-white">{(movies[0].views.week).toLocaleString()} views</p>
                      <p className="text-[9px] text-yellow-500 font-semibold mt-1">★ {movies[0].rating.toFixed(1)} Rating</p>
                    </div>
                  </div>
                </div>

                {/* Database Quick Health Checks */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-dark-border pb-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Storage & User Health</h4>
                    <span className="text-[9px] text-green-400 font-mono">Sync Interval: 10s</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                      <span className="text-[9px] text-dark-muted block font-semibold">ACTIVE USERS</span>
                      <span className="text-base font-bold text-green-400 mt-1 block font-mono">{activeCount}</span>
                    </div>
                    <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                      <span className="text-[9px] text-dark-muted block font-semibold">BLOCKED IP/MEM</span>
                      <span className="text-base font-bold text-red-400 mt-1 block font-mono">{blockedCount}</span>
                    </div>
                    <div className="bg-[#121216]/40 p-3 rounded-xl border border-dark-border">
                      <span className="text-[9px] text-dark-muted block font-semibold">MOVIES TRACKED</span>
                      <span className="text-base font-bold text-white mt-1 block font-mono">{movies.length}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MOVIE PERFORMANCE */}
          {activeTab === 'movies' && (
            <MovieAnalytics movies={movies} />
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <UserManagement users={users} setUsers={setUsers} />
          )}

          {/* TAB 4: COMMENTS MANAGEMENT */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <MessageSquare size={18} className="text-brand" />
                      Comments Management
                    </h3>
                    <p className="text-xs text-dark-muted mt-1">Search comments by user, movie, or content, then delete anything inappropriate.</p>
                  </div>

                  <div className="w-full lg:w-96">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-dark-muted block mb-2">Search comments</label>
                    <input
                      type="text"
                      value={commentSearch}
                      onChange={(event) => setCommentSearch(event.target.value)}
                      placeholder="Search by user, movie, text..."
                      className="w-full bg-[#0a0a0c] border border-dark-border rounded-xl text-sm text-white px-4 py-3 outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#121216]/40 p-4 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold uppercase">Total comments</span>
                    <span className="text-2xl font-bold text-white mt-1 block font-mono">{comments.length}</span>
                  </div>
                  <div className="bg-[#121216]/40 p-4 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold uppercase">Filtered results</span>
                    <span className="text-2xl font-bold text-brand mt-1 block font-mono">{filteredComments.length}</span>
                  </div>
                  <div className="bg-[#121216]/40 p-4 rounded-xl border border-dark-border">
                    <span className="text-[9px] text-dark-muted block font-semibold uppercase">Movies discussed</span>
                    <span className="text-2xl font-bold text-green-400 mt-1 block font-mono">{new Set(comments.map((comment) => comment.movieId)).size}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredComments.length === 0 ? (
                  <div className="glass-panel p-10 rounded-2xl text-center">
                    <MessageSquare size={28} className="mx-auto text-dark-muted mb-3" />
                    <p className="text-sm font-semibold text-white">No comments match this search.</p>
                    <p className="text-xs text-dark-muted mt-1">Try a different keyword or clear the search box.</p>
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div key={comment.id} className="glass-panel p-5 rounded-2xl border border-dark-border/70 hover:border-[#33334d] transition-colors space-y-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center font-bold text-brand text-sm flex-shrink-0">
                            {comment.avatar || 'CM'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">{comment.user}</h4>
                              <span className="text-[10px] text-dark-muted font-mono">{comment.time || 'Vừa xong'}</span>
                            </div>
                            <p className="text-xs text-dark-muted mt-1">
                              Movie: <span className="text-gray-200 italic">{comment.movieTitle}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="inline-flex items-center gap-2 self-start md:self-auto px-3 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/20 hover:bg-red-950/35 border border-red-900/40 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>

                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SettingsIcon size={18} className="text-brand" />
                  Streaming Configuration Panel
                </h3>
                <p className="text-xs text-dark-muted mt-1">Configure global API tokens, default mirror player instances, and flushing policies.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5">
                
                {/* TMDB API Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block">TMDB API Key (v3 authentication)</label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-dark-border rounded-xl text-xs text-white px-4 py-2.5 outline-none focus:border-brand transition-colors font-mono"
                    required
                  />
                  <span className="text-[10px] text-dark-muted block">Direct key linked to TMDB client operations. Overwriting this immediately changes movie suggestions feed.</span>
                </div>

                {/* Default Server Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block">Default Mirror Video Server</label>
                  <select
                    value={serverDefault}
                    onChange={(e) => setServerDefault(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-dark-border rounded-xl text-xs text-white px-4 py-2.5 outline-none focus:border-brand transition-colors"
                  >
                    <option value="vidsrc.pro">Server 1 (Vidsrc.pro)</option>
                    <option value="vidsrc.me">Server 2 (Vidsrc.me)</option>
                    <option value="2embed.org">Server 3 (2Embed.org)</option>
                  </select>
                </div>

                {/* Cache timeout parameters */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white block">Poster/Detail Cache Expiry (Hours)</label>
                  <input
                    type="number"
                    value={cacheExpiry}
                    onChange={(e) => setCacheExpiry(e.target.value)}
                    className="w-full bg-[#0a0a0c] border border-dark-border rounded-xl text-xs text-white px-4 py-2.5 outline-none focus:border-brand transition-colors font-mono"
                    min="1"
                    max="168"
                    required
                  />
                </div>

                {/* Maintenance switch toggling */}
                <div className="flex items-center justify-between bg-[#121216]/50 border border-dark-border p-4 rounded-xl">
                  <div>
                    <h5 className="text-xs font-bold text-white">Platform Maintenance Mode</h5>
                    <p className="text-[10px] text-dark-muted mt-0.5">Redirect users to system down page. Admins can bypass this toggle.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#0a0a0c] border border-dark-border rounded-full peer peer-focus:ring-0 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                  </label>
                </div>

                {/* Button actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dark-border/40">
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="flex items-center gap-1.5 bg-dark-bg hover:bg-dark-border border border-dark-border px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <RotateCcw size={14} /> Clear Cache
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-brand/10 glow-red"
                  >
                    <Save size={14} /> Save Configuration
                  </button>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
