<template>
  <v-container>
    <h1>Report</h1>
    <h2>CF.01 Amount orders</h2>
    <v-data-table :headers="tableOrders.headers" :items="products" :items-per-page="10" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="item.image_url" :alt="item.name" width="50px" height="50px"></v-img>
        </div>
      </template>
      <template v-slot:item.orders="{ item }">
        <div class="p-2" v-text="getProductOrdersById(item.id)" />
      </template>
    </v-data-table>

    <v-spacer class="mt-5" />
    <h2>CF.02 Filter By client</h2>
    <v-sheet tile height="54" class="d-flex align-center">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select v-model="calendar.type" :items="calendar.types" dense outlined hide-details class="ma-2" label="type"></v-select>
      <v-toolbar-title v-if="$refs.calendar">
        {{ $refs.calendar.title }}
      </v-toolbar-title>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="calendar.value"
        :weekdays="calendar.weekday"
        :type="calendar.type"
        :events="calendar.events"
        :event-overlap-threshold="30"
        @change="updateRange"
      ></v-calendar>
    </v-sheet>
    <v-spacer class="mt-5" />
    <h2>CF.03 Filter By client</h2>

    <!--    <v-select v-model="tableClients.clientId" :items="clients" label="Client" item-text="name" item-value="id" clearable />-->
    <v-data-table
      v-if="tableClients.clientId !== null"
      :headers="tableClients.headers"
      :items="getOrdersByClientId(tableClients.clientId)"
    >
      <template v-slot:item.cart="{ item }">
        <div v-for="(productOrderObject, index) of item.cart" :key="`product-order-${index}`" class="d-flex">
          <div class="pr-2" v-text="getProductById(productOrderObject.productId).name" />
          <div v-text="productOrderObject.count"></div>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { productsMockup } from "@/mockups/products.mockup"
import { clientMockup } from "@/mockups/client.mockup"
import { ordersMockup } from "@/mockups/orders.mockup"

export default {
  name: "Home",
  mounted() {
    this.$refs.calendar.checkChange()
  },
  data() {
    return {
      products: productsMockup,
      clients: clientMockup,
      orders: ordersMockup,
      tableOrders: {
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Name", value: "name", sortable: true },
          { text: "Cost", value: "cost", sortable: true },
          { text: "Image", value: "image", sortable: false },
          { text: "Orders", value: "orders", sortable: false },
        ],
      },
      calendar: {
        type: "month",
        types: ["month", "week"],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        value: "",
        events: [],
        colors: ["blue", "indigo", "deep-purple", "cyan", "green", "orange", "grey darken-1"],
        names: ["Meeting", "Holiday", "PTO", "Travel", "Event", "Birthday", "Conference", "Party"],
      },
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
            text: "Date",
            sortable: true,
            value: "date",
          },
          {
            text: "Cart",
            value: "cart",
            sortable: false,
          },
        ],
      },
    }
  },
  methods: {
    getProductOrdersById(productId) {
      let countProductOrders = 0
      for (const orderItem of this.orders) {
        const productIndex = orderItem.cart.findIndex((productItem) => productItem.productId === productId)
        const hasProductInCart = productIndex !== -1

        if (hasProductInCart) {
          countProductOrders += orderItem.cart[productIndex].count
        }
      }
      return countProductOrders
    },
    getOrdersByClientId(clientId) {
      const clientOrders = []

      for (const orderItem of this.orders) {
        const isClientOrder = orderItem.clientId === clientId

        if (isClientOrder) clientOrders.push(orderItem)
      }
      return clientOrders
    },
    getProductById(productId) {
      const productIndex = this.products.findIndex((productItem) => productItem.id === productId)
      return this.products[productIndex]
    },
  },
}
</script>

<style lang="scss"></style>
