<template>
  <v-container>
    <h1>Home page</h1>

    <v-data-table :headers="table.headers" :items="productsMockup" :items-per-page="10" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="item.image_url" :alt="item.name" width="50px" height="50px"></v-img>
        </div>
      </template>
      <template v-slot:item.btn-add="{ item }">
        <v-btn icon color="pink">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { productsMockup } from "@/mockups/products.mockup"

export default {
  name: "Home",
  data() {
    return {
      productsMockup: productsMockup,
      table: {
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Name", value: "name", sortable: true },
          { text: "Cost", value: "cost", sortable: true },
          { text: "Rating", value: "rating", sortable: true },
          { text: "Image", value: "image", sortable: false },
          { text: "Add to cart", value: "btn-add", sortable: false },
        ],
      },
    }
  },
  methods: {
    addToCart() {},
  },
}
</script>
