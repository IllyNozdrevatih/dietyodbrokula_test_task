<template>
  <v-container>
    <h1>Zamówić towar</h1>
    <h2>CF.07 Przygotowanie formularza do dodawania Zamówień od klienta</h2>
    <v-form ref="form" @submit.prevent="submitOrderForm">
      <v-select
        v-model="order.clientId"
        :items="clients"
        label="Klient"
        item-text="name"
        item-value="id"
        :rules="form.rules.client"
        clearable
      />

      <div class="mb-4">
        <h3>Wybierz datę</h3>
        <v-menu
          ref="menu"
          v-model="datePicker.menu"
          :close-on-content-click="false"
          :return-value.sync="datePicker.date"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="datePicker.date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="datePicker.date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="datePicker.menu = false"> Anulować </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(datePicker.date)"> OK </v-btn>
          </v-date-picker>
        </v-menu>
      </div>
      <div class="d-flex align-center">
        <h3>Lista produktów</h3>
        <v-btn class="ml-2" color="primary" @click="addCartItem">Dodaj produkt</v-btn>
      </div>

      <v-row v-for="(cartItem, index) of order.cart">
        <v-col lg="6">
          <v-select
            v-model="cartItem.productId"
            :items="products"
            :rules="form.rules.product"
            label="Produkt"
            item-text="name"
            item-value="id"
            required
          ></v-select>
        </v-col>
        <v-col lg="6" class="d-flex align-center">
          <v-text-field
            v-model="cartItem.count"
            :rules="form.rules.count"
            @click:append-outer="increment(cartItem.count)"
            @click:prepend="decrement(cartItem.count)"
            type="number"
          />
          <v-btn @click="removeCartItem(index)" class="ml-2" color="error" fab x-small danger><v-icon>mdi-close</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-btn class="mt-4" color="success" type="submit" block>Zamówić</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"
export default {
  name: "AddOrderForm",
  mounted() {
    if (this.products.length === 0) {
      this.fetchProducts()
    }
    if (this.clients.length === 0) {
      this.fetchClients()
    }
  },
  data() {
    return {
      datePicker: {
        menu: false,
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      },
      form: {
        rules: {
          client: [(v) => v !== null],
          product: [(v) => v !== null],
          count: [
            (v) => v > 0,
            (v) => {
              return this.isValidNumber(v)
            },
          ],
        },
      },
      order: {
        date: null,
        clientId: null,
        cart: [
          {
            count: 0,
            productId: null,
          },
        ],
      },
    }
  },
  methods: {
    ...mapActions("products", ["fetchProducts"]),
    ...mapActions("clients", ["fetchClients"]),
    ...mapMutations("orders", ["ADD_ORDER"]),
    submitOrderForm() {
      if (this.$refs.form.validate() && this.order.cart.length !== 0) {
        this.order.date = this.getFormattedDate(this.datePicker.date)
        this.cartCountsToInit()
        // deep copy
        const orderObject = JSON.parse(JSON.stringify(this.order))

        this.ADD_ORDER(orderObject)
        this.$notify({
          title: "Zaktualizowane",
          text: "Zamówienie zrealizowane",
          type: "success",
        })
        this.$refs.form.reset()
        this.datePicker.date = new Date()
        this.order.date = null
      } else {
        this.$notify({
          title: "Błąd",
          text: "Sprawdź Formularz",
          type: "error",
        })
      }
    },
    removeCartItem(cartIndex) {
      this.order.cart.splice(cartIndex, 1)
    },
    addCartItem() {
      const emptyCartItem = {
        count: 0,
        productId: null,
      }

      this.order.cart.push(emptyCartItem)
    },
    getFormattedDate(date) {
      return new Date(date).toDateString()
    },
    isValidNumber(number) {
      const numberString = new String(number)

      if (numberString.length === 0) return false
      if (numberString.indexOf("0") === 0) return false
      return numberString.indexOf(".") === -1
    },
    cartCountsToInit() {
      if (this.order.cart.length === 0) return
      this.order.cart.forEach((cartItem) => {
        cartItem.count = +cartItem.count
      })
    },
    increment(el) {
      el = parseInt(el, 10) + 1
    },
    decrement(el) {
      el = parseInt(el, 10) - 1
    },
  },
  computed: {
    ...mapState("products", ["products"]),
    ...mapState("clients", ["clients"]),
  },
}
</script>
