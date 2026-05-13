export const calculateTotalPrice = (startDate, endDate, dailyPrice) => {
  if (!startDate || !endDate || !dailyPrice) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  
  const diffDays = diffTime >= 0 ? Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) : 0;
  
  return diffDays * dailyPrice;
};