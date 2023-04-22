<template>
  <v-app>
    <v-app-bar class="justify-center" app color="primary" dark>
      <div class="d-flex align-center">
        <v-btn class="box-shadow-none" color="primary" @click="navigationRouteTo({ name: 'home' })">Glovna</v-btn>
        <v-btn class="box-shadow-none" color="primary" @click="navigationRouteTo({ name: 'productsEdit' })"
          >Edytuj Lista produktów</v-btn
        >
        <v-btn class="box-shadow-none" color="primary" @click="navigationRouteTo({ name: 'AddOrder' })">Zamówić towar</v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
      <notifications position="right bottom" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    navigationRouteTo(route) {
      if (this.$route.name === route.name) return
      this.$router.push(route)
    },
  },
}
</script>

<style lang="scss">
.box-shadow-none {
  box-shadow: none !important;
}
.v-toolbar__content,
.v-toolbar__extension {
  justify-content: center;
}
</style>
