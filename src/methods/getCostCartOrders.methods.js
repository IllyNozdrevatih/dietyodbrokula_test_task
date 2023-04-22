import { getProductById } from "@/methods/getProductById.methods"

export const getCostCartOrders = (cartOrders, products) => {
  if (!cartOrders) return 0
  let cost = 0
  cartOrders.forEach((orderItem) => {
    const productItem = getProductById(orderItem.productId, products)
    if (!productItem) return

    cost += orderItem.count * productItem.cost
  })
  return Math.floor(cost)
}
