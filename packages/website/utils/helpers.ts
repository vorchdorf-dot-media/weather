export const formatNumber = (
  locale: string,
  number: number,
  options: Intl.NumberFormatOptions = {}
): string =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    ...options,
  }).format(number);
