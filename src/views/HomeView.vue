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

    <v-select v-model="tableClients.clientId" :items="clients" label="Client" item-text="name" item-value="id" clearable />
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

    <v-spacer class="mt-5" />
    <h2>CF.04 Goal orders with filters</h2>
    <v-sheet tile height="54" class="d-flex align-center">
      <v-row>
        <v-col lg="6">
          <v-autocomplete v-model="tableFilteredOrders.products" :items="getAutocompleteProducts()" multiple></v-autocomplete>
        </v-col>
        <v-col lg="3">
          <v-select
            v-model="tableFilteredOrders.startMonths"
            :items="tableFilteredOrders.startMonthsAutocomplete"
            label="From"
            item-text="text"
            @change="handleSelectTableFilteredOrdersFrom"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-select
            v-model="tableFilteredOrders.endMonths"
            :items="tableFilteredOrders.endMonthsAutocomplete"
            label="To"
            item-text="text"
            @change="handleSelectTableFilteredOrdersTo"
          ></v-select>
        </v-col>
      </v-row>
    </v-sheet>
    <v-data-table :items="tableFilteredOrders.orders" :headers="tableFilteredOrders.headers">
      <!--      <template v-slot:item.cart="{ item }">-->
      <!--        <div class="p-2" v-text="getProductOrdersById(item.id)" />-->
      <!--      </template>-->
    </v-data-table>
  </v-container>
</template>

<script>
import { productsMockup } from "@/mockups/products.mockup"
import { clientMockup } from "@/mockups/client.mockup"
import { ordersMockup } from "@/mockups/orders.mockup"
import { uniqBy } from "lodash"

export default {
  name: "Home",
  mounted() {
    this.init()
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
        colors: ["blue", "indigo", "green", "orange", "grey darken-1"],
        names: [],
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
      tableFilteredOrders: {
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Date", value: "date", sortable: true },
        ],
        products: [],
        startMonths: {},
        startMonthsAutocomplete: [],
        endMonths: {},
        endMonthsAutocomplete: [],
        rangeMonths: [],
        orders: [],
      },
    }
  },
  methods: {
    init() {
      this.$refs.calendar.checkChange()
      this.calendar.names = this.getClientsNames()
      this.generateCalendarEvents()

      this.tableFilteredOrders.startMonthsAutocomplete = this.getAutocompleteMonths()
      this.tableFilteredOrders.endMonthsAutocomplete = this.getAutocompleteMonths()

      // this.tableFilteredOrders.startMonths = this.tableFilteredOrders.startMonthsAutocomplete[0]
      // const lastFilteredMonthIndex = this.tableFilteredOrders.endMonthsAutocomplete.length - 1
      // this.tableFilteredOrders.endMonths = this.tableFilteredOrders.endMonthsAutocomplete[lastFilteredMonthIndex]
      //
      // this.updateTableFilteredOrders({
      //   startDate: this.tableFilteredOrders.startMonths,
      //   endDate: this.tableFilteredOrders.endMonths,
      // })
    },
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
    getClientById(clientId) {
      const clientIndex = this.clients.findIndex((clientItem) => clientItem.id === clientId)
      return this.clients[clientIndex]
    },
    getProductById(productId) {
      const productIndex = this.products.findIndex((productItem) => productItem.id === productId)
      return this.products[productIndex]
    },
    getClientsNames() {
      if (this.clients.length === 0) return []
      return this.clients.map((clientItem) => clientItem.name)
    },
    generateCalendarEvents() {
      for (const [index, orderItem] of this.orders.entries()) {
        const myDate = orderItem.date.split(".")
        const newDate = new Date(`20${myDate[2]}`, myDate[1] - 1, myDate[0])

        this.calendar.events.push({
          name: this.getClientById(orderItem.clientId).name,
          start: newDate,
          end: newDate,
          color: this.calendar.colors[index],
        })
      }
    },
    getAutocompleteProducts() {
      return this.products.map((productsItem) => {
        return {
          text: productsItem.name,
          value: productsItem.id,
        }
      })
    },
    getAutocompleteMonths() {
      const autocompleteMonthList = []

      for (const orderItem of this.orders) {
        const myDate = orderItem.date.split(".")
        const newDate = new Date(`20${myDate[2]}`, myDate[1] - 1, myDate[0])

        const monthObject = {
          text: newDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
          value: orderItem.date,
          disabled: false,
        }
        autocompleteMonthList.push(monthObject)
      }

      const uniqueMonthList = uniqBy(autocompleteMonthList, "text")

      uniqueMonthList.sort(function (a, b) {
        const firstDate = a.value.split(".")
        const firstNewDate = new Date(`20${firstDate[2]}`, firstDate[1] - 1, firstDate[0])

        const secondDate = b.value.split(".")
        const secondNewDate = new Date(`20${secondDate[2]}`, secondDate[1] - 1, secondDate[0])

        return firstNewDate - secondNewDate
      })

      return uniqueMonthList
    },
    handleSelectTableFilteredOrdersFrom(selectedDate) {
      const selectedDateIndex = this.tableFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.tableFilteredOrders.endMonthsAutocomplete.forEach((item) => (item.disabled = false))

      for (let i = selectedDateIndex - 1; i >= 0; i--) {
        this.tableFilteredOrders.endMonthsAutocomplete[i].disabled = true
      }
    },
    handleSelectTableFilteredOrdersTo(selectedDate) {
      const selectedDateIndex = this.tableFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.tableFilteredOrders.startMonthsAutocomplete.forEach((item) => (item.disabled = true))

      for (let i = selectedDateIndex; i >= 0; i--) {
        this.tableFilteredOrders.startMonthsAutocomplete[i].disabled = false
      }

      this.updateTableFilteredOrders({
        startDate: this.tableFilteredOrders.startMonths,
        endDate: this.tableFilteredOrders.endMonths,
      })
    },
    updateTableFilteredOrders({ startDate, endDate }) {
      this.tableFilteredOrders.orders = this.orders.filter((orderItem) => {
        const orderDateArray = orderItem.date.split(".")
        const orderDateEntry = new Date(`20${orderDateArray[2]}`, orderDateArray[1] - 1, orderDateArray[0])

        const startDateArray = startDate.split(".")
        const startDateEntry = new Date(`20${startDateArray[2]}`, startDateArray[1] - 1, startDateArray[0])

        const endDateArray = endDate.split(".")
        const endDateEntry = new Date(`20${endDateArray[2]}`, endDateArray[1] - 1, endDateArray[0])

        return orderDateEntry >= startDateEntry && orderDateEntry <= endDateEntry
      })
    },
  },
}
</script>

<style lang="scss"></style>
