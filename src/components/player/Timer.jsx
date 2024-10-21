import React, { useState, useEffect } from "react";
import { useStore } from "./store/store";

function TimerComponent() {
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const { addLap, lapCount, laps, setPB, PB, lapCountp } = useStore();

  useEffect(() => {
    let animationFrameId;

    const updateTimer = () => {
      const now = Date.now();
      if (startTime) {
        const elapsed = now - startTime;
        setTime(elapsed);
      }
      animationFrameId = requestAnimationFrame(updateTimer);
    };

    const startTimer = () => {
      setStartTime(Date.now());
      animationFrameId = requestAnimationFrame(updateTimer);
    };

    startTimer();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [startTime]);

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;

  useEffect(() => {
    if (lapCount > 0) {
      const lapTime = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}:${
        milliseconds < 100
          ? milliseconds < 10
            ? "00" + milliseconds
            : "0" + milliseconds
          : milliseconds
      }`;
      addLap({ lapNumber: lapCount, time: time, lapTime: lapTime });
      if (!PB || time < PB.time) {
        setPB({ time: time, lapTime: lapTime });
      }
      setTime(0);
      setStartTime(Date.now());
    }
  }, [lapCount]);

  return (
    <div className="timer">
      <p>
        {minutes}:{seconds < 10 ? "0" + seconds : seconds}:
        {milliseconds < 100
          ? milliseconds < 10
            ? "00" + milliseconds
            : "0" + milliseconds
          : milliseconds}
      </p>
    </div>
  );
}

export default TimerComponent;
