import React from 'react';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Pure Bright Base Canvas */}
      <div className="absolute inset-0 bg-[#faf9f5]" />

      {/* Radiant Golden Dawn Ambient Sheen (Top Left) */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] rounded-full opacity-60 blur-[130px] animate-float-warm"
        style={{
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.8) 0%, rgba(253, 230, 138, 0.45) 45%, rgba(245, 158, 11, 0.15) 75%, transparent 100%)'
        }}
      />

      {/* Luminous Warm Gold Sheen (Center Right) */}
      <div 
        className="absolute top-[25%] -right-[15%] w-[60vw] h-[60vw] rounded-full opacity-50 blur-[140px] animate-float-warm"
        style={{
          animationDelay: '-6s',
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.75) 0%, rgba(251, 191, 36, 0.3) 50%, rgba(217, 119, 6, 0.1) 80%, transparent 100%)'
        }}
      />

      {/* Soft Champagne Reflection (Bottom Left) */}
      <div 
        className="absolute -bottom-[10%] left-[15%] w-[55vw] h-[55vw] rounded-full opacity-45 blur-[130px] animate-float-warm"
        style={{
          animationDelay: '-12s',
          background: 'radial-gradient(circle, rgba(254, 240, 138, 0.6) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 80%)'
        }}
      />

      {/* Elegant Architectural Geometric Grain / Dot Pattern in soft gray */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#d97706 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
