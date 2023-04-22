import Vue from "vue"
import Vuex from "vuex"
import { productsModule } from "@/store/products.module"
import { clientsModule } from "@/store/clients.module"
import { ordersModule } from "@/store/orders.module"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    orders: ordersModule,
    clients: clientsModule,
    products: productsModule,
  },
})
