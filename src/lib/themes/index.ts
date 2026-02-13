export interface Theme {
  id: string
  name: string
  logo?: string
  logoAlt?: string
  /** Icon letter shown in sidebar when no logo or collapsed */
  logoIcon?: string
  favicon?: string
  appName: string
  tagline?: string
  colors: {
    primary: string
    primaryHover: string
    primaryForeground: string
    primaryDim: string
    secondary: string
    secondaryHover: string
    secondaryForeground: string
    accent: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    card: string
    cardForeground: string
    border: string
    borderBright: string
    sidebar: string
    sidebarForeground: string
    sidebarTertiary: string
    hover: string
    success: string
    successDim: string
    warning: string
    warningDim: string
    destructive: string
    destructiveDim: string
    info: string
    infoDim: string
    textDim: string
    /** Input field background */
    input?: string
    /** Input field border */
    inputBorder?: string
    /** Input field focus border */
    inputFocus?: string
    /** Section header accent (e.g. underline color) */
    sectionAccent?: string
    /** Info box background */
    infoBg?: string
  }
  /** Optional card box-shadow (e.g. for light themes where cards float on the background) */
  cardShadow?: string
  fonts: {
    heading: string
    body: string
    mono: string
    nav: string
  }
  borderRadius: string
  style: 'modern' | 'corporate' | 'minimal' | 'bold'
}

export const debriefedTheme: Theme = {
  id: 'debriefed',
  name: 'Debriefed',
  logoIcon: 'D',
  appName: 'Debriefed',
  tagline: 'MISSION: TRANSITION',
  colors: {
    primary: '#d4a84b',
    primaryHover: '#e4bc5e',
    primaryForeground: '#0a0c0f',
    primaryDim: 'rgba(212, 168, 75, 0.12)',
    secondary: '#1a365d',
    secondaryHover: '#2c5282',
    secondaryForeground: '#e8eaed',
    accent: '#d4a84b',
    background: '#0a0c0f',
    foreground: '#e8eaed',
    muted: '#0f1218',
    mutedForeground: '#8b919e',
    card: '#1a1f2a',
    cardForeground: '#e8eaed',
    border: '#2a3040',
    borderBright: '#3d4760',
    sidebar: '#0f1218',
    sidebarForeground: '#e8eaed',
    sidebarTertiary: '#161a22',
    hover: '#232a38',
    success: '#22c55e',
    successDim: 'rgba(34, 197, 94, 0.12)',
    warning: '#f59e0b',
    warningDim: 'rgba(245, 158, 11, 0.12)',
    destructive: '#ef4444',
    destructiveDim: 'rgba(239, 68, 68, 0.12)',
    info: '#3b82f6',
    infoDim: 'rgba(59, 130, 246, 0.12)',
    textDim: '#5a6070',
  },
  fonts: {
    heading: "'Rajdhani', sans-serif",
    body: "'Inter', -apple-system, sans-serif",
    mono: "'JetBrains Mono', monospace",
    nav: "'Rajdhani', sans-serif",
  },
  borderRadius: '0.375rem',
  style: 'modern',
}

export const fiveAndFlyTheme: Theme = {
  id: 'five-and-fly',
  name: 'Five & Fly',
  logo: '/themes/five-and-fly/logo.svg',
  logoAlt: 'Five & Fly',
  logoIcon: 'F',
  appName: 'Five & Fly Resume Builder',
  tagline: 'Mission-Driven Career Transitions',
  colors: {
    primary: '#D4952B',
    primaryHover: '#C08526',
    primaryForeground: '#FFFFFF',
    primaryDim: 'rgba(212, 149, 43, 0.12)',
    secondary: '#2D3748',
    secondaryHover: '#1A202C',
    secondaryForeground: '#FFFFFF',
    accent: '#D4952B',
    background: '#EDEBE6',
    foreground: '#2D3748',
    muted: '#F0EDE7',
    mutedForeground: '#4A5568',
    card: '#F7F6F3',
    cardForeground: '#2D3748',
    border: '#D6D3CC',
    borderBright: '#D6D3CC',
    sidebar: '#2D3748',
    sidebarForeground: '#E2E8F0',
    sidebarTertiary: '#374151',
    hover: '#F0EDE7',
    success: '#38A169',
    successDim: 'rgba(56, 161, 105, 0.1)',
    warning: '#D4952B',
    warningDim: 'rgba(212, 149, 43, 0.1)',
    destructive: '#E53E3E',
    destructiveDim: 'rgba(229, 62, 62, 0.1)',
    info: '#3182CE',
    infoDim: 'rgba(49, 130, 206, 0.1)',
    textDim: '#9CA3AF',
    input: '#FFFFFF',
    inputBorder: '#D6D3CC',
    inputFocus: '#D4952B',
    sectionAccent: '#D4952B',
    infoBg: '#F0EDE7',
  },
  cardShadow: '0 1px 3px rgba(0,0,0,0.05)',
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
    mono: "'JetBrains Mono', monospace",
    nav: "'Rajdhani', sans-serif",
  },
  borderRadius: '0.5rem',
  style: 'corporate',
}

export const themes: Theme[] = [debriefedTheme, fiveAndFlyTheme]

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) || debriefedTheme
}

/** Convert a theme to CSS custom properties */
export function themeToCssVars(theme: Theme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-primary-foreground': theme.colors.primaryForeground,
    '--color-primary-dim': theme.colors.primaryDim,
    '--color-secondary': theme.colors.secondary,
    '--color-secondary-hover': theme.colors.secondaryHover,
    '--color-secondary-foreground': theme.colors.secondaryForeground,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-foreground': theme.colors.foreground,
    '--color-muted': theme.colors.muted,
    '--color-muted-foreground': theme.colors.mutedForeground,
    '--color-card': theme.colors.card,
    '--color-card-foreground': theme.colors.cardForeground,
    '--color-border': theme.colors.border,
    '--color-border-bright': theme.colors.borderBright,
    '--color-sidebar': theme.colors.sidebar,
    '--color-sidebar-foreground': theme.colors.sidebarForeground,
    '--color-sidebar-tertiary': theme.colors.sidebarTertiary,
    '--color-hover': theme.colors.hover,
    '--color-success': theme.colors.success,
    '--color-success-dim': theme.colors.successDim,
    '--color-warning': theme.colors.warning,
    '--color-warning-dim': theme.colors.warningDim,
    '--color-destructive': theme.colors.destructive,
    '--color-destructive-dim': theme.colors.destructiveDim,
    '--color-info': theme.colors.info,
    '--color-info-dim': theme.colors.infoDim,
    '--color-text-dim': theme.colors.textDim,
    '--color-input': theme.colors.input || theme.colors.muted,
    '--color-input-border': theme.colors.inputBorder || theme.colors.border,
    '--color-input-focus': theme.colors.inputFocus || theme.colors.primary,
    '--color-section-accent': theme.colors.sectionAccent || theme.colors.primary,
    '--color-info-bg': theme.colors.infoBg || theme.colors.muted,
    '--card-shadow': theme.cardShadow || 'none',
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--font-mono': theme.fonts.mono,
    '--font-nav': theme.fonts.nav,
    '--radius': theme.borderRadius,
  }
}
