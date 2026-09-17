import React, { useState } from 'react';
import { Users, Eye, Info } from 'lucide-react';

export default function TrafficChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // SVG dimensions
  const width = 600;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value calculation for scaling
  const maxVal = 20000;

  // Map values to pixel coordinates
  const getX = (index) => paddingLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val) => height - paddingBottom - (val / maxVal) * chartHeight;

  // Build path strings
  let regPoints = data.map((d, i) => `${getX(i)},${getY(d.registered)}`).join(' ');
  let guestPoints = data.map((d, i) => `${getX(i)},${getY(d.guest)}`).join(' ');

  // Create smooth curves using Bezier control points (simple linear interpolation here looks clean too, let's use standard line path)
  const regPath = `M ${data.map((d, i) => `${getX(i)} ${getY(d.registered)}`).join(' L ')}`;
  const guestPath = `M ${data.map((d, i) => `${getX(i)} ${getY(d.guest)}`).join(' L ')}`;

  // Paths for filled area gradients underneath lines
  const regAreaPath = `${regPath} L ${getX(data.length - 1)} ${height - paddingBottom} L ${getX(0)} ${height - paddingBottom} Z`;
  const guestAreaPath = `${guestPath} L ${getX(data.length - 1)} ${height - paddingBottom} L ${getX(0)} ${height - paddingBottom} Z`;

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">Weekly Traffic Trend</h4>
          <p className="text-xs text-dark-muted">Comparing page views from registered members vs anonymous guests</p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand"></span>
            <span className="text-gray-300">Registered ({data.reduce((sum, d) => sum + d.registered, 0).toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="text-gray-300">Guests ({data.reduce((sum, d) => sum + d.guest, 0).toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* SVG Responsive Wrapper */}
      <div className="relative w-full flex-grow overflow-x-auto select-none">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full min-w-[500px] h-auto overflow-visible"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e50914" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e50914" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="guestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 5000, 10000, 15000, 20000].map((gridVal) => {
            const y = getY(gridVal);
            return (
              <g key={gridVal} className="opacity-20">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#4b5563" 
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  fill="#9ca3af" 
                  fontSize="9" 
                  textAnchor="end"
                  className="font-mono font-medium"
                >
                  {gridVal / 1000}k
                </text>
              </g>
            );
          })}

          {/* Filled area gradients */}
          <path d={guestAreaPath} fill="url(#guestGrad)" />
          <path d={regAreaPath} fill="url(#regGrad)" />

          {/* Lines */}
          <path 
            d={guestPath} 
            fill="none" 
            stroke="#22d3ee" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path 
            d={regPath} 
            fill="none" 
            stroke="#e50914" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis Labels */}
          {data.map((d, i) => (
            <text
              key={d.day}
              x={getX(i)}
              y={height - 10}
              fill="#9ca3af"
              fontSize="10"
              textAnchor="middle"
              className="font-medium"
            >
              {d.day}
            </text>
          ))}

          {/* Dynamic interaction overlays */}
          {data.map((d, i) => {
            const x = getX(i);
            const yReg = getY(d.registered);
            const yGuest = getY(d.guest);
            
            return (
              <g key={i}>
                {/* Vertical slider line on hover */}
                {hoveredIdx === i && (
                  <line 
                    x1={x} 
                    y1={paddingTop} 
                    x2={x} 
                    y2={height - paddingBottom} 
                    stroke="#374151" 
                    strokeWidth="1.5" 
                  />
                )}

                {/* Registered dots */}
                <circle 
                  cx={x} 
                  cy={yReg} 
                  r={hoveredIdx === i ? 6 : 4} 
                  fill="#e50914" 
                  stroke="#0a0a0c" 
                  strokeWidth="2" 
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Guest dots */}
                <circle 
                  cx={x} 
                  cy={yGuest} 
                  r={hoveredIdx === i ? 6 : 4} 
                  fill="#22d3ee" 
                  stroke="#0a0a0c" 
                  strokeWidth="2" 
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div 
            className="absolute bg-dark-panel border border-[#1f1f2e] p-2.5 rounded-lg shadow-xl text-[11px] pointer-events-none z-10 w-36 animate-fade-in"
            style={{ 
              left: `${getX(hoveredIdx) + 10}px`,
              top: '40px'
            }}
          >
            <div className="font-bold border-b border-dark-border pb-1 mb-1 text-white uppercase text-[9px] tracking-wider font-mono">
              {data[hoveredIdx].day} Traffic Detail
            </div>
            <div className="flex justify-between items-center text-cyan-400 font-semibold mb-0.5">
              <span>Guests:</span>
              <span className="font-mono">{data[hoveredIdx].guest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-brand font-semibold">
              <span>Registered:</span>
              <span className="font-mono">{data[hoveredIdx].registered.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-1.5 bg-[#121216]/40 border border-dark-border/40 p-2.5 rounded-xl text-[10px] text-dark-muted leading-relaxed">
        <Info size={14} className="text-brand flex-shrink-0" />
        <span>Hover over chart plot points to check the precise breakdown of views for specific days. Weekend traffic shows high guest viewing ratios.</span>
      </div>
    </div>
  );
}
