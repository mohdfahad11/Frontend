
let orderTypesLocal = JSON.parse(localStorage.getItem('OrderTypesLocalStorage'))
let paymentMethodsLocal = JSON.parse(localStorage.getItem('PaymentMethodsLocalStorage'))
let orderListLocal = JSON.parse(localStorage.getItem('OrderListLocalStorage'))
let paidByCashLocal = JSON.parse(localStorage.getItem('PaidByCashLocalStorage'))
let paidByCardLocal = JSON.parse(localStorage.getItem('PaidByCardLocalStorage'))
let totalAmountLocal = JSON.parse(localStorage.getItem('TotalAmountLocalStorage'))
let orderPaymentsLocal = JSON.parse(localStorage.getItem('OrderPaymentsLocalStorage'))
let containsServiceLocal = JSON.parse(localStorage.getItem('ContainsServiceLocalStorage'))
let containsInternalProductLocal = JSON.parse(localStorage.getItem('ContainsInternalProductLocalStorage'))
let orderTotalAmountLocal = JSON.parse(localStorage.getItem('OrderTotalAmountLocalStorage'))
let pendingOrderListLocal = JSON.parse(localStorage.getItem('PendingOrderListLocalStorage'))
let staffTableLinkLocal = JSON.parse(localStorage.getItem('StaffTableLinkLocalStorage'))
let containsCoffeeLocal = JSON.parse(localStorage.getItem('ContainsCoffeeLocalStorage'))

export default function () {
  return {
    staffTableLink: staffTableLinkLocal ? staffTableLinkLocal : {},
    containsCoffee: containsCoffeeLocal ? containsCoffeeLocal : {},
    containsService: containsServiceLocal ? containsServiceLocal : {},
    containsInternalProduct: containsInternalProductLocal ? containsInternalProductLocal : {},
    orderList: orderListLocal ? orderListLocal : {},
    pendingOrderList: pendingOrderListLocal ? pendingOrderListLocal : {},
    totalAmount: totalAmountLocal ? totalAmountLocal : {},
    paidByCash: paidByCashLocal ? paidByCashLocal : {},
    paidByCard: paidByCardLocal ? paidByCardLocal : {},
    orders: [],
    totalOrders: 0,
    paymentMethods: paymentMethodsLocal ? paymentMethodsLocal : {},
    orderPayments: orderPaymentsLocal ? orderPaymentsLocal : {},
    orderTotalAmount: orderTotalAmountLocal ? orderTotalAmountLocal : {},
    orderLineItems: [],
    refundedOrders: [],
    orderTypes: orderTypesLocal ? orderTypesLocal : {},
    originalTotalAmount: totalAmountLocal ? totalAmountLocal : {}, // Amount before applying discount
    orderDiscount: {},
    orderSurchargeAmount: {},
    orderDiscountReason: {},
    orderDiscountType: {}, // 1: Generic, 2: Percentage
    orderSurchargeType: {}, // 1: Generic, 2: Percentage
    savedOrders: {}, // Only the Takeaway orders can be saved
    // The ID of one of the order in savedOrders.
    // Basically this is to keep track of the current saved order being displayed.
    // This shall be null in case no saved order is being displayed
    // This is to handle few edge cases
    openedSavedOrderId: null,
  }
}
