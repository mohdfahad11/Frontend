export function customers (state) {
  let temp = [];
  temp = state.customers.map(v => {
    if(v.status == 1) {
      // state.totalCustomers++
      return v
    }
  }).filter(Boolean)
  return temp
}

export function customerDetails (state) {
  let clone
  clone = Object.assign({},state.customerDetails)
  return clone
}
