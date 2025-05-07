
import { useCallback } from "react";
import confetti from "canvas-confetti";

export const useCornerFireworks = () => {
  const fire = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Fire from bottom-left
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 }
      });

      // Fire from bottom-right
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 }
      });
    }, 250);
  }, []);

  return fire;
};
