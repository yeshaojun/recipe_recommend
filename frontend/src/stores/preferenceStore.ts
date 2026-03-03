import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserPreference } from '@/types'

interface PreferenceState {
  preference: UserPreference | null
  setPreference: (preference: UserPreference) => void
  updateDietaryGoals: (goals: string[]) => void
  updateDietaryRestrictions: (restrictions: string[]) => void
  updateFavoriteCuisines: (cuisines: string[]) => void
  updateDislikedIngredients: (ingredients: string[]) => void
  updateSpiceLevel: (level: UserPreference['spiceLevel']) => void
  updateTargets: (calories?: number, protein?: number) => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      preference: null,

      setPreference: (preference) => set({ preference }),

      updateDietaryGoals: (goals) =>
        set((state) => ({
          preference: state.preference
            ? { ...state.preference, dietaryGoals: goals }
            : null
        })),

      updateDietaryRestrictions: (restrictions) =>
        set((state) => ({
          preference: state.preference
            ? { ...state.preference, dietaryRestrictions: restrictions }
            : null
        })),

      updateFavoriteCuisines: (cuisines) =>
        set((state) => ({
          preference: state.preference
            ? { ...state.preference, favoriteCuisines: cuisines }
            : null
        })),

      updateDislikedIngredients: (ingredients) =>
        set((state) => ({
          preference: state.preference
            ? { ...state.preference, dislikedIngredients: ingredients }
            : null
        })),

      updateSpiceLevel: (level) =>
        set((state) => ({
          preference: state.preference
            ? { ...state.preference, spiceLevel: level }
            : null
        })),

      updateTargets: (calories, protein) =>
        set((state) => ({
          preference: state.preference
            ? {
                ...state.preference,
                targetCalories: calories,
                targetProtein: protein
              }
            : null
        }))
    }),
    {
      name: 'preference-storage'
    }
  )
)