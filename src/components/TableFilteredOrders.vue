<template>
  <div>
    <h2>CF.04 Podsumowanie sprzedaży (łączna ilość / łączna kwota) dla aktualnie ustawionych filtrów</h2>
    <v-sheet tile class="d-flex align-center">
      <v-row>
        <v-col md="6" cols="12">
          <v-autocomplete
            v-model="tableFilteredOrders.products"
            :items="getAutocompleteProducts()"
            @change="handleSelectTableFilteredProducts"
            multiple
          ></v-autocomplete>
        </v-col>
        <v-col md="3" cols="6">
          <v-select
            v-model="tableFilteredOrders.startMonths"
            :items="tableFilteredOrders.startMonthsAutocomplete"
            label="Od"
            item-text="text"
            @change="handleSelectTableFilteredOrdersFrom"
          ></v-select>
        </v-col>
        <v-col md="3" cols="6">
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
import { getFilteredOrdersByDate } from "@/methods/getFilteredOrdersByDate.methods"
import { getAutocompleteMonths } from "@/methods/tAutocompleteMonths.methods"

export default {
  props: {
    orders: {
      type: Array,
      default: [],
    },
  },
  name: "TableFilteredOrders",
  mounted() {
    this.$nextTick(() => {
      this.tableFilteredOrders.startMonthsAutocomplete = this.getAutocompleteMonths(this.orders)
      this.tableFilteredOrders.endMonthsAutocomplete = this.getAutocompleteMonths(this.orders)
      this.tableFilteredOrders.products = this.getProductIDsArray()
    })
  },
  data() {
    return {
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
    getAutocompleteMonths,
    getFilteredOrdersByDate,
    handleSelectTableFilteredProducts(selectedProduct) {
      if (this.tableFilteredOrders.startMonths === null && this.tableFilteredOrders.endMonths === null) {
        return
      }

      this.tableFilteredOrders.orders = this.getFilteredOrdersSelectedProduct({ selectedProduct })

      this.tableFilteredOrders.orders = this.getFilteredOrdersByDate(
        {
          startDate: this.tableFilteredOrders.startMonths,
          endDate: this.tableFilteredOrders.endMonths,
        },
        this.tableFilteredOrders.orders,
      )
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

      this.tableFilteredOrders.orders = this.getFilteredOrdersSelectedProduct({
        selectedProduct: this.tableFilteredOrders.products,
      })

      this.tableFilteredOrders.orders = this.getFilteredOrdersByDate(
        {
          startDate: this.tableFilteredOrders.startMonths,
          endDate: this.tableFilteredOrders.endMonths,
        },
        this.tableFilteredOrders.orders,
      )
    },
    handleSelectTableFilteredOrdersFrom(selectedDate) {
      const selectedDateIndex = this.tableFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.tableFilteredOrders.endMonthsAutocomplete.forEach((item) => (item.disabled = false))

      for (let i = selectedDateIndex - 1; i >= 0; i--) {
        this.tableFilteredOrders.endMonthsAutocomplete[i].disabled = true
      }

      if (this.tableFilteredOrders.endMonths === null) {
        this.tableFilteredOrders.endMonths = this.getTableFilteredLastMonth(
          this.tableFilteredOrders.startMonthsAutocomplete,
        ).value
      }

      this.tableFilteredOrders.orders = this.getFilteredOrdersSelectedProduct({
        selectedProduct: this.tableFilteredOrders.products,
      })

      this.tableFilteredOrders.orders = this.getFilteredOrdersByDate(
        {
          startDate: this.tableFilteredOrders.startMonths,
          endDate: this.tableFilteredOrders.endMonths,
        },
        this.tableFilteredOrders.orders,
      )
    },

    getFilteredOrdersSelectedProduct({ selectedProduct }) {
      const filteredOrder = []

      for (const orderItem of this.orders) {
        // deep copy
        const orderItemCopy = JSON.parse(JSON.stringify(orderItem))

        orderItemCopy.cart = orderItemCopy.cart.filter((cartItem) => {
          return selectedProduct.includes(cartItem.productId)
        })
        if (orderItemCopy.cart.length > 0) filteredOrder.push(orderItemCopy)
      }

      return filteredOrder
    },

    getTableFilteredLastMonth() {
      const lastMonthIndex = this.tableFilteredOrders.startMonthsAutocomplete.length - 1
      return this.tableFilteredOrders.startMonthsAutocomplete[lastMonthIndex]
    },

    getTableFilteredFirstMonth() {
      return this.tableFilteredOrders.startMonthsAutocomplete[0]
    },
  },
  computed: {
    ...mapGetters("products", ["getProductIDsArray", "getProductById", "getAutocompleteProducts"]),
    ...mapGetters("clients", ["getClientById"]),
    ...mapGetters("orders", ["getCostCartOrders", "getCountCartOrders"]),

    getAmountOrders() {
      return this.tableFilteredOrders.orders.map((orderItem) => orderItem.cart)
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
