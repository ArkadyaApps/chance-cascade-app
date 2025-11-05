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
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <div className="flex gap-1 text-sm font-mono">
          {timeRemaining.days > 0 && (
            <span className="font-semibold">{timeRemaining.days}d</span>
          )}
          <span className="font-semibold">{String(timeRemaining.hours).padStart(2, '0')}h</span>
          <span className="font-semibold">{String(timeRemaining.minutes).padStart(2, '0')}m</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
      <Clock className="w-5 h-5 text-primary animate-pulse" />
      <div className="flex gap-2">
        {timeRemaining.days > 0 && (
          <TimeUnit value={timeRemaining.days} label="d" />
        )}
        <TimeUnit value={timeRemaining.hours} label="h" />
        <TimeUnit value={timeRemaining.minutes} label="m" />
        <TimeUnit value={timeRemaining.seconds} label="s" animate />
      </div>
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
  animate?: boolean;
}

const TimeUnit = ({ value, label, animate = false }: TimeUnitProps) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`
          bg-background rounded-md px-2 py-1 min-w-[2.5rem] 
          flex items-center justify-center border border-primary/20
          ${animate ? 'animate-scale-in' : ''}
        `}
      >
        <span className="text-lg font-bold font-mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1 font-medium">{label}</span>
    </div>
  );
};
