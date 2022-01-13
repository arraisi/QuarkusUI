import Vue from 'vue'
import VueRouter from 'vue-router'
import menu from "../components/menu";
import person from "../components/person";

Vue.use(VueRouter)

const routes = [
  // portal
  {
    path: "",
    component: menu,
    props: true,
    children: [
      { path: "/person", component: person, props: true, meta: { restricted: true } }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
