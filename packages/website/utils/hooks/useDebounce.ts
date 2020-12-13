const useDebounce = <T>(
  callback: (args: T) => void,
  delay: number
): ((args: T) => void) => {
  let timer: NodeJS.Timeout;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

export default useDebounce;
