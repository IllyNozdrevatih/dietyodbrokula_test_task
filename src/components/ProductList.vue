<template>
  <div>
    <h2>CF.01 Prezentowanie produktów i wartości liczbowych dotyczących sprzedaży</h2>
    <v-data-table :headers="tableProducts.headers" :items="products" :items-per-page="10" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="item.image_url" :alt="item.name" width="50px" height="50px"></v-img>
        </div>
      </template>
      <template v-slot:item.orders="{ item }">
        <div class="p-2" v-text="getOrdersProductById(item.id)" />
      </template>
      <template v-slot:item.amout_cost="{ item }">
        <div class="p-2" v-text="getAmountCost(item.id, item.cost)"></div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "ProductList",
  props: {
    products: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      tableProducts: {
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
          { text: "Ogólna cena", value: "amout_cost", sortable: false },
        ],
      },
    }
  },
  methods: {
    getAmountCost(productId, cost) {
      const orders = this.getOrdersProductById(productId)

      return Math.floor(orders * cost)
    },
  },
  computed: {
    ...mapGetters("products", ["getProductIDsArray"]),
    ...mapGetters("orders", ["getOrdersProductById"]),
  },
}
</script>
