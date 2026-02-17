import { useEffect, useState } from "react";

export function useExerciseTimer(initialCount: number | null) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (initialCount !== null && countdown === null) {
      setCountdown(initialCount);
    }
  }, [initialCount]);

  useEffect(() => {
    if (countdown === null || isReady) return;

    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsReady(true);
    }
  }, [countdown, isReady]);

  return { countdown: countdown ?? 0, isReady };
}
