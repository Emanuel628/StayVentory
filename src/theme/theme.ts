export const colors = {
  paper: '#F3EEE2',
  paperRaised: '#EAE2CD',
  hairline: '#DDD6C4',

  ink: '#201F18',
  inkMuted: '#8A8368',
  inkBody: '#4A4636',

  teal: '#1F5945',
  tealOnDark: '#DCEFE7',

  ochre: '#A9791F',
  ochreOnDark: '#F7ECD3',

  rust: '#A8532F',
  rustOnDark: '#F9E4D9',

  dotEmpty: '#E0D8C2',

  buttonPrimaryText: '#EEF4EE',
} as const;

export type StatusKey = 'ready' | 'lowStock' | 'attention' | 'needsCleaning';

export const statusColor: Record<StatusKey, string> = {
  ready: colors.teal,
  lowStock: colors.ochre,
  attention: colors.rust,
  needsCleaning: colors.inkMuted,
};

export const statusLabel: Record<StatusKey, [string, string]> = {
  ready: ['VERIFIED', 'READY'],
  lowStock: ['LOW', 'STOCK'],
  attention: ['NEEDS', 'ATTN'],
  needsCleaning: ['NEEDS', 'CLEAN'],
};

export const fonts = {
  display: 'Fraunces_600SemiBold',
  bodyRegular: 'IBMPlexSans_400Regular',
  bodyMedium: 'IBMPlexSans_500Medium',
  mono: 'IBMPlexMono_500Medium',
} as const;

export const type = {
  houseName: { fontFamily: fonts.display, fontSize: 18 },
  screenGreeting: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  eyebrow: {
    fontFamily: fonts.bodyRegular,
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase' as const,
    color: colors.inkMuted,
  },
  body: { fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.ink },
  bodySmallMuted: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.inkMuted },
  noteBody: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.inkBody, lineHeight: 19.5 },
  buttonLabel: { fontFamily: fonts.bodyMedium, fontSize: 13 },
  mono: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 0.3 },
  stampLabel: { fontFamily: fonts.mono, fontSize: 9, letterSpacing: 0.25, lineHeight: 10 },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const radius = {
  control: 3,
  tile: 10,
  sheet: 22,
} as const;

export const iconTile = {
  size: 44,
  iconSize: 22,
  strokeWidth: 1.75,
} as const;

export const stamp = {
  size: 68,
  strokeWidth: 1.5,
  dashArray: '3,2',
  rotationDeg: -8,
} as const;

export const dot = {
  size: 7,
  gap: 3,
} as const;
