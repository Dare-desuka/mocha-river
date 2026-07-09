// Catppuccin Mocha palette (Mocha Velvet design system)
export const COLORS = {
  surface: '#111318',
  surfaceDim: '#111318',
  surfaceBright: '#37393e',
  surfaceLowest: '#0c0e12',
  surfaceLow: '#1a1c20',
  surfaceContainer: '#1e2024',
  surfaceHigh: '#282a2e',
  surfaceHighest: '#333539',
  onSurface: '#e2e2e8',
  onSurfaceVariant: '#c3c6d2',
  outline: '#8d919b',
  outlineVariant: '#424750',

  primary: '#b5cfff',
  onPrimary: '#003062',
  primaryContainer: '#89b4fa',
  onPrimaryContainer: '#094583',

  secondary: '#bac3ff',
  onSecondary: '#212c62',
  secondaryContainer: '#3b457c',
  onSecondaryContainer: '#abb5f4',

  tertiary: '#a1dd9c',
  onTertiary: '#00390c',
  tertiaryContainer: '#86c182',
  onTertiaryContainer: '#174f1e',

  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Mocha-specific
  mochaRed: '#f38ba8',
  mochaPeach: '#fab387',
  mochaGreen: '#a6e3a1',
  mochaTeal: '#94e2d5',
  mochaLavender: '#cba6f7',

  // Card
  cardBackground: '#cdd6f4',
  cardRed: '#f38ba8',
  cardBlack: '#11111b',

  // Table
  tableBg1: '#313244',
  tableBg2: '#1e1e2e',
  tableBg3: '#11111b',
  tableBorder: '#181825',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Glass
  glassBg: 'rgba(17, 19, 24, 0.7)',
  glassBorder: 'rgba(137, 180, 250, 0.3)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

};

export const BORDER_RADIUS = {
  sm: 4,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FONT_FAMILY = 'Montserrat';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '600' | '700';
  lineHeight: number;
  letterSpacing?: number;
}

export const TYPOGRAPHY: Record<string, TextStyle> = {
  headlineSm: { fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: '600', lineHeight: 28 },
  bodySm: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '400', lineHeight: 20 },
  labelLg: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 1 },
  labelMd: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600', lineHeight: 16, letterSpacing: 1 },
  headlineLgMobile: { fontFamily: FONT_FAMILY, fontSize: 28, fontWeight: '700', lineHeight: 36 },
};

export const TABLE_THEMES = [
  { id: 'classic', bg: '#242437', border: '#171827', felt: '#313244', label: '10/20' },
  { id: 'royal', bg: '#1a2744', border: '#0f1a33', felt: '#243357', label: '15/30' },
  { id: 'midnight', bg: '#241835', border: '#1a1128', felt: '#302244', label: '25/50' },
  { id: 'crimson', bg: '#2e1414', border: '#210e0e', felt: '#3b1a1a', label: '50/100' },
  { id: 'emerald', bg: '#14281e', border: '#0d1d15', felt: '#1a3327', label: '100/200' },
];
