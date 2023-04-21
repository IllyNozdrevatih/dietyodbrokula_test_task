export const ordersGenerator = (count) => {
  const orders = []

  for (let i = 0; i < count; i++) {
    const cartSize = getRandomArbitrary(5, 15)

    const orderObject = {
      id: i,
      clientId: getRandomArbitrary(1, 4),
      date: getRandomDate(),
      cart: cartGenerator(cartSize),
    }

    orders.push(orderObject)
  }

  return orders
}

function cartGenerator(count) {
  const cart = []
  for (let i = 0; i < count; i++) {
    const cartItem = {
      productId: getRandomArbitrary(1, 9),
      count: getRandomArbitrary(50, 500),
    }
    cart.push(cartItem)
  }
  return cart
}

function getRandomDate() {
  const day = getRandomArbitrary(1, 28)
  const month = getRandomArbitrary(0, 11)
  const year = getRandomArbitrary(22, 23)

  return new Date(`20${year}`, month, day)
}

export const getRandomArbitrary = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}
