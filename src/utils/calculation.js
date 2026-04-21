export const calculateWearRate = (tread, mileage) => {
  return (8.5 - tread) / mileage;
};

export const adjustWearRate = (wr, uf, alpha = 0.8) => {
  return wr * (1 + alpha * uf);
};

export const calculateRULkm = (remainingTread, adjustedWR) => {
  return remainingTread / adjustedWR;
};

export const calculateRULyear = (rulKm, kmPerYear) => {
  return rulKm / kmPerYear;
};