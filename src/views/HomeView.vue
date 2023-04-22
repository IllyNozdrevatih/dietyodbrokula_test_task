<template>
  <v-container>
    <h1>Zadanie testowe</h1>
    <ProductList :products="products" :orders="orders" />

    <v-spacer class="mt-5" />
    <Calendar :products="products" :orders="orders" :clients="clients" />

    <v-spacer class="mt-5" />
    <ClientFilterList :clients="clients" :orders="orders" :products="products" />

    <v-spacer class="mt-5" />
    <TableFilteredOrders :products="products" :orders="orders" :clients="clients" />

    <v-spacer class="mt-5" />
    <Chart :products="products" :orders="orders" />
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
    this.fetchProducts()
    this.fetchClients()
    this.fetchOrders()
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
