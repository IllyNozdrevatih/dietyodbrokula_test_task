export const getCountCartOrders = (cartOrders) => {
  let count = 0
  cartOrders.forEach((orderItem) => (count += orderItem.count))
  return count
}
