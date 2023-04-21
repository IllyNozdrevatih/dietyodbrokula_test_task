<template>
  <v-container>
    <h1>Zadanie testowe</h1>
    <h2>CF.01 Prezentowanie produktów i wartości liczbowych dotyczących sprzedaży</h2>
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
    <h2>CF.02 kalendarz</h2>
    <p>
      Funkcjonalność generowania raportu dla wybranego miesiąca i roku lub na bazie określonego przedziału dat z wykorzystaniem
      komponentu kalendarza
    </p>
    <v-sheet tile height="54" class="d-flex align-center">
      <v-row class="align-center">
        <v-col lg="2">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col lg="5">
          <v-select
            v-model="calendar.type"
            locale="pl"
            :items="calendar.types"
            item-text="name"
            item-value="type"
            dense
            outlined
            hide-details
            class="ma-2"
            label="Wygląd"
          ></v-select>
        </v-col>
        <v-col lg="3" class="text-center">
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-col>
        <v-col lg="2" class="text-right">
          <v-btn icon class="ma-2" @click="$refs.calendar.next()">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="calendar.value"
        :weekdays="calendar.weekday"
        :type="calendar.type"
        :events="calendar.events"
        :event-overlap-threshold="30"
        @click:event="calendarShowEvent"
      ></v-calendar>
      <v-menu v-model="calendar.selectedOpen" :close-on-content-click="false" :activator="calendar.selectedElement" offset-x>
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="calendar.selectedEvent.color" dark>
            <v-toolbar-title v-html="calendar.selectedEvent.name"></v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <span>Adres: {{ calendar.selectedEvent.address }}</span>
            <h3>Zamówienie</h3>
            <div
              v-for="(cartItem, index) of getOrderCartById(calendar.selectedEvent.orderId)"
              :key="`calendar-cart-item-${index}`"
              class="d-flex"
            >
              <div class="pr-2">{{ getProductById(cartItem.productId).name }}:</div>
              <div v-text="cartItem.count"></div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="calendar.selectedOpen = false"> Anulować </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <v-spacer class="mt-5" />
    <h2>CF.03 Filtrowanie raportu sprzedażowego po klientach (lista rozwijana)</h2>

    <v-select v-model="tableClients.clientId" :items="clients" label="Klient" item-text="name" item-value="id" clearable />
    <v-data-table
      v-if="tableClients.clientId !== null"
      :headers="tableClients.headers"
      :items="getOrdersByClientId(tableClients.clientId)"
      :itemsPerPage="5"
    >
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

    <v-spacer class="mt-5" />
    <h2>CF.04 Podsumowanie sprzedaży (łączna ilość / łączna kwota) dla aktualnie ustawionych filtrów</h2>
    <v-sheet tile class="d-flex align-center">
      <v-row>
        <v-col lg="6">
          <v-autocomplete
            v-model="tableFilteredOrders.products"
            :items="getAutocompleteProducts()"
            @change="handleSelectTableFilteredProducts"
            multiple
          ></v-autocomplete>
        </v-col>
        <v-col lg="3">
          <v-select
            v-model="tableFilteredOrders.startMonths"
            :items="tableFilteredOrders.startMonthsAutocomplete"
            label="Od"
            item-text="text"
            @change="handleSelectTableFilteredOrdersFrom"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-select
            v-model="tableFilteredOrders.endMonths"
            :items="tableFilteredOrders.endMonthsAutocomplete"
            label="Do"
            item-text="text"
            @change="handleSelectTableFilteredOrdersTo"
          ></v-select>
        </v-col>
      </v-row>
    </v-sheet>
    <v-data-table :items="tableFilteredOrders.orders" :headers="tableFilteredOrders.headers" :itemsPerPage="5">
      <template v-slot:item.date="{ item }">
        <div v-text="new Date(item.date).toLocaleDateString('pl-PL')" />
      </template>
      <template v-slot:item.clientId="{ item }">
        <div v-text="getClientById(item.clientId).name" />
      </template>
      <template v-slot:item.cart="{ item }">
        <div v-for="(productOrderObject, index) of item.cart" :key="`product-order-${index}`" class="d-flex">
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
  </v-container>
</template>

