

export function categories (state) {
  let temp = [];
  temp = state.categories.map(v => {
    if(v.status == 1) {
      return v
    }
  }).filter(Boolean)
  return temp
}

