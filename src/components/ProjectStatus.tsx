// ===========================================================================
// File: src/components/ProjectStatus.tsx (ENHANCED - Professional Profile Design)
// ===========================================================================

import React from 'react';
import { Sparkles, Shield, Star, TrendingUp, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProjectStatus: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-6 mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
        <div className="text-center py-8">
          <Shield size={48} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 font-mono">Connect wallet to access your command profile.</p>
        </div>
      </div>
    );
  }

  const { profile, rank, xp, systemStatus, createdAt } = user;
  const rankProgress = profile.rankProgressPercent || 0;
  const nextRankName = profile.nextRank || "Max Rank";

  // Calculate days since joining
  const daysSinceJoining = Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm mb-6">
      {/* Header gradient line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
      
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section - Profile Info */}
          <div className="flex-1">
            <div className="flex items-start gap-6">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 p-1">
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center relative overflow-hidden">
                    {profile.rankBadgeUrl ? (
                      <img 
                        src={profile.rankBadgeUrl} 
                        alt={`${rank} Badge`}
                        className="w-14 h-14 object-contain relative z-10"
                        onError={(e) => (e.currentTarget.src = "/assets/chevron_rank_badge.png")}
                      />
                    ) : (
                      <img 
                        src="/assets/chevron_rank_badge.png"
                        alt="Rank Badge" 
                        className="w-14 h-14 object-contain relative z-10"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 animate-pulse-slow"></div>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <Shield size={16} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                {/* Name and Title */}
                <div>
                  <h2 className="text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-green-400 mb-1">
                    {profile.commanderName || "Commander"}
                  </h2>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full font-mono text-purple-300">
                      {rank}
                    </span>
                    <span className="text-gray-400 font-mono">
                      {xp.toLocaleString()} XP
                    </span>
                    <span className="text-gray-500 font-mono flex items-center gap-1">
                      <Clock size={12} />
                      {daysSinceJoining}d active
                    </span>
                  </div>
                </div>

                {/* Rank Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-mono flex items-center gap-2">
                      <Star size={14} className="text-cyan-400" />
                      Rank Progress
                    </span>
                    <span className="text-cyan-400 font-mono">
                      {rankProgress < 100 ? `${rankProgress.toFixed(0)}% to ${nextRankName}` : `${rank} Maxed`}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 transition-all duration-1000 ease-out relative"
                        style={{ width: `${rankProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    {rankProgress > 0 && rankProgress < 100 && (
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-900 transition-all duration-1000"
                        style={{ left: `${rankProgress}%`, marginLeft: '-6px' }}
                      >
                        <div className="w-full h-full bg-cyan-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - System Status */}
          <div className="lg:w-80 lg:border-l lg:border-purple-500/20 lg:pl-6">
            <div className="space-y-4">
              {/* System Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron text-lg text-white flex items-center gap-2">
                  <Zap size={16} className="text-green-400" />
                  System Status
                </h3>
                <div className="flex items-center gap-1 text-xs font-mono text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  ONLINE
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">StarDate</div>
                  <div className="text-sm font-orbitron text-purple-400 truncate">
                    {systemStatus?.starDate || "N/A"}
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">Signal</div>
                  <div className="text-sm font-orbitron text-green-400">
                    {systemStatus?.signalStatus || "Stable"}
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">Network</div>
                  <div className="text-sm font-orbitron text-cyan-400 flex items-center gap-1">
                    <TrendingUp size={12} />
                    {systemStatus?.networkLoadPercent?.toFixed(0) || "0"}%
                  </div>
                </div>
                
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                  <div className="text-xs font-mono text-gray-400 mb-1">Anomalies</div>
                  <div className="text-sm font-orbitron text-purple-400">
                    {systemStatus?.anomaliesResolved || 0} resolved
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg p-4 border border-purple-500/20">
                <div className="text-xs font-mono text-gray-400 mb-2">COMMANDER METRICS</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-orbitron font-bold text-cyan-400">{user.alliesCount}</div>
                    <div className="text-xs font-mono text-gray-500">Allies</div>
                  </div>
                  <div>
                    <div className="text-lg font-orbitron font-bold text-purple-400">{rank}</div>
                    <div className="text-xs font-mono text-gray-500">Rank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;