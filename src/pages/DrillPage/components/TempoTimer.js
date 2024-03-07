import React, { useEffect } from 'react';
import './TempoTimer.css';

function TempoTimer({ isTiming, resetTimer, setResetTimer, currentTime, setCurrentTime }) {
  useEffect(() => {
    if (resetTimer) {
      setCurrentTime(0); // Reset currentTempo in TempoPage
      setResetTimer(false);
    }
  }, [resetTimer, setResetTimer, setCurrentTime]);

  useEffect(() => {
    let interval = null;

    if (isTiming) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 0.01);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTiming, setCurrentTime]);

  const formatTime = (timeValue) => {
    return timeValue.toFixed(2);
  };

  return (
    <div className="TempoTimer">
      {formatTime(currentTime)}
    </div>
  );
}

export default TempoTimer;