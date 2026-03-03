import { makeAutoObservable, observable } from 'mobx'
import type { Ingredient } from '@/types'

class IngredientStore {
  @observable ingredients: Ingredient[] = []
  @observable loading = false

  constructor() {
    makeAutoObservable(this)
  }

  @action
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
  }

  @action
  removeIngredient(id: string) {
    this.ingredients = this.ingredients.filter((ing) => ing.id !== id)
  }

  @action
  updateIngredient(id: string, updates: Partial<Ingredient>) {
    const index = this.ingredients.findIndex((ing) => ing.id === id)
    if (index !== -1) {
      this.ingredients[index] = { ...this.ingredients[index], ...updates }
    }
  }

  @action
  clearIngredients() {
    this.ingredients = []
  }

  @action
  setLoading(loading: boolean) {
    this.loading = loading
  }

  get sortedByDate() {
    return [...this.ingredients].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
  }

  get count() {
    return this.ingredients.length
  }
}

import { action } from 'mobx'
export default new IngredientStore()