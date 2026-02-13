'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Theme, debriefedTheme, getThemeById, themeToCssVars } from '@/lib/themes'

const THEME_STORAGE_KEY = 'debriefed-theme'

interface ThemeContextValue {
  theme: Theme
  setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: debriefedTheme,
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

function applyTheme(theme: Theme) {
  const vars = themeToCssVars(theme)
  const root = document.documentElement
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const [theme, setThemeState] = useState<Theme>(debriefedTheme)

  const setTheme = useCallback((themeId: string) => {
    const newTheme = getThemeById(themeId)
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  }, [])

  useEffect(() => {
    // Priority: URL param > localStorage > default
    const urlTheme = searchParams.get('theme')
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    const themeId = urlTheme || savedTheme || 'debriefed'

    const resolved = getThemeById(themeId)
    setThemeState(resolved)
    applyTheme(resolved)

    // If URL param was used, persist it
    if (urlTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, urlTheme)
    }
  }, [searchParams])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
