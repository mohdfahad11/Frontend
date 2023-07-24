let coffee = JSON.parse(localStorage.getItem('CategoryCoffeeLocalStorage'))
export default function () {
  return {
    categories: [],
    services: [],
    categoryCoffee: coffee ? coffee : {}
  }
}
