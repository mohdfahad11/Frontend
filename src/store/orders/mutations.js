import { cloneDeep, findIndex, toLower } from "lodash"
import Vue from "vue"
import moment from "moment"
import max from 'lodash/max'

export function GET_ORDER_LINE_ITEMS(state, res) {
  state.orderLineItems = [...res]
}

export function GET_REFUNDED_ORDERS(state, res) {
  state.refundedOrders = [...res]
}

export function ASSIGN_WAITER(state, obj) {
  Vue.set(state.staffTableLink, obj.activeTableId, obj.staffDetails)
  localStorage.setItem('StaffTableLinkLocalStorage', JSON.stringify(state.staffTableLink))
}

export function CHECK_IF_CONTAINS_SERVICE(state, obj) {
  Vue.set(state.containsService, obj.activeTableId, obj.val)
  localStorage.setItem('ContainsServiceLocalStorage', JSON.stringify(state.containsService))
}

export function CHECK_IF_CONTAINS_COFFEE(state, obj) {
  Vue.set(state.containsCoffee, obj.activeTableId, obj.val)
  localStorage.setItem('ContainsCoffeeLocalStorage', JSON.stringify(state.containsCoffee))
}

export function CHECK_IF_CONTAINS_INTERNAL_PRODUCT(state, obj) {
  Vue.set(state.containsInternalProduct, obj.activeTableId, obj.val)
  localStorage.setItem('ContainsInternalProductLocalStorage', JSON.stringify(state.containsInternalProduct))
}

export function DELETE_CONTAINS_SERVICE_TAG(state, id) {
  Vue.delete(state.containsService, id)
  localStorage.setItem('ContainsServiceLocalStorage', JSON.stringify(state.containsService))
}

export function DELETE_CONTAINS_COFEE_TAG(state, id) {
  Vue.delete(state.containsCoffee, id)
  localStorage.setItem('ContainsCoffeeLocalStorage', JSON.stringify(state.containsCoffee))
}

export function DELETE_CONTAINS_INTERNAL_PRODUCT_TAG(state, id) {
  Vue.delete(state.containsInternalProduct, id)
  localStorage.setItem('ContainsInternalProductLocalStorage', JSON.stringify(state.containsInternalProduct))
}