<script>
import { productsMockup } from "@/mockups/products.mockup"
import { clientMockup } from "@/mockups/client.mockup"
import { ordersMockup } from "@/mockups/orders.mockup"
import { uniqBy } from "lodash"
import { getRandomArbitrary } from "@/mockups/orders.generator"

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
          { text: "Produkt", value: "name", sortable: true },
          { text: "Сena", value: "cost", sortable: true },
          { text: "Portret", value: "image", sortable: false },
          { text: "Zamówienie", value: "orders", sortable: false },
        ],
      },
      calendar: {
        type: "month",
        // types: ["month", "week"],
        types: [
          {
            name: "Miesiąc",
            type: "month",
          },
          {
            name: "Tydzień",
            type: "week",
          },
        ],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        value: "",
        events: [],
        colors: ["blue", "indigo", "green", "orange", "grey darken-1"],
        names: [],
        selectedEvent: {},
        selectedOpen: false,
        selectedElement: null,
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
      tableFilteredOrders: {
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Data", value: "date", sortable: true },
          { text: "Klient", value: "clientId", sortable: false },
          { text: "Zamówienie", value: "cart", sortable: false },
          { text: "Łączna ilość", value: "orders", sortable: false },
          { text: "Kwota", value: "cost", sortable: false },
        ],
        products: [],
        startMonths: null,
        startMonthsAutocomplete: [],
        endMonths: null,
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

      this.tableFilteredOrders.products = this.getProductIDsArray()
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
    getOrderCartById(orderId) {
      const orderIndex = this.orders.findIndex((orderItem) => orderItem.id === orderId)
      if (orderIndex === -1) return []
      return this.orders[orderIndex].cart
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

      if (productIndex !== -1) return this.products[productIndex]
      return null
    },
    getClientsNames() {
      if (this.clients.length === 0) return []
      return this.clients.map((clientItem) => clientItem.name)
    },
    generateCalendarEvents() {
      for (const [index, orderItem] of this.orders.entries()) {
        const orderItemEntryDate = this.getEntryDate(orderItem.date)
        const client = this.getClientById(orderItem.clientId)

        this.calendar.events.push({
          orderId: orderItem.id,
          name: client.name,
          address: client.address,
          start: orderItemEntryDate,
          end: orderItemEntryDate,
          color: this.calendar.colors[getRandomArbitrary(0, 5)],
        })
      }
    },
    calendarShowEvent({ nativeEvent, event }) {
      const open = () => {
        this.calendar.selectedEvent = event
        this.calendar.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.calendar.selectedOpen = true)))
      }

      if (this.calendar.selectedOpen) {
        this.calendar.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
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
        const orderItemEntryDate = this.getEntryDate(orderItem.date)

        const monthObject = {
          text: orderItemEntryDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
          value: orderItem.date,
          disabled: false,
        }
        autocompleteMonthList.push(monthObject)
      }

      const uniqueMonthList = uniqBy(autocompleteMonthList, "text")

      uniqueMonthList.sort((a, b) => {
        const firstEntryDate = this.getEntryDate(a.value)
        const secondEntryDate = this.getEntryDate(b.value)

        return firstEntryDate - secondEntryDate
      })

      return uniqueMonthList
    },
    handleSelectTableFilteredOrdersFrom(selectedDate) {
      const selectedDateIndex = this.tableFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.tableFilteredOrders.endMonthsAutocomplete.forEach((item) => (item.disabled = false))

      for (let i = selectedDateIndex - 1; i >= 0; i--) {
        this.tableFilteredOrders.endMonthsAutocomplete[i].disabled = true
      }

      if (this.tableFilteredOrders.endMonths === null) {
        this.tableFilteredOrders.endMonths = this.getTableFilteredLastMonth().value
      }

      this.updateTableFilteredOrdersByProducts({
        selectedProduct: this.tableFilteredOrders.products,
      })

      this.updateTableFilteredOrdersByDate({
        startDate: this.tableFilteredOrders.startMonths,
        endDate: this.tableFilteredOrders.endMonths,
      })
    },
    handleSelectTableFilteredOrdersTo(selectedDate) {
      const selectedDateIndex = this.tableFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.tableFilteredOrders.startMonthsAutocomplete.forEach((item) => (item.disabled = true))

      for (let i = selectedDateIndex; i >= 0; i--) {
        this.tableFilteredOrders.startMonthsAutocomplete[i].disabled = false
      }

      if (this.tableFilteredOrders.startMonths === null) {
        this.tableFilteredOrders.startMonths = this.getTableFilteredFirstMonth().value
      }

      this.updateTableFilteredOrdersByProducts({
        selectedProduct: this.tableFilteredOrders.products,
      })

      this.updateTableFilteredOrdersByDate({
        startDate: this.tableFilteredOrders.startMonths,
        endDate: this.tableFilteredOrders.endMonths,
      })
    },
    handleSelectTableFilteredProducts(selectedProduct) {
      if (this.tableFilteredOrders.startMonths === null && this.tableFilteredOrders.endMonths === null) {
        return
      }

      this.updateTableFilteredOrdersByProducts({ selectedProduct })

      this.updateTableFilteredOrdersByDate({
        startDate: this.tableFilteredOrders.startMonths,
        endDate: this.tableFilteredOrders.endMonths,
      })
    },
    updateTableFilteredOrdersByProducts({ selectedProduct }) {
      const filteredOrder = []

      for (const orderItem of this.orders) {
        // deep copy
        const orderItemCopy = JSON.parse(JSON.stringify(orderItem))

        orderItemCopy.cart = orderItemCopy.cart.filter((cartItem) => {
          return selectedProduct.includes(cartItem.productId)
        })
        if (orderItemCopy.cart.length > 0) filteredOrder.push(orderItemCopy)
      }

      this.tableFilteredOrders.orders = filteredOrder
    },
    updateTableFilteredOrdersByDate({ startDate, endDate }) {
      this.tableFilteredOrders.orders = this.tableFilteredOrders.orders.filter((orderItem) => {
        const orderDateEntry = this.getEntryDate(orderItem.date)
        const startDateEntry = this.getEntryDate(startDate)
        const endDateEntry = this.getEntryDate(endDate)

        return orderDateEntry >= startDateEntry && orderDateEntry <= endDateEntry
      })
    },
    getTableFilteredFirstMonth() {
      return this.tableFilteredOrders.startMonthsAutocomplete[0]
    },
    getTableFilteredLastMonth() {
      const lastMonthIndex = this.tableFilteredOrders.startMonthsAutocomplete.length - 1
      return this.tableFilteredOrders.startMonthsAutocomplete[lastMonthIndex]
    },
    getProductIDsArray() {
      return this.products.map((productItem) => productItem.id)
    },
    getCountCartOrders(cartOrders) {
      let count = 0
      cartOrders.forEach((orderItem) => (count += orderItem.count))
      return count
    },
    getCostCartOrders(cartOrders) {
      if (!cartOrders) return 0
      let cost = 0
      cartOrders.forEach((orderItem) => {
        const productItem = this.getProductById(orderItem.productId)
        if (!productItem) return

        cost += orderItem.count * productItem.cost
      })
      return Math.floor(cost)
    },
    getEntryDate(date) {
      return new Date(date)
    },
  },
}
</script>

<style lang="scss">
.fs-18 {
  font-size: 18px;
}
</style>
