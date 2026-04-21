export const normalize = (value, min, max) => {
  if (value < min) return 0;
  if (value > max) return 1;
  return (value - min) / (max - min);
};