import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownTimer = ({ targetDate, compact = false }: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining(targetDate));

  function calculateTimeRemaining(target: string): TimeRemaining {
    const now = new Date().getTime();
    const targetTime = new Date(target).getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isExpired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Check if time is urgent (less than 24 hours)
  const totalHoursRemaining = timeRemaining.days * 24 + timeRemaining.hours;
  const isUrgent = totalHoursRemaining < 24 && !timeRemaining.isExpired;
  const isCritical = totalHoursRemaining < 1 && !timeRemaining.isExpired;

  if (timeRemaining.isExpired) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Draw ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${isUrgent ? 'animate-pulse' : ''}`}>
        <Clock className={`w-4 h-4 ${isUrgent ? (isCritical ? 'text-destructive' : 'text-orange-500') : 'text-primary'}`} />
        <div className={`flex gap-1 text-sm font-mono ${isUrgent ? (isCritical ? 'text-destructive' : 'text-orange-500') : ''}`}>
          {timeRemaining.days > 0 && (
            <span className="font-semibold">{timeRemaining.days}d</span>
          )}
          <span className="font-semibold">{String(timeRemaining.hours).padStart(2, '0')}h</span>
          <span className="font-semibold">{String(timeRemaining.minutes).padStart(2, '0')}m</span>
        </div>
        {isUrgent && (
          <span className={`text-xs font-semibold ${isCritical ? 'text-destructive' : 'text-orange-500'}`}>
            {isCritical ? 'ENDING SOON!' : 'Hurry!'}
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`
        flex items-center gap-3 rounded-lg p-3 border relative overflow-hidden
        ${isUrgent 
          ? isCritical
            ? 'bg-gradient-to-r from-destructive/20 to-destructive/30 border-destructive/40 shadow-lg shadow-destructive/20 animate-pulse'
            : 'bg-gradient-to-r from-orange-500/20 to-orange-500/30 border-orange-500/40 shadow-lg shadow-orange-500/20'
          : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20'
        }
      `}
    >
      {isUrgent && (
        <div className={`absolute inset-0 ${isCritical ? 'bg-destructive/5' : 'bg-orange-500/5'} animate-pulse`} />
      )}
      <Clock 
        className={`
          w-5 h-5 relative z-10
          ${isUrgent 
            ? isCritical 
              ? 'text-destructive animate-[pulse_0.5s_ease-in-out_infinite]' 
              : 'text-orange-500 animate-pulse'
            : 'text-primary animate-pulse'
          }
        `} 
      />
      <div className="flex gap-2 relative z-10">
        {timeRemaining.days > 0 && (
          <TimeUnit value={timeRemaining.days} label="d" isUrgent={isUrgent} isCritical={isCritical} />
        )}
        <TimeUnit value={timeRemaining.hours} label="h" isUrgent={isUrgent} isCritical={isCritical} />
        <TimeUnit value={timeRemaining.minutes} label="m" isUrgent={isUrgent} isCritical={isCritical} />
        <TimeUnit value={timeRemaining.seconds} label="s" animate isUrgent={isUrgent} isCritical={isCritical} />
      </div>
      {isUrgent && (
        <div className="relative z-10 ml-auto">
          <span className={`text-xs font-bold uppercase tracking-wider ${isCritical ? 'text-destructive' : 'text-orange-500'}`}>
            {isCritical ? '🔥 ENDING NOW!' : '⚡ Hurry!'}
          </span>
        </div>
      )}
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
  animate?: boolean;
  isUrgent?: boolean;
  isCritical?: boolean;
}

const TimeUnit = ({ value, label, animate = false, isUrgent = false, isCritical = false }: TimeUnitProps) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`
          bg-background rounded-md px-2 py-1 min-w-[2.5rem] 
          flex items-center justify-center border
          ${isUrgent 
            ? isCritical 
              ? 'border-destructive/40 shadow-md shadow-destructive/20' 
              : 'border-orange-500/40 shadow-md shadow-orange-500/20'
            : 'border-primary/20'
          }
          ${animate ? 'animate-scale-in' : ''}
        `}
      >
        <span 
          className={`
            text-lg font-bold font-mono tabular-nums
            ${isUrgent ? (isCritical ? 'text-destructive' : 'text-orange-500') : ''}
          `}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span 
        className={`
          text-xs mt-1 font-medium
          ${isUrgent ? (isCritical ? 'text-destructive' : 'text-orange-500') : 'text-muted-foreground'}
        `}
      >
        {label}
      </span>
    </div>
  );
};
