<template>
  <v-container>
    <h1>Zadanie testowe</h1>
    <ProductList :products="products" />

    <v-spacer class="mt-5" />
    <Calendar :orders="orders" />

    <v-spacer class="mt-5" />
    <ClientFilterList :clients="clients" />

    <v-spacer class="mt-5" />
    <TableFilteredOrders :orders="orders" />

    <v-spacer class="mt-5" />
    <Chart :orders="orders" />
  </v-container>
</template>

<script>
import ProductList from "@/components/ProductList"
import ClientFilterList from "@/components/ClientFilterList"
import Calendar from "@/components/Calendar"
import TableFilteredOrders from "@/components/TableFilteredOrders"
import Chart from "@/components/Chart"

import { mapActions, mapState } from "vuex"

export default {
  name: "Home",
  components: { Chart, TableFilteredOrders, Calendar, ClientFilterList, ProductList },
  mounted() {
    if (this.products.length === 0) {
      this.fetchProducts()
    }
    if (this.orders.length === 0) {
      this.fetchOrders()
    }
    this.fetchClients()
  },
  methods: {
    ...mapActions("products", ["fetchProducts"]),
    ...mapActions("clients", ["fetchClients"]),
    ...mapActions("orders", ["fetchOrders"]),
  },

  computed: {
    ...mapState("products", ["products"]),
    ...mapState("clients", ["clients"]),
    ...mapState("orders", ["orders"]),
  },
}
</script>
