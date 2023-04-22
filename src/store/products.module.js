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
    getAutocompleteProducts: (state) => () => {
      return state.products.map((productsItem) => {
        return {
          text: productsItem.name,
          value: productsItem.id,
        }
      })
    },
    getProductIdsMap: (state) => () => {
      const productIDsMap = new Map()
      for (const productItem of state.products) {
        productIDsMap.set(productItem.name, productItem.id)
      }

      return productIDsMap
    },
  },
}
