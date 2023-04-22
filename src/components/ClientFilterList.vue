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
          <div class="pr-2">{{ getProductById(productOrderObject.productId, products).name }}:</div>
          <div v-text="productOrderObject.count"></div>
        </div>
      </template>
      <template v-slot:item.orders="{ item }">
        <div v-text="getCountCartOrders(item.cart)" />
      </template>
      <template v-slot:item.cost="{ item }">
        <div v-text="getCostCartOrders(item.cart, products)" />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { getProductById } from "@/methods/getProductById.methods"
import { getCountCartOrders } from "@/methods/getCountCartOrders.methods"
import { getCostCartOrders } from "@/methods/getCostCartOrders.methods"

export default {
  name: "ClientFilterList",
  props: {
    clients: {
      type: Array,
      default: [],
    },
    orders: {
      type: Array,
      default: [],
    },
    products: {
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
  methods: {
    getProductById,
    getCountCartOrders,
    getCostCartOrders,
    getOrdersByClientId(clientId) {
      const clientOrders = []

      for (const orderItem of this.orders) {
        const isClientOrder = orderItem.clientId === clientId

        if (isClientOrder) clientOrders.push(orderItem)
      }

      return clientOrders
    },
  },
}
</script>
