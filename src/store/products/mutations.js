export function GET_PRODUCTS (state, data) {
  state.products = [...data]
}

export function GET_RESTAURANT_PRODUCTS (state, data) {
  state.restaurantProducts = [...data.data]
}

export function GET_RESTAURANT_PRODUCT_MODIFIERS (state, data) {
  state.restaurantProductModifiers = [...data]
}
