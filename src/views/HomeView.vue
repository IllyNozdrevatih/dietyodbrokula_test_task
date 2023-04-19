<template>
  <v-container>
    <h1>Home page</h1>
    <v-data-table :headers="table.headers" :items="products" :items-per-page="10" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="item.image_url" :alt="item.name" width="50px" height="50px"></v-img>
        </div>
      </template>
      <template v-slot:item.orders="{ item }">
        <div class="p-2" v-text="getCountOrdersByProductId(item.id)" />
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
  data() {
    return {
      products: productsMockup,
      clients: clientMockup,
      orders: ordersMockup,
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
          { text: "Image", value: "image", sortable: false },
          { text: "Orders", value: "orders", sortable: false },
        ],
      },
    }
  },
  methods: {
    getCountOrdersByProductId(productId) {
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
  },
}
</script>

<style lang="scss"></style>
