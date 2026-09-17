export const formatPrice = (price, type = 'sale') => {
  if (price === undefined || price === null) return 'PKR 0';
  const formatted = Number(price).toLocaleString('en-PK');
  return type === 'rent' ? `PKR ${formatted} / mo` : `PKR ${formatted}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
