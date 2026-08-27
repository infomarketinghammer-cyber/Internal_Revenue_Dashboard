/**
 * Formats a number in full currency format with thousands separators matching spreadsheet.
 * Example: 10000000 -> ₹10,000,000
 * Example: -1815580 -> -₹1,815,580
 */
export function formatExactINR(value: number): string {
  const isNegative = value < 0;
  const absValue = Math.round(Math.abs(value));
  const formatted = absValue.toLocaleString('en-US');
  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

/**
 * Formats a number in standard currency format.
 * Example: 9597870 -> ₹9,597,870
 */
export function formatINR(value: number): string {
  return formatExactINR(value);
}

/**
 * Formats a number into Indian Short Notation (Lakhs and Crores).
 * Example: 9597870 -> ₹95.98 L
 * Example: 11700000 -> ₹1.17 Cr
 */
export function formatINRShort(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 10000000) {
    // Crore (Cr) is 10,000,000
    const crValue = absValue / 10000000;
    return `${sign}₹${crValue.toFixed(2)} Cr`;
  } else if (absValue >= 100000) {
    // Lakh (L) is 100,000
    const lValue = absValue / 100000;
    return `${sign}₹${lValue.toFixed(2)} L`;
  } else {
    return formatExactINR(value);
  }
}

