import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/pages/Home.page.vue"
import ProductsEditPage from "@/pages/ProductsEdit.page"
import AddOrderFormPage from "@/pages/AddOrderForm.page"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/products-edit",
    name: "productsEdit",
    component: ProductsEditPage,
  },
  {
    path: "/add-order",
    name: "AddOrder",
    component: AddOrderFormPage,
  },
]

const router = new VueRouter({
  routes,
})

export default router
