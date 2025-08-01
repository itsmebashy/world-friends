import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { useTheme, useIsDark, useThemeActions } from '@/stores/theme.store'

interface ThemeProviderProps {
  children: React.ReactNode
}

/**
 * ThemeProvider component that provides the StatusBar configuration
 * based on the current theme.
 *
 * This component handles:
 * - StatusBar style updates
 * - Immediate rendering without blocking UI
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const isDark = useIsDark()

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </>
  )
}

/**
 * Hook to get theme and theme actions
 * This is a convenience hook that combines theme data and actions
 */
export const useThemeContext = () => {
  const theme = useTheme()
  const isDark = useIsDark()
  const actions = useThemeActions()

  return {
    theme,
    isDark,
    toggleTheme: actions.toggleTheme,
    setTheme: actions.setTheme,
  }
}
