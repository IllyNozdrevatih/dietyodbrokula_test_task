import { ordersMockup } from "@/mockups/orders.mockup"

export const ordersModule = {
  namespaced: true,
  state: () => ({
    orders: [],
  }),
  mutations: {
    ORDERS_UPDATE(state, payload) {
      state.orders = payload
    },
  },
  actions: {
    fetchOrders({ commit }) {
      commit("ORDERS_UPDATE", ordersMockup)
    },
  },
  getters: {
    getOrdersProductById: (state) => (productId) => {
      let countProductOrders = 0
      for (const orderItem of state.orders) {
        const productIndex = orderItem.cart.findIndex((productItem) => productItem.productId === productId)
        const hasProductInCart = productIndex !== -1

        if (hasProductInCart) {
          countProductOrders += orderItem.cart[productIndex].count
        }
      }
      return countProductOrders
    },
    getCostCartOrders: (state, getters, rootState, rootGetters) => (cartOrders) => {
      let cost = 0
      cartOrders.forEach((orderItem) => {
        const productItem = rootGetters["products/getProductById"](orderItem.productId)

        cost += orderItem.count * productItem.cost
      })
      return Math.floor(cost)
    },
    getCountCartOrders: (state) => (cartOrders) => {
      let count = 0
      cartOrders.forEach((orderItem) => (count += orderItem.count))
      return count
    }
  },
}
