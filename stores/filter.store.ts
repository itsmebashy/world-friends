import { create } from 'zustand'

export interface FilterState {
  // Filter values
  selectedCountry: string | null
  selectedLanguageSpoken: string | null
  selectedLanguageLearning: string | null
  
  // UI state
  isFilterSheetOpen: boolean
  
  // Actions
  setSelectedCountry: (country: string | null) => void
  setSelectedLanguageSpoken: (language: string | null) => void
  setSelectedLanguageLearning: (language: string | null) => void
  setFilterSheetOpen: (isOpen: boolean) => void
  resetFilters: () => void
  hasActiveFilters: () => boolean
  getSelectedFilters: () => {
    country: string | null
    languageSpoken: string | null
    languageLearning: string | null
  }
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  selectedCountry: null,
  selectedLanguageSpoken: null,
  selectedLanguageLearning: null,
  isFilterSheetOpen: false,

  // Actions
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  
  setSelectedLanguageSpoken: (language) => set({ selectedLanguageSpoken: language }),
  
  setSelectedLanguageLearning: (language) => set({ selectedLanguageLearning: language }),
  
  setFilterSheetOpen: (isOpen) => set({ isFilterSheetOpen: isOpen }),
  
  resetFilters: () => set({
    selectedCountry: null,
    selectedLanguageSpoken: null,
    selectedLanguageLearning: null,
  }),
  
  hasActiveFilters: () => {
    const state = get()
    return !!(state.selectedCountry || state.selectedLanguageSpoken || state.selectedLanguageLearning)
  },
  
  getSelectedFilters: () => {
    const state = get()
    return {
      country: state.selectedCountry,
      languageSpoken: state.selectedLanguageSpoken,
      languageLearning: state.selectedLanguageLearning,
    }
  },
}))

// Selector hooks for optimized re-renders
export const useSelectedCountry = () => useFilterStore((state) => state.selectedCountry)
export const useSelectedLanguageSpoken = () => useFilterStore((state) => state.selectedLanguageSpoken)
export const useSelectedLanguageLearning = () => useFilterStore((state) => state.selectedLanguageLearning)
export const useIsFilterSheetOpen = () => useFilterStore((state) => state.isFilterSheetOpen)
export const useHasActiveFilters = () => useFilterStore((state) => state.hasActiveFilters())

// Action hooks
export const useFilterActions = () => ({
  setSelectedCountry: useFilterStore.getState().setSelectedCountry,
  setSelectedLanguageSpoken: useFilterStore.getState().setSelectedLanguageSpoken,
  setSelectedLanguageLearning: useFilterStore.getState().setSelectedLanguageLearning,
  setFilterSheetOpen: useFilterStore.getState().setFilterSheetOpen,
  resetFilters: useFilterStore.getState().resetFilters,
  getSelectedFilters: useFilterStore.getState().getSelectedFilters,
})
