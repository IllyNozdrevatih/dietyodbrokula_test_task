export const getProductById = (productId, products) => {
  const productIndex = products.findIndex((productItem) => productItem.id === productId)

  if (productIndex !== -1) return products[productIndex]
  return null
}
