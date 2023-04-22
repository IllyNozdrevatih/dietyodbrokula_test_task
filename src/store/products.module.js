import { productsMockup } from "@/mockups/products.mockup"

export const productsModule = {
  namespaced: true,
  state: () => ({
    products: [],
  }),
  mutations: {
    PRODUCTS_UPDATE(state, payload) {
      state.products = payload
    },
  },
  actions: {
    fetchProducts({ commit }) {
      commit("PRODUCTS_UPDATE", productsMockup)
    },
  },
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find((product) => product.id === id)
    },
    getProductIDsArray: (state) => () => {
      return state.products.map((productItem) => productItem.id)
    },
  },
}
