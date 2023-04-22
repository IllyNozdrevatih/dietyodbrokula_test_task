<template>
  <div>
    <h2>
      CF.05 Prezentowanie wykresu kołowego prezentującego udział sprzedaży poszczególnych produktów względem całościowej sprzedaży
      za wybrany okres raportowania.
    </h2>
    <v-sheet tile class="d-flex align-center">
      <v-row>
        <v-col lg="6">
          <v-select
            v-model="chartFilteredOrders.startMonths"
            :items="chartFilteredOrders.startMonthsAutocomplete"
            label="Od"
            item-text="text"
            @change="handleSelectChartFilteredOrdersFrom"
          ></v-select>
        </v-col>
        <v-col lg="6">
          <v-select
            v-model="chartFilteredOrders.endMonths"
            :items="chartFilteredOrders.endMonthsAutocomplete"
            label="Do"
            item-text="text"
            @change="handleSelectChartFilteredOrdersTo"
          ></v-select>
        </v-col>
      </v-row>
    </v-sheet>
    <apexchart
      ref="apexchart"
      width="600"
      type="donut"
      :options="chartFilteredOrders.chart.options"
      :series="chartFilteredOrders.chart.series"
    ></apexchart>
  </div>
</template>

<script>
import { getAutocompleteMonths } from "@/methods/tAutocompleteMonths.methods"
import { getFilteredOrdersByDate } from "@/methods/getFilteredOrdersByDate.methods"
import {mapGetters} from "vuex";

export default {
  props: {
    orders: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartFilteredOrders.startMonthsAutocomplete = this.getAutocompleteMonths(this.orders)
      this.chartFilteredOrders.endMonthsAutocomplete = this.getAutocompleteMonths(this.orders)
      this.$refs.apexchart.updateOptions({ labels: [...this.getProductIdsMap().keys()] })
    })
  },
  data() {
    return {
      chartFilteredOrders: {
        startMonths: null,
        startMonthsAutocomplete: [],
        endMonths: null,
        endMonthsAutocomplete: [],
        orders: [],
        chart: {
          options: {
            labels: [],
          },
          series: [],
        },
      },
    }
  },
  methods: {
    getAutocompleteMonths,
    getFilteredOrdersByDate,

    handleSelectChartFilteredOrdersFrom(selectedDate) {
      const selectedDateIndex = this.chartFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.chartFilteredOrders.endMonthsAutocomplete.forEach((item) => (item.disabled = false))

      for (let i = selectedDateIndex - 1; i >= 0; i--) {
        this.chartFilteredOrders.endMonthsAutocomplete[i].disabled = true
      }

      if (this.chartFilteredOrders.endMonths === null) {
        this.chartFilteredOrders.endMonths = this.getTableFilteredLastMonth().value
      }

      this.chartFilteredOrders.orders = this.getFilteredOrdersByDate(
        {
          startDate: this.chartFilteredOrders.startMonths,
          endDate: this.chartFilteredOrders.endMonths,
        },
        this.orders,
      )

      const { cartSeries } = this.getChartFilteredProducts()

      this.chartFilteredOrders.chart.series = cartSeries
    },
    handleSelectChartFilteredOrdersTo(selectedDate) {
      const selectedDateIndex = this.chartFilteredOrders.startMonthsAutocomplete.findIndex((item) => item.value === selectedDate)
      this.chartFilteredOrders.startMonthsAutocomplete.forEach((item) => (item.disabled = true))

      for (let i = selectedDateIndex; i >= 0; i--) {
        this.chartFilteredOrders.startMonthsAutocomplete[i].disabled = false
      }

      if (this.chartFilteredOrders.startMonths === null) {
        this.chartFilteredOrders.startMonths = this.getTableFilteredFirstMonth().value
      }

      this.chartFilteredOrders.orders = this.getFilteredOrdersByDate(
        {
          startDate: this.chartFilteredOrders.startMonths,
          endDate: this.chartFilteredOrders.endMonths,
        },
        this.orders,
      )

      const { cartSeries } = this.getChartFilteredProducts()

      this.chartFilteredOrders.chart.series = cartSeries
    },

    getChartFilteredProducts() {
      const productIdsMap = this.getProductIdsMap()
      const productCountsMap = new Map()
      const productIDsArray = [...productIdsMap.values()]

      productIDsArray.forEach((i) => productCountsMap.set(i, 0))

      for (const orderItem of this.chartFilteredOrders.orders) {
        for (const cartItem of orderItem.cart) {
          const count = productCountsMap.get(cartItem.productId)
          productCountsMap.set(cartItem.productId, count + cartItem.count)
        }
      }

      return {
        cartSeries: [...productCountsMap.values()],
      }
    },

    getTableFilteredFirstMonth() {
      return this.chartFilteredOrders.startMonthsAutocomplete[0]
    },

    getTableFilteredLastMonth() {
      const lastMonthIndex = this.chartFilteredOrders.startMonthsAutocomplete.length - 1
      return this.chartFilteredOrders.startMonthsAutocomplete[lastMonthIndex]
    },
  },
  computed: {
    ...mapGetters("products", ["getProductIdsMap"]),
  }
}
</script>
