<template>
  <div class="container">
    <h1>Home page</h1>

    <v-row v-if="productsMockup.length">
      <v-col lg="4"
           v-for="(productItem, index) of productsMockup"
          :key="index"
      >
        <v-card
            :loading="loading"
            class="mx-auto my-12"
            max-width="374"
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
                :active="isActive"
                color="deep-purple"
                height="4"
                indeterminate
            ></v-progress-linear>
          </template>

          <v-img
              cover
              height="250"
              :src="productItem.image_url"
          />

          <v-card-title v-text="productItem.name"/>

          <v-card-text>
            <v-row
                align="center"
                class="mx-0"
            >
              <v-rating
                  :value="productItem.rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
              ></v-rating>
            </v-row>
            <div class="my-4 text-subtitle-1">
              zł • {{ productItem.cost }}
            </div>
          </v-card-text>
          <v-card-subtitle>
            <span class="me-1" v-text="productItem.description"/>

            <v-icon
                color="error"
                icon="mdi-fire-circle"
                size="small"
            ></v-icon>
          </v-card-subtitle>

          <v-divider class="mx-4 mb-1"></v-divider>

        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import {productsMockup} from "@/mockups/products.mockup";


export default {
  name: 'Home',
  data(){
    return {
      productsMockup: productsMockup,
      loading: false,
      selection: 1,
    }
  },
  components: {
  },
}
</script>
