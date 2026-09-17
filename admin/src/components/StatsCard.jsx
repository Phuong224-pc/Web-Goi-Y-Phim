import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function StatsCard({ title, value, icon: Icon, trend, trendDirection, trendLabel, color }) {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'down': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'info': return 'text-brand bg-brand/10 border-brand/20';
      default: return 'text-dark-muted bg-[#121216]/50 border-dark-border';
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <ArrowUpRight size={14} className="mt-0.5" />;
      case 'down': return <ArrowDownRight size={14} className="mt-0.5" />;
      default: return <Activity size={14} className="mt-0.5" />;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden group">
      {/* Glow background accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[40px] opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${
        color === 'brand' ? 'bg-brand' : 'bg-blue-500'
      }`}></div>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-dark-muted tracking-wide uppercase">{title}</span>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${
          color === 'brand' 
            ? 'bg-brand/10 border-brand/30 text-brand' 
            : 'bg-[#121216] border-dark-border text-dark-muted'
        } transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-lg border ${getTrendColor()}`}>
            {getTrendIcon()}
            {trend}
          </span>
        )}
        <span className="text-[11px] text-dark-muted font-medium">{trendLabel}</span>
      </div>
    </div>
  );
}
