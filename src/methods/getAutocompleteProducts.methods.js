export const getAutocompleteProducts = (products) => {
  return products.map((productsItem) => {
    return {
      text: productsItem.name,
      value: productsItem.id,
    }
  })
}
