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
import { productsMockup } from "@/mockups/products.mockup"
import { clientMockup } from "@/mockups/client.mockup"
import { ordersMockup } from "@/mockups/orders.mockup"

import ProductList from "@/components/ProductList"
import ClientFilterList from "@/components/ClientFilterList"
import Calendar from "@/components/Calendar"
import TableFilteredOrders from "@/components/TableFilteredOrders"
import Chart from "@/components/Chart"

export default {
  name: "Home",
  components: { Chart, TableFilteredOrders, Calendar, ClientFilterList, ProductList },
  data() {
    return {
      products: productsMockup,
      clients: clientMockup,
      orders: ordersMockup,
    }
  },
}
</script>
