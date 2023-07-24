export function products (state) {
  let temp = [];
  temp = state.products.map(v => {
    if(v.status == 1) {
      // state.totalProducts++
      return v
    }
  }).filter(Boolean)
  return temp
}
