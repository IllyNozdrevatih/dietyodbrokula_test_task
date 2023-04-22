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
    ADD_ORDER(state, orderItem) {
      orderItem.id = state.orders.length
      state.orders.push(orderItem)
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
        const filteredCart = orderItem.cart.filter((cartItem) => cartItem.productId === productId)

        if (filteredCart.length) {
          filteredCart.forEach((cartItem) => (countProductOrders += cartItem.count))
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
    getOrdersByClientId: (state) => (clientId) => {
      const clientOrders = []

      for (const orderItem of state.orders) {
        const isClientOrder = orderItem.clientId === clientId

        if (isClientOrder) clientOrders.push(orderItem)
      }

      return clientOrders
    },
    getCountCartOrders: (state) => (cartOrders) => {
      let count = 0
      cartOrders.forEach((orderItem) => (count += orderItem.count))
      return count
    },
  },
}
