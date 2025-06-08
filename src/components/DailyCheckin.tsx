import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, Zap, Gift, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiService';
import toast from 'react-hot-toast';

interface CheckinDay {
  date: string;
  isCheckedIn: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  dayNumber: number;
}

const DailyCheckin: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [checkinDays, setCheckinDays] = useState<CheckinDay[]>([]);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      generateCheckinCalendar();
      // You might want to fetch actual checkin data from API here
      // For now, we'll simulate some data
      setCurrentStreak(3); // Example streak
    }
  }, [isAuthenticated]);

  const generateCheckinCalendar = () => {
    const today = new Date();
    const days: CheckinDay[] = [];
    
    // Generate 7 days (current week)
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const isToday = i === 0;
      const isPast = i < 0;
      const isFuture = i > 0;
      
      // Simulate some past check-ins (you'd get this from API)
      const isCheckedIn = isPast && Math.random() > 0.3; // Random past check-ins
      
      days.push({
        date: date.toISOString().split('T')[0],
        isCheckedIn: isCheckedIn || (isToday && todayCheckedIn),
        isToday,
        isPast,
        isFuture,
        dayNumber: date.getDate()
      });
    }
    
    setCheckinDays(days);
  };

  const handleCheckin = async () => {
    if (!isAuthenticated || isCheckingIn || todayCheckedIn) return;

    setIsCheckingIn(true);
    const toastId = "daily-checkin";
    
    try {
      toast.loading("Processing daily check-in...", { id: toastId });
      
      const response = await apiClient.post('/missions/daily-checkin');
      const { message } = response.data;
      
      setTodayCheckedIn(true);
      setCurrentStreak(prev => prev + 1);
      generateCheckinCalendar(); // Refresh calendar
      
      toast.success(message || "Daily check-in successful! +10 XP", { id: toastId });
      
    } catch (error: any) {
      console.error("Error during daily check-in:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Failed to complete daily check-in.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsCheckingIn(false);
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en', { weekday: 'short' });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900/80 border border-purple-500/20 backdrop-blur-sm p-6">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400"></div>
      
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-green-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-green-400" />
            Daily Operations Log
          </h3>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full">
              <span className="text-green-400 font-mono text-sm">
                {currentStreak} day streak
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {checkinDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-mono text-gray-400 mb-2">
                  {getDayName(day.date)}
                </div>
                <div 
                  className={`relative w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    day.isToday 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : day.isCheckedIn 
                        ? 'border-green-500 bg-green-500/10' 
                        : day.isPast 
                          ? 'border-gray-600 bg-gray-800/30' 
                          : 'border-gray-700 bg-gray-800/20'
                  }`}
                >
                  <span className={`text-sm font-orbitron ${
                    day.isToday ? 'text-cyan-400' : 
                    day.isCheckedIn ? 'text-green-400' : 
                    'text-gray-400'
                  }`}>
                    {day.dayNumber}
                  </span>
                  
                  {day.isCheckedIn && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle size={16} className="text-green-400 bg-gray-900 rounded-full" />
                    </div>
                  )}
                  
                  {day.isToday && !day.isCheckedIn && (
                    <div className="absolute -top-1 -right-1">
                      <Clock size={16} className="text-cyan-400 bg-gray-900 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleCheckin}
            disabled={isCheckingIn || todayCheckedIn}
            className={`flex-1 px-6 py-3 rounded-lg font-orbitron text-sm relative group overflow-hidden transition-all duration-300 ${
              todayCheckedIn
                ? 'bg-green-900/30 border border-green-500/30 text-green-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-cyan-500/30'
            }`}
          >
            {!todayCheckedIn && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-green-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            )}
            <div className="relative flex items-center justify-center gap-2">
              {isCheckingIn ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : todayCheckedIn ? (
                <>
                  <CheckCircle size={16} />
                  <span>Today's Mission Complete</span>
                </>
              ) : (
                <>
                  <Zap size={16} className="text-cyan-400" />
                  <span>Complete Daily Mission</span>
                </>
              )}
            </div>
          </button>

          {/* Rewards Info */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <Gift size={16} className="text-purple-400" />
            <span className="text-sm font-mono text-gray-300">+10 XP</span>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-sm font-mono text-gray-400">
            {todayCheckedIn 
              ? "Mission accomplished! Return tomorrow for your next assignment." 
              : "Complete your daily mission to maintain operational readiness."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckin;