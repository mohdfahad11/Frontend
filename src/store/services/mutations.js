import { toLower } from "lodash"
import Vue from "vue"

export function GET_CATEGORIES (state,res) {
  state.categories = [...res]
}

export function GET_SERVICES (state,res) {
  state.services = [...res.data]
}

export function SET_COFFEE_CATEGORIES (state, res) {
  state.categoryCoffee = [...res]
  localStorage.setItem('CategoryCoffeeLocalStorage', JSON.stringify(state.categoryCoffee))
}
