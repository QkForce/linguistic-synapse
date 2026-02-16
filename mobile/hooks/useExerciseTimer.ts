import { useEffect, useState } from "react";

export function useExerciseTimer(initialCount: number = 3) {
  const [countdown, setCountdown] = useState(initialCount);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown]);

  return { countdown, isReady };
}
