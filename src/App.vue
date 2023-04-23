<template>
  <v-app>
    <v-app-bar class="justify-center" app color="primary" height="auto" dark>
      <div class="app-menu-navigation">
        <v-btn class="box-shadow-none mobile-fs-9" color="primary" @click="navigationRouteTo({ name: 'home' })">Glovna</v-btn>
        <v-btn class="box-shadow-none mobile-fs-9" color="primary" @click="navigationRouteTo({ name: 'productsEdit' })"
          >Edytuj Lista produktów</v-btn
        >
        <v-btn class="box-shadow-none mobile-fs-9" color="primary" @click="navigationRouteTo({ name: 'AddOrder' })"
          >Zamówić towar</v-btn
        >
      </div>
    </v-app-bar>

    <v-main class="app-container">
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
.app-menu-navigation {
  display: flex;
}
.app-container {
  padding-top: 50px;
}
.mobile-fs-9 {
  @media (max-width: 640px) {
    font-size: 9px !important;
  }
}
</style>
