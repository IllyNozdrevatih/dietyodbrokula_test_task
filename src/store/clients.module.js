import { clientMockup } from "@/mockups/client.mockup"

export const clientsModule = {
  namespaced: true,
  state: () => ({
    clients: [],
  }),
  mutations: {
    CLIENTS_UPDATE(state, payload) {
      state.clients = payload
    },
  },
  actions: {
    fetchClients({ commit }) {
      commit("CLIENTS_UPDATE", clientMockup)
    },
  },
  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find((client) => client.id === id)
    },
    getClientsNames: (state) => () => {
      return state.clients.map((clientItem) => clientItem.name)
    },
  },
}
