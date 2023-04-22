export const getFilteredOrdersByDate = ({ startDate, endDate }, orders) => {
  return orders.filter((orderItem) => {
    const orderDateEntry = new Date(orderItem.date)

    const startDateYear = new Date(startDate).getFullYear()
    const startDateMonth = new Date(startDate).getMonth()
    const startDateEntry = new Date(startDateYear, startDateMonth, 1)

    const endDateYear = new Date(endDate).getFullYear()
    const endDateMonth = new Date(endDate).getMonth()
    const endDateEntry = new Date(endDateYear, endDateMonth + 1, 0)

    return orderDateEntry >= startDateEntry && orderDateEntry <= endDateEntry
  })
}
