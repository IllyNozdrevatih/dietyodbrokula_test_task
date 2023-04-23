<template>
  <div>
    <h2>CF.03 Filtrowanie raportu sprzedażowego po klientach (lista rozwijana)</h2>

    <v-select v-model="tableClients.clientId" :items="clients" label="Klient" item-text="name" item-value="id" clearable />
    <v-data-table :headers="tableClients.headers" :items="getOrdersByClientId(tableClients.clientId)" :itemsPerPage="5">
      <template v-slot:item.date="{ item }">
        <div v-text="new Date(item.date).toLocaleDateString('pl-PL')" />
      </template>
      <template v-slot:item.cart="{ item }">
        <div v-for="(productOrderObject, index) of item.cart" :key="`client-product-order-${index}`" class="d-flex">
          <div class="pr-2">{{ getProductById(productOrderObject.productId).name }}:</div>
          <div v-text="productOrderObject.count"></div>
        </div>
      </template>
      <template v-slot:item.orders="{ item }">
        <div v-text="getCountCartOrders(item.cart)" />
      </template>
      <template v-slot:item.cost="{ item }">
        <div v-text="getCostCartOrders(item.cart)" />
      </template>
    </v-data-table>

    <v-row v-if="getAmountOrders.length > 0">
      <v-col lg="4" cols="12">
        <div class="headline">Ogólne zamówienie: {{ getAmountOrders.length }}</div>
      </v-col>
      <v-col lg="4" cols="12">
        <div class="headline">łączna ilość produktów: {{ getAmountOrdersCountProducts }}</div>
      </v-col>
      <v-col lg="4" cols="12">
        <div class="headline">Ogólna cena: {{ getAmountOrdersCostProducts }}</div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "ClientFilterList",
  props: {
    clients: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tableClients: {
        clientId: null,
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          {
            text: "Data",
            sortable: true,
            value: "date",
          },
          {
            text: "Zamówienie",
            value: "cart",
            sortable: false,
          },
          {
            text: "Łączna ilość",
            value: "orders",
            sortable: false,
          },
          {
            text: "Kwota",
            value: "cost",
            sortable: false,
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters("products", ["getProductById"]),
    ...mapGetters("orders", ["getCostCartOrders", "getCountCartOrders", "getOrdersByClientId"]),

    getAmountOrders() {
      const clientOrders = this.getOrdersByClientId(this.tableClients.clientId)
      return clientOrders.map((orderItem) => orderItem.cart)
    },
    getAmountOrdersCountProducts() {
      const amountOrdersCountProducts = []

      for (const cartItem of this.getAmountOrders) {
        const cartItemOrdersCountsArray = cartItem.map((orderItem) => orderItem.count)

        const initialValue = 0
        const cartItemOrderCount = cartItemOrdersCountsArray.reduce((count, amount) => count + amount, initialValue)
        amountOrdersCountProducts.push(cartItemOrderCount)
      }

      const initialValue = 0
      return amountOrdersCountProducts.reduce((count, amount) => count + amount, initialValue)
    },
    getAmountOrdersCostProducts() {
      const amountOrdersCostProducts = []

      for (const cartItem of this.getAmountOrders) {
        for (const orderItem of cartItem) {
          const product = this.getProductById(orderItem.productId)
          amountOrdersCostProducts.push(product.cost * orderItem.count)
        }
      }

      const initialValue = 0
      return Math.floor(amountOrdersCostProducts.reduce((count, amount) => count + amount, initialValue))
    },
  },
}
</script>