export function ADD_NEW_LINE_ITEM(state, obj) {
  let orderDiscount = state.orderDiscount[obj.activeTableId]
  orderDiscount = orderDiscount ? parseFloat(orderDiscount) : 0;

  let orderSurcharge = state.orderSurchargeAmount[obj.activeTableId]
  orderSurcharge = orderSurcharge ? parseFloat(orderSurcharge) : 0;

  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  const removedSurchargeAmount = removeAppliedSurcharge({
    amount: obj.record.price,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const appliedDiscountedAmount = applyDiscount({
    amount: removedSurchargeAmount,
    discount: orderDiscount,
    discountType: previouslyAppliedDiscountType
  })

  if (obj.index === 0) {
    Vue.set(state.orderList, obj.activeTableId, [obj.record])
    Vue.set(state.totalAmount, obj.activeTableId, appliedDiscountedAmount)
    Vue.set(state.orderTotalAmount, obj.activeTableId, appliedDiscountedAmount)
    Vue.set(state.paidByCard, obj.activeTableId, 0)
    Vue.set(state.paidByCash, obj.activeTableId, 0)
    Vue.set(state.orderPayments, obj.activeTableId, [])
  } else {
    Vue.set(state.orderList[obj.activeTableId], obj.index, obj.record)
    Vue.set(state.totalAmount, obj.activeTableId, state.totalAmount[obj.activeTableId] + appliedDiscountedAmount)
    Vue.set(state.orderTotalAmount, obj.activeTableId, state.orderTotalAmount[obj.activeTableId] + appliedDiscountedAmount)
  }

  Vue.set(state.orderList[obj.activeTableId][obj.index], 'line_item_total', state.orderList[obj.activeTableId][obj.index].price)

  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('PaidByCashLocalStorage', JSON.stringify(state.paidByCash))
  localStorage.setItem('PaidByCardLocalStorage', JSON.stringify(state.paidByCard))
  localStorage.setItem('OrderPaymentsLocalStorage', JSON.stringify(state.orderPayments))
}

export function REMOVE_ADDED_LINE_ITEM(state, obj) {
  let orderDiscount = state.orderDiscount[obj.activeTableId]
  orderDiscount = orderDiscount ? parseFloat(orderDiscount) : 0;

  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];

  const orderIndexToRemove = findIndex(state.orderList[obj.activeTableId], (order) => order.product_id == obj.record.product_id)

  const lineItemPrice = (obj.record.price * obj.record.quantity);

  const discountedAmount = applyDiscount({
    amount: lineItemPrice,
    discount: orderDiscount,
    discountType: previouslyAppliedDiscountType
  })

  Vue.delete(state.orderList[obj.activeTableId], orderIndexToRemove)
  Vue.set(state.totalAmount, obj.activeTableId, state.totalAmount[obj.activeTableId] - discountedAmount)
  Vue.set(state.orderTotalAmount, obj.activeTableId, state.orderTotalAmount[obj.activeTableId] - discountedAmount)

  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
}

export function SET_ORDER_PAYMENTS(state, obj) {
  state.orderPayments[obj.activeTableId].push(obj.rec)
  localStorage.setItem('OrderPaymentsLocalStorage', JSON.stringify(state.orderPayments))
}

export function SET_QUANTITY(state, obj) {
  let orderDiscount = state.orderDiscount[obj.activeTableId]
  orderDiscount = orderDiscount ? parseFloat(orderDiscount) : 0;

  let orderSurcharge = state.orderSurchargeAmount[obj.activeTableId]
  orderSurcharge = orderSurcharge ? parseFloat(orderSurcharge) : 0;

  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  let lineItemPrice = state.orderList[obj.activeTableId][obj.index].line_item_total

  let removedSurchargeAmount = removeAppliedSurcharge({
    amount: lineItemPrice,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  let appliedDiscountedAmount = applyDiscount({
    amount: removedSurchargeAmount,
    discount: orderDiscount,
    discountType: previouslyAppliedDiscountType
  })

  let discountedAmount = applySurcharge({
    amount: appliedDiscountedAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  });

  state.orderList[obj.activeTableId][obj.index].quantity = obj.quantity
  Vue.set(state.totalAmount, obj.activeTableId, state.totalAmount[obj.activeTableId] - discountedAmount)
  Vue.set(state.orderTotalAmount, obj.activeTableId, state.orderTotalAmount[obj.activeTableId] - discountedAmount)

  state.orderList[obj.activeTableId][obj.index].line_item_total = state.orderList[obj.activeTableId][obj.index].price * state.orderList[obj.activeTableId][obj.index].quantity

  let newLineItemPrice = state.orderList[obj.activeTableId][obj.index].line_item_total

  let newRemovedSurchargeAmount = removeAppliedSurcharge({
    amount: newLineItemPrice,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  let newAppliedDiscountedAmount = applyDiscount({
    amount: newRemovedSurchargeAmount,
    discount: orderDiscount,
    discountType: previouslyAppliedDiscountType
  })

  let newDiscountedAmount = applySurcharge({
    amount: newAppliedDiscountedAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  });

  Vue.set(state.totalAmount, obj.activeTableId, state.totalAmount[obj.activeTableId] + newDiscountedAmount)
  Vue.set(state.orderTotalAmount, obj.activeTableId, state.orderTotalAmount[obj.activeTableId] + newDiscountedAmount)
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
}

// This is no longer being used
export function SET_PRICE(state, obj) {
  let orderDiscount = state.orderDiscount[obj.activeTableId]
  orderDiscount = orderDiscount ? parseFloat(orderDiscount) : 0;

  let orderSurcharge = state.orderSurchargeAmount[obj.activeTableId]
  orderSurcharge = orderSurcharge ? parseFloat(orderSurcharge) : 0;

  state.orderList[obj.activeTableId][obj.index].price = obj.price * 1

  let diff = state.orderList[obj.activeTableId][obj.index].quantity * obj.difference
  const discountDiff = ((diff - orderSurcharge) * (1 - (orderDiscount / 100))) + orderSurcharge

  state.orderList[obj.activeTableId][obj.index].line_item_total = state.orderList[obj.activeTableId][obj.index].line_item_total + diff
  Vue.set(state.totalAmount, obj.activeTableId, state.totalAmount[obj.activeTableId] + discountDiff)
  Vue.set(state.orderTotalAmount, obj.activeTableId, state.orderTotalAmount[obj.activeTableId] + discountDiff)
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
}

export function SET_EMPLOYEE(state, obj) {
  state.orderList[obj.activeTableId][obj.index].employee = obj.storeUser.first_name
  state.orderList[obj.activeTableId][obj.index].service_by_user_id = obj.storeUser.id
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
}

export function DELETE_PAID_ORDER(state, obj) {

  Vue.delete(state.orderList, obj.activeTableId)
  Vue.delete(state.totalAmount, obj.activeTableId)
  Vue.delete(state.orderTotalAmount, obj.activeTableId)
  Vue.delete(state.containsService, obj.activeTableId)
  Vue.delete(state.containsCoffee, obj.activeTableId)
  Vue.delete(state.containsInternalProduct, obj.activeTableId)
  Vue.delete(state.orderPayments, obj.activeTableId)
  Vue.delete(state.orderDiscount, obj.activeTableId)
  Vue.delete(state.orderSurchargeAmount, obj.activeTableId)
  Vue.delete(this.state.customers, obj.activeTableId)
  Vue.delete(state.orderDiscountReason, obj.activeTableId)

  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('OrderPaymentsLocalStorage', JSON.stringify(state.orderPayments))

  localStorage.setItem('CurrentCustomerLocalStorage', JSON.stringify(this.state.customers))
  localStorage.setItem('AppliedOrderDiscountLocalStorage', JSON.stringify(state.orderDiscount))
  localStorage.setItem('AppliedSurchargeAmountLocalStorage', JSON.stringify(state.orderSurchargeAmount))
}

export function DEDUCT_PAID_AMOUNT(state, obj) {
  let total = parseFloat(state.totalAmount[obj.activeTableId] - obj.amount).toFixed(2)
  Vue.set(state.totalAmount, obj.activeTableId, parseFloat(total))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
}

export function MAKE_VOID(state, obj) {
  let total = parseFloat(state.totalAmount[obj.activeTableId] - state.orderList[obj.activeTableId][obj.index].line_item_total).toFixed(2)
  let orderTotal = parseFloat(state.orderTotalAmount[obj.activeTableId] - state.orderList[obj.activeTableId][obj.index].line_item_total).toFixed(2)
  Vue.set(state.totalAmount, obj.activeTableId, parseFloat(total))
  Vue.set(state.orderTotalAmount, obj.activeTableId, parseFloat(orderTotal))
  // if(state.orderList[obj.activeTableId][obj.index].entity_type == 'service') {
  //   state.containsService[obj.activeTableId] = state.containsService[obj.activeTableId] - 1
  // }
  if (state.orderList[obj.activeTableId][obj.index].entity_type == 'product' && state.orderList[obj.activeTableId][obj.index].is_internal == 1) {
    state.containsInternalProduct[obj.activeTableId] = state.containsInternalProduct[obj.activeTableId] - 1
  }
  state.orderList[obj.activeTableId][obj.index].quantity = obj.quantity
  state.orderList[obj.activeTableId][obj.index].line_item_total = state.orderList[obj.activeTableId][obj.index].price * state.orderList[obj.activeTableId][obj.index].quantity
  // localStorage.setItem('ContainsServiceLocalStorage',JSON.stringify(state.containsService))
  localStorage.setItem('ContainsInternalProductLocalStorage', JSON.stringify(state.containsInternalProduct))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
}

export function MARK_IS_VOID(state, obj) {
  state.orderList[obj.activeTableId][obj.index].is_marked_void = 1
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
}

export function SET_ORDER_LIST(state, data) {
  state.orderList = Object.assign({}, data)
  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
}

export function CALC_PAID_BY_CARD(state, obj) {
  Vue.set(state.paidByCard, obj.activeTableId, obj.paidByCard)
  localStorage.setItem('PaidByCardLocalStorage', JSON.stringify(state.paidByCard))
}

export function CALC_PAID_BY_CASH(state, obj) {
  Vue.set(state.paidByCash, obj.activeTableId, obj.paidByCash)
  localStorage.setItem('PaidByCashLocalStorage', JSON.stringify(state.paidByCash))
}

export function DELETE_PAID_BY_CASH_INSTANCE(state, activeTableId) {
  Vue.delete(state.paidByCash, activeTableId)
  localStorage.setItem('PaidByCashLocalStorage', JSON.stringify(state.paidByCash))
}

export function DELETE_PAID_BY_CARD_INSTANCE(state, activeTableId) {
  Vue.delete(state.paidByCard, activeTableId)
  localStorage.setItem('PaidByCardLocalStorage', JSON.stringify(state.paidByCard))
}

export function GET_ORDERS(state, res) {
  state.orders = [...res]
}

export function TOTAL_ORDERS(state, total) {
  state.totalOrders = total
}

export function GET_ORDERS_APPEND(state, res) {
  state.orders.push(...res)
}

export function GET_ORDER_TYPES(state, res) {
  for (let i in res) {
    Vue.set(state.orderTypes, toLower(res[i].type), res[i])
  }
  localStorage.setItem('OrderTypesLocalStorage', JSON.stringify(state.orderTypes))
}
export function GET_PAYMENT_METHODS(state, res) {
  for (let i in res) {
    Vue.set(state.paymentMethods, res[i].method, res[i])
  }
  localStorage.setItem('PaymentMethodsLocalStorage', JSON.stringify(state.paymentMethods))
}

export function SET_PENDING_ORDERS(state, res) {
  Vue.set(state.pendingOrderList, res.created_by, res)
  localStorage.setItem('PendingOrderListLocalStorage', JSON.stringify(state.pendingOrderList))
}

export function REMOVE_ORDER_FROM_PENDING_ORDER_LIST(state, res) {
  Vue.delete(state.pendingOrderList, res.created_by)
  localStorage.setItem('PendingOrderListLocalStorage', JSON.stringify(state.pendingOrderList))
}

export function REMOVE_ASSIGNED_STAFF_TO_TABLE(state, obj) {
  Vue.delete(state.staffTableLink, obj.activeTableId)
  localStorage.setItem('StaffTableLinkLocalStorage', JSON.stringify(state.staffTableLink))
}

export function SET_ORDER_DISCOUNT(state, obj) {
  let orderDiscount = state.orderDiscount[obj.activeTableId]
  orderDiscount = orderDiscount ? parseFloat(orderDiscount) : 0;

  let orderSurcharge = state.orderSurchargeAmount[obj.activeTableId]
  orderSurcharge = orderSurcharge ? parseFloat(orderSurcharge) : 0;

  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  const totalAmount = removeAppliedSurcharge({
    amount: state.totalAmount[obj.activeTableId],
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const orderTotalAmount = removeAppliedSurcharge({
    amount: state.totalAmount[obj.activeTableId],
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const originalTotalAmount = removeAppliedDiscount({ amount: totalAmount, discount: orderDiscount, discountType: previouslyAppliedDiscountType })
  const originalOrderTotalAmount = removeAppliedDiscount({ amount: orderTotalAmount, discount: orderDiscount, discountType: previouslyAppliedDiscountType })

  const calculatedTotalAmount = applyDiscount({
    amount: originalTotalAmount,
    discount: obj.orderDiscount,
    discountType: obj.orderDiscountType
  })

  const calculatedOrderTotalAmount = applyDiscount({
    amount: originalOrderTotalAmount,
    discount: obj.orderDiscount,
    discountType: obj.orderDiscountType
  })

  Vue.set(state.totalAmount, obj.activeTableId, applySurcharge({
    amount: calculatedTotalAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType,
  }))

  Vue.set(state.orderTotalAmount, obj.activeTableId, applySurcharge({
    amount: calculatedOrderTotalAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType,
  }))

  Vue.set(state.orderDiscount, obj.activeTableId, obj.orderDiscount)
  Vue.set(state.orderDiscountType, obj.activeTableId, obj.orderDiscountType)
  Vue.set(state.orderDiscountReason, obj.activeTableId, obj.discountReason)

  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('AppliedOrderDiscountLocalStorage', JSON.stringify(state.orderDiscount))
  localStorage.setItem('AppliedOrderDiscountTypeLocalStorage', JSON.stringify(state.orderDiscountType))
}

export function REMOVE_ORDER_DISCOUNT(state, obj) {
  let orderSurcharge = state.orderSurchargeAmount[obj.activeTableId]
  orderSurcharge = orderSurcharge ? parseFloat(orderSurcharge) : 0;
  const previouslyAppliedDiscount = state.orderDiscount[obj.activeTableId];
  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  const totalAmount = removeAppliedSurcharge({
    amount: state.totalAmount[obj.activeTableId],
    surcharge: orderSurcharge, surchargeType: previouslyAppliedSurchargeAmountType
  });

  const orderTotalAmount = removeAppliedSurcharge({
    amount: state.totalAmount[obj.activeTableId],
    surcharge: orderSurcharge, surchargeType: previouslyAppliedSurchargeAmountType
  });

  const originalTotalAmount = removeAppliedDiscount({
    amount: totalAmount,
    discount: previouslyAppliedDiscount, discountType: previouslyAppliedDiscountType
  })

  const originalOrderTotalAmount = removeAppliedDiscount({
    amount: orderTotalAmount,
    discount: previouslyAppliedDiscount, discountType: previouslyAppliedDiscountType
  })

  Vue.set(state.totalAmount, obj.activeTableId, applySurcharge({
    amount: originalTotalAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  }))

  Vue.set(state.orderTotalAmount, obj.activeTableId, applySurcharge({
    amount: originalOrderTotalAmount,
    surcharge: orderSurcharge,
    surchargeType: previouslyAppliedSurchargeAmountType
  }))

  Vue.delete(state.orderDiscount, obj.activeTableId)

  Vue.delete(state.orderDiscountType, obj.activeTableId)

  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('AppliedOrderDiscountLocalStorage', JSON.stringify(state.orderDiscount))
}

export function SET_ORDER_SURCHARGE_AMOUNT(state, obj) {
  const totalAmount = state.totalAmount[obj.activeTableId];
  const orderTotalAmount = state.totalAmount[obj.activeTableId];
  const previouslyAppliedSurchargeAmount = parseFloat(state.orderSurchargeAmount[obj.activeTableId]) ? parseFloat(state.orderSurchargeAmount[obj.activeTableId]) : 0;

  const previouslyAppliedDiscountType = state.orderDiscountType[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  const removedSurchargeAmount = removeAppliedSurcharge({
    amount: totalAmount,
    surcharge: previouslyAppliedSurchargeAmount,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const newAmount = applySurcharge({
    amount: removedSurchargeAmount,
    surcharge: obj.orderSurchargeAmount,
    surchargeType: obj.orderSurchargeType
  })

  const removedSurchargeTotalAmount = removeAppliedSurcharge({
    amount: orderTotalAmount,
    surcharge: previouslyAppliedSurchargeAmount,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const newTotalAmount = applySurcharge({
    amount: removedSurchargeTotalAmount,
    surcharge: obj.orderSurchargeAmount,
    surchargeType: obj.orderSurchargeType
  })

  Vue.set(state.totalAmount, obj.activeTableId, newAmount)
  Vue.set(state.orderTotalAmount, obj.activeTableId, newTotalAmount)
  Vue.set(state.orderSurchargeAmount, obj.activeTableId, obj.orderSurchargeAmount)
  Vue.set(state.orderSurchargeType, obj.activeTableId, obj.orderSurchargeType)

  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('AppliedSurchargeAmountLocalStorage', JSON.stringify(state.orderSurchargeAmount))
  localStorage.setItem('AppliedSurchargeAmountTypeLocalStorage', JSON.stringify(state.orderSurchargeType))
}

export function REMOVE_ORDER_SURCHARGE_AMOUNT(state, obj) {
  const totalAmount = state.totalAmount[obj.activeTableId];
  const orderTotalAmount = state.totalAmount[obj.activeTableId];
  const previouslyAppliedSurchargeAmount = state.orderSurchargeAmount[obj.activeTableId];
  const previouslyAppliedSurchargeAmountType = state.orderSurchargeType[obj.activeTableId];

  const removedSurchargeAmount = removeAppliedSurcharge({
    amount: totalAmount,
    surcharge: previouslyAppliedSurchargeAmount,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  const removedSurchargeTotalAmount = removeAppliedSurcharge({
    amount: orderTotalAmount,
    surcharge: previouslyAppliedSurchargeAmount,
    surchargeType: previouslyAppliedSurchargeAmountType
  })

  Vue.set(state.totalAmount, obj.activeTableId, removedSurchargeAmount)
  Vue.set(state.orderTotalAmount, obj.activeTableId, removedSurchargeTotalAmount)
  Vue.delete(state.orderSurchargeAmount, obj.activeTableId)
  Vue.delete(state.orderSurchargeType, obj.activeTableId)

  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('AppliedSurchargeAmountLocalStorage', JSON.stringify(state.orderSurchargeAmount))
}

export function SET_ORDER_DISCOUNTS(state, orderDiscount) {
  state.orderDiscount = orderDiscount
}

export function SET_ORDER_SURCHARGE_AMOUNTS(state, orderSurchargeAmount) {
  state.orderSurchargeAmount = orderSurchargeAmount
}

export function SET_ORDER_SURCHARGE_AMOUNT_TYPES(state, orderSurchargeAmountTypes) {
  state.orderSurchargeType = orderSurchargeAmountTypes
}

export function SET_ORDER_DISCOUNT_TYPES(state, orderDiscountAmountTypes) {
  state.orderDiscountType = orderDiscountAmountTypes
}

export function SAVE_CURRENT_ORDER(state, { activeTableId }) {
  const orderIDs = Object.values((state.savedOrders)).map((savedOrder) => {
    return parseInt(savedOrder.id)
  })

  const orderId = orderIDs.length == 0 ? 1 : (max(orderIDs) + 1)

  const orderToSave = {
    id: orderId,
    containsCoffee: state.containsCoffee[activeTableId],
    containsInternalProduct: state.containsInternalProduct[activeTableId],
    orderDiscount: state.orderDiscount[activeTableId],
    orderDiscountReason: state.orderDiscountReason[activeTableId],
    orderDiscountType: state.orderDiscountType[activeTableId],
    orderList: state.orderList[activeTableId],
    orderPayments: state.orderPayments[activeTableId],
    orderSurchargeAmount: state.orderSurchargeAmount[activeTableId],
    orderSurchargeType: state.orderSurchargeType[activeTableId],
    orderTotalAmount: state.orderTotalAmount[activeTableId],
    originalTotalAmount: state.originalTotalAmount[activeTableId],
    totalAmount: state.totalAmount[activeTableId],
    currentCustomer: this.state.customers.currentCustomer[activeTableId],
    createdAt: moment().format('DD MMM - hh:mm A') // 01 Apr - 10:00 AM
  }

  if (!orderToSave.orderDiscount) {
    delete orderToSave.orderDiscountType
  }

  if (!orderToSave.orderSurchargeAmount) {
    delete orderToSave.orderSurchargeType
  }

  Vue.set(state.savedOrders, orderId, cloneDeep(orderToSave))

  localStorage.setItem('SavedOrdersLocalStorage', JSON.stringify(state.savedOrders))
}

export function OPEN_SAVED_ORDER(state, { orderIDToOpen, activeTableId }) {
  const orderToOpen = cloneDeep(state.savedOrders[orderIDToOpen])

  Vue.set(state.containsCoffee, activeTableId, orderToOpen.containsCoffee); // Done
  Vue.set(state.containsInternalProduct, activeTableId, orderToOpen.containsInternalProduct); // Done
  Vue.set(state.orderDiscount, activeTableId, orderToOpen.orderDiscount); // Done
  Vue.set(state.orderDiscountReason, activeTableId, orderToOpen.orderDiscountReason); // Not required
  if (orderToOpen.orderDiscount) {
    Vue.set(state.orderDiscountType, activeTableId, orderToOpen.orderDiscountType); // Done
  }
  Vue.set(state.orderList, activeTableId, orderToOpen.orderList); // Done
  Vue.set(state.orderPayments, activeTableId, orderToOpen.orderPayments); // Done
  Vue.set(state.orderSurchargeAmount, activeTableId, orderToOpen.orderSurchargeAmount); // Done
  if (orderToOpen.orderSurchargeAmount) {
    Vue.set(state.orderSurchargeType, activeTableId, orderToOpen.orderSurchargeType); // Done
  }
  Vue.set(state.orderTotalAmount, activeTableId, orderToOpen.orderTotalAmount); // Done
  Vue.set(state.originalTotalAmount, activeTableId, orderToOpen.originalTotalAmount); // Not required
  Vue.set(state.totalAmount, activeTableId, orderToOpen.totalAmount); // Done
  Vue.set(this.state.customers.currentCustomer, activeTableId, orderToOpen.currentCustomer) // Done

  state.openedSavedOrderId = orderIDToOpen;

  localStorage.setItem('ContainsCoffeeLocalStorage', JSON.stringify(state.containsCoffee))
  localStorage.setItem('ContainsInternalProductLocalStorage', JSON.stringify(state.containsInternalProduct))

  localStorage.setItem('AppliedOrderDiscountLocalStorage', JSON.stringify(state.orderDiscount))
  localStorage.setItem('AppliedOrderDiscountTypeLocalStorage', JSON.stringify(state.orderDiscountType))

  localStorage.setItem('AppliedSurchargeAmountLocalStorage', JSON.stringify(state.orderSurchargeAmount))
  localStorage.setItem('AppliedSurchargeAmountTypeLocalStorage', JSON.stringify(state.orderSurchargeType))

  localStorage.setItem('OrderListLocalStorage', JSON.stringify(state.orderList))
  localStorage.setItem('TotalAmountLocalStorage', JSON.stringify(state.totalAmount))
  localStorage.setItem('OrderTotalAmountLocalStorage', JSON.stringify(state.orderTotalAmount))
  localStorage.setItem('OrderPaymentsLocalStorage', JSON.stringify(state.orderPayments))
  localStorage.setItem('CurrentCustomerLocalStorage', JSON.stringify(this.state.customers.currentCustomer))
}

export function DELETE_SAVED_ORDER(state, { orderIdToDelete }) {
  const allSavedOrders = cloneDeep(state.savedOrders);

  delete allSavedOrders[orderIdToDelete]
  state.savedOrders = allSavedOrders;

  localStorage.setItem('SavedOrdersLocalStorage', JSON.stringify(state.savedOrders))
}

export function SAVE_ALL_ORDERS_FROM_LOCALSTORAGE(state, { orders }) {
  state.savedOrders = orders;
}

// Removal Type can be: 1: Generic, 2: Percentage
// quantityToRemove is an integer
const applyDiscount = ({
  amount, discount, discountType
}) => {
  if (discountType == 2) {
    const valueToRemove = (parseFloat(amount) * parseFloat(discount)) / 100;
    return parseFloat(amount) - parseFloat(valueToRemove)
  }
  return parseFloat(amount) - parseFloat(discount)
}

const applySurcharge = ({
  amount, surcharge, surchargeType
}) => {
  if (surchargeType == 2) {
    const valueToRemove = (parseFloat(amount) * parseFloat(surcharge)) / 100;
    return parseFloat(amount) + parseFloat(valueToRemove)
  }
  return parseFloat(amount) + parseFloat(surcharge)
}

const removeAppliedDiscount = ({
  amount, discount, discountType
}) => findOriginalTotal({ amount, quantityToRemove: discount, removalType: discountType })

const removeAppliedSurcharge = ({
  amount, surcharge, surchargeType
}) => {
  if (surchargeType == 2) {
    return (parseFloat(amount) * 100) / (100 + parseFloat(surcharge));
  }
  return parseFloat(amount) - parseFloat(surcharge)
}

const findOriginalTotal = ({
  amount, quantityToRemove, removalType
}) => {
  if (removalType == 2) {
    return ((parseFloat(amount) * 100) / (100 - parseFloat(quantityToRemove)))
  }
  return parseFloat(amount) + parseFloat(quantityToRemove)
}