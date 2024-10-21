import { formatNumberLocale } from 'src/locales';

import { CURRENCY_SYMBOL_KEY } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const DEFAULT_LOCALE = { code: 'en-SA', currency: 'SAR' };

const getLocal = () => {};

function processInput(inputValue) {
  if (inputValue == null || Number.isNaN(inputValue)) return null;
  return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm;
}

// ----------------------------------------------------------------------

// export function fCurrency(inputValue, options) {
//   const locale = formatNumberLocale() || DEFAULT_LOCALE;

//   const number = processInput(inputValue);
//   if (number === null) return '';

//   const fm = new Intl.NumberFormat(locale.code, {
//     style: 'currency',
//     currency: locale.currency,
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//     ...options,
//   }).format(number);

//   return fm;
// }

export function fCurrency(inputValue, options) {
  const currencySymbol = localStorage.getItem(CURRENCY_SYMBOL_KEY);
  if (currencySymbol) {
    DEFAULT_LOCALE.currency = currencySymbol;
  }
  const locale = DEFAULT_LOCALE;
  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'decimal',
    // currency: locale.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return `${fm} ${DEFAULT_LOCALE.currency}`;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(number / 100);

  return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(inputValue, options) {
  const locale = formatNumberLocale() || DEFAULT_LOCALE;

  const number = processInput(inputValue);
  if (number === null) return '';

  const fm = new Intl.NumberFormat(locale.code, {
    notation: 'compact',
    maximumFractionDigits: 2,
    ...options,
  }).format(number);

  return fm.replace(/[A-Z]/g, (match) => match.toLowerCase());
}

// ----------------------------------------------------------------------

export function fData(inputValue) {
  const number = processInput(inputValue);
  if (number === null || number === 0) return '0 bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
  const decimal = 2;
  const baseValue = 1024;

  const index = Math.floor(Math.log(number) / Math.log(baseValue));
  const fm = `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

  return fm;
}
