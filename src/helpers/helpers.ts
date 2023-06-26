export const getFormattedPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getFormattedPercentage = (percentage: number): string => {
  const formattedPercentage = percentage.toFixed(2);

  return `${formattedPercentage}%`;
};
