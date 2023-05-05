import { useState, useEffect } from 'react';

const Countdown = ({ auctionEndTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date(auctionEndTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className="countdown">
      {Object.entries(timeLeft).map(([unit, value], index) => (
        <div key={index} className="countdown-unit">
          <div className="countdown-value">{value}</div>
          <div className="countdown-label">{unit}</div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
