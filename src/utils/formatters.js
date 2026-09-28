/**
 * Formats a numeric value into a USD currency string.
 * @param {number|string} amount 
 * @returns {string} Formatted currency e.g. "$129.99"
 */
export function formatCurrency(amount) {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Formats a rating number to 1 decimal place.
 * @param {number|string} rating 
 * @returns {string} Formatted rating e.g. "4.5"
 */
export function formatRating(rating) {
  const numericRating = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  return numericRating.toFixed(1);
}

/**
 * Capitalizes category or text strings.
 * @param {string} str 
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns Tailwind class names and label for stock status badges.
 * @param {number|string} stock 
 * @returns {{ label: string, className: string }}
 */
export function getStockStatus(stock) {
  const count = typeof stock === 'number' ? stock : parseInt(stock, 10) || 0;
  if (count <= 0) {
    return {
      label: 'Out of Stock',
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
    };
  }
  if (count <= 10) {
    return {
      label: `Low Stock (${count})`,
      className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
    };
  }
  return {
    label: `In Stock (${count})`,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
  };
}
