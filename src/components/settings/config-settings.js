import { defaultFont } from 'src/theme/core/typography';

// ----------------------------------------------------------------------

export const STORAGE_KEY = 'app-settings';
export const ACTIVE_PAGE_KEY = 'active-page';

export const defaultSettings = {
  colorScheme: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'horizontal',
  primaryColor: 'orange',
  navColor: 'apparent',
  compactLayout: false,
  fontFamily: defaultFont,
};
