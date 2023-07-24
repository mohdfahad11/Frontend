let localCurrentCustomer = JSON.parse(localStorage.getItem('CurrentCustomerLocalStorage'))
export default function () {
  return {
    customers: [],
    currentCustomer: localCurrentCustomer ? localCurrentCustomer : {},
    customerDetails: {},
    totalCustomers: 0,
    guestCustomer: {
      id: undefined,
      customer_notes: "customer notes",
      dob: "",
      email: "guest@customer.com",
      name: "Guest",
      gender: "",
      status: 1,
      is_verified: 1,
      last_name: "C",
      phone_no: "999999999",
      postcode: "9999",
    }
  }
}
