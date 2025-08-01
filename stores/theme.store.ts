import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Theme interface definitions
export interface Theme {
  isDark: boolean
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    secondary: string
    background: string
    surface: string
    card: string
    text: string
    textSecondary: string
    textMuted: string
    border: string
    borderLight: string
    success: string
    warning: string
    error: string
    info: string
    white: string
    black: string
    overlay: string
    tabBar: string
    tabBarActive: string
    notification: string
    shadow: string
    surfaceSecondary: string
    textTertiary: string
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    xl: number
    full: number
  }
}

// Theme definitions
const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tabBar: '#FFFFFF',
    tabBarActive: '#6366F1',
    notification: '#EF4444',
    shadow: '#000000',
    surfaceSecondary: '#F1F5F9',
    textTertiary: '#64748B',
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
}

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    secondary: '#F472B6',
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    border: '#475569',
    borderLight: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tabBar: '#1E293B',
    tabBarActive: '#818CF8',
    notification: '#F87171',
    shadow: '#000000',
    surfaceSecondary: '#334155',
    textTertiary: '#64748B',
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
}

// Theme store state interface
interface ThemeState {
  // State
  isDark: boolean
  theme: Theme
  isLoading: boolean
  
  // Actions
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
  setLoading: (loading: boolean) => void
}

// Persisted state type (only what we want to persist)
interface ThemePersistedState {
  isDark: boolean
}

// Create the theme store with persistence
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      // Initial state - start with loading false to prevent UI blocking
      isDark: false,
      theme: lightTheme,
      isLoading: false,

      // Actions
      toggleTheme: () => {
        const { isDark } = get()
        const newIsDark = !isDark
        set({
          isDark: newIsDark,
          theme: newIsDark ? darkTheme : lightTheme,
        })
      },

      setTheme: (isDark: boolean) => {
        set({
          isDark,
          theme: isDark ? darkTheme : lightTheme,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),

      // Only persist the isDark boolean, not the entire theme object
      partialize: (state): ThemePersistedState => ({
        isDark: state.isDark,
      }),

      // Custom merge function to handle rehydration
      merge: (persistedState, currentState) => {
        // Handle case where persistedState might be null or undefined
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            ...currentState,
            isLoading: false,
          }
        }

        const persisted = persistedState as ThemePersistedState
        const isDarkValue = typeof persisted.isDark === 'boolean' ? persisted.isDark : false

        return {
          ...currentState,
          isDark: isDarkValue,
          theme: isDarkValue ? darkTheme : lightTheme,
          isLoading: false,
        }
      },

      // Handle rehydration events
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Theme rehydration error:', error)
          } else if (state) {
            console.log('Theme rehydrated successfully')
          }
          // No need for timeout since we start with isLoading: false
        }
      },
    }
  )
)

// Selector hooks for optimized re-renders with shallow comparison
export const useTheme = () => useThemeStore((state) => state.theme)
export const useIsDark = () => useThemeStore((state) => state.isDark)
export const useThemeLoading = () => useThemeStore((state) => state.isLoading)

// Memoized actions to prevent infinite re-renders
const themeActions = {
  toggleTheme: () => useThemeStore.getState().toggleTheme(),
  setTheme: (isDark: boolean) => useThemeStore.getState().setTheme(isDark),
}

export const useThemeActions = () => themeActions

// Export theme objects for direct access if needed
export { lightTheme, darkTheme }
