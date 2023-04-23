<template>
  <div>
    <h2>CF.02 kalendarz</h2>
    <p>
      Funkcjonalność generowania raportu dla wybranego miesiąca i roku lub na bazie określonego przedziału dat z wykorzystaniem
      komponentu kalendarza
    </p>
    <v-sheet tile class="d-flex align-center">
      <v-row class="align-center">
        <v-col md="2" cols="2" order="3" order-md="1">
          <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col md="5" cols="6" order="1" order-md="2">
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
        <v-col md="3" cols="6" order="2" order-md="3" class="text-center">
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
        </v-col>
        <v-col md="2" cols="2" order="4" order-md="4" class="text-right">
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
  </div>
</template>

<script>
import { getRandomArbitrary } from "@/mockups/orders.generator"
import { mapGetters } from "vuex"

export default {
  props: {
    orders: {
      type: Array,
      default: [],
    },
  },
  name: "Calendar",
  data() {
    return {
      calendar: {
        type: "month",
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
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
    this.$nextTick(() => {
      this.calendar.names = this.getClientsNames()
      this.generateCalendarEvents()
    })
  },
  methods: {
    getOrderCartById(orderId) {
      const orderIndex = this.orders.findIndex((orderItem) => orderItem.id === orderId)
      if (orderIndex === -1) return []
      return this.orders[orderIndex].cart
    },

    generateCalendarEvents() {
      for (const orderItem of this.orders) {
        const orderItemEntryDate = new Date(orderItem.date)
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
  },
  computed: {
    ...mapGetters("products", ["getProductById"]),
    ...mapGetters("clients", ["getClientsNames", "getClientById"]),
  },
}
</script>
