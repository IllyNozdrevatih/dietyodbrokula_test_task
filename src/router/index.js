import Vue from "vue"
import VueRouter from "vue-router"
import HomeView from "../views/HomeView.page.vue"
import ProductsEditPage from "@/views/ProductsEdit.page"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/products-edit",
    name: "productsEdit",
    component: ProductsEditPage,
  },
]

const router = new VueRouter({
  routes,
})

export default router
