const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const debounce = (
  timerKey: string,
  fn: (...args: any[]) => void,
  delay: number,
) => {
  return (...args: any[]) => {
    if (debounceTimers.has(timerKey)) {
      clearTimeout(debounceTimers.get(timerKey));
    }

    const timer = setTimeout(() => {
      fn(...args);
      debounceTimers.delete(timerKey);
    }, delay);

    debounceTimers.set(timerKey, timer);
  };
};
