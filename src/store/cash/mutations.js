export function GET_PENDING_CASH_UP_DATES (state, res) {
  state.pendingCashUpDates = [...res]
}
