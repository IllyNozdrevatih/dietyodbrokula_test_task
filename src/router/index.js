import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.page.vue"
import ProductsEditPage from "@/views/ProductsEdit.page"
import AddOrderFormPage from "@/views/AddOrderForm.page"

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
