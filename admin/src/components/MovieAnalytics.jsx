import React, { useState } from 'react';
import { Play, ArrowUpRight, ArrowDownRight, Eye, Star, Film, TrendingUp } from 'lucide-react';

export default function MovieAnalytics({ movies }) {
  const [timeframe, setTimeframe] = useState('allTime'); // 'week', 'month', 'allTime'

  const handleTimeframeChange = (time) => {
    setTimeframe(time);
  };

  // Sort and filter top 5 movies based on selected timeframe views
  const topMovies = [...movies]
    .sort((a, b) => b.views[timeframe] - a.views[timeframe])
    .slice(0, 5);

  // Sort and filter bottom 5 movies based on selected timeframe views
  const bottomMovies = [...movies]
    .sort((a, b) => a.views[timeframe] - b.views[timeframe])
    .slice(0, 5);

  const getPercentageWidth = (views, maxViews) => {
    return `${Math.min(100, (views / maxViews) * 100)}%`;
  };

  // Maximum view count for sizing progress bars
  const maxTopViews = Math.max(...topMovies.map(m => m.views[timeframe]));
  const maxBottomViews = Math.max(...bottomMovies.map(m => m.views[timeframe])) || 1;

  const timeframeLabels = {
    week: "This Week",
    month: "This Month",
    allTime: "All Time"
  };

  return (
    <div className="space-y-6">
      {/* Timeframe Filter Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-panel border border-dark-border p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Film className="text-brand" size={18} />
          <span className="text-sm font-semibold text-white">Filter Performance Data</span>
        </div>
        <div className="flex bg-[#0a0a0c] p-1 rounded-xl border border-dark-border">
          {['week', 'month', 'allTime'].map((time) => (
            <button
              key={time}
              onClick={() => handleTimeframeChange(time)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                timeframe === time
                  ? 'bg-brand text-white shadow-md glow-red'
                  : 'text-dark-muted hover:text-white'
              }`}
            >
              {time === 'allTime' ? 'All Time' : time === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Most Viewed & Least Viewed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Most Viewed Column */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  Most Viewed Movies
                </h3>
                <p className="text-xs text-dark-muted">Top 5 highest performing streams sorted by views ({timeframeLabels[timeframe]})</p>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-green-950/40 text-green-400 border border-green-500/20 flex items-center gap-1">
                <TrendingUp size={10} /> Optimal
              </span>
            </div>

            <div className="space-y-4">
              {topMovies.map((movie, index) => (
                <div key={movie.id} className="relative group p-3 rounded-xl border border-dark-border hover:bg-[#121216]/50 transition-all duration-300">
                  <div className="flex items-center gap-4 relative z-10">
                    {/* Ranking Number */}
                    <span className="text-sm font-bold font-mono text-dark-muted w-4 text-center">
                      #{index + 1}
                    </span>

                    {/* Movie Thumbnail */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-dark-border bg-dark-bg">
                      <img 
                        src={movie.image} 
                        alt={movie.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/185x278?text=No+Poster";
                        }}
                      />
                    </div>

                    {/* Meta details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-brand transition-colors duration-200">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-dark-muted mt-0.5">{movie.genre}</p>
                      
                      {/* Custom performance loading percentage track */}
                      <div className="w-full bg-[#0a0a0c] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-600 to-brand h-full rounded-full transition-all duration-500"
                          style={{ width: getPercentageWidth(movie.views[timeframe], maxTopViews) }}
                        ></div>
                      </div>
                    </div>

                    {/* Views & Rating */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
                        <Eye size={12} className="text-dark-muted" />
                        <span className="font-mono">{movie.views[timeframe].toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-yellow-500 flex items-center justify-end gap-0.5 mt-1 font-semibold">
                        <Star size={10} fill="currentColor" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Least Viewed Column */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-dark-border pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  Least Viewed Movies
                </h3>
                <p className="text-xs text-dark-muted">Bottom 5 underperforming streams sorted by views ({timeframeLabels[timeframe]})</p>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/20">
                Action Req.
              </span>
            </div>

            <div className="space-y-4">
              {bottomMovies.map((movie, index) => (
                <div key={movie.id} className="relative group p-3 rounded-xl border border-dark-border hover:bg-[#121216]/50 transition-all duration-300">
                  <div className="flex items-center gap-4 relative z-10">
                    {/* Ranking Number */}
                    <span className="text-sm font-bold font-mono text-dark-muted w-4 text-center">
                      #{index + 1}
                    </span>

                    {/* Movie Thumbnail */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-dark-border bg-dark-bg">
                      <img 
                        src={movie.image} 
                        alt={movie.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/185x278?text=No+Poster";
                        }}
                      />
                    </div>

                    {/* Meta details */}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-amber-500 transition-colors duration-200">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-dark-muted mt-0.5">{movie.genre}</p>
                      
                      {/* Custom performance loading percentage track */}
                      <div className="w-full bg-[#0a0a0c] h-1.5 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: getPercentageWidth(movie.views[timeframe], maxBottomViews) }}
                        ></div>
                      </div>
                    </div>

                    {/* Views & Rating */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
                        <Eye size={12} className="text-dark-muted" />
                        <span className="font-mono">{movie.views[timeframe].toLocaleString()}</span>
                      </div>
                      <div className="text-[10px] text-red-400 flex items-center justify-end gap-0.5 mt-1 font-semibold">
                        <Star size={10} fill="currentColor" className="text-yellow-600" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
