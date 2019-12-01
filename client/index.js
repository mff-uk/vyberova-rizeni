import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import Vuex from "vuex";

import "./module";
import App from "./app/app.vue";
import createRouter from "./app/router";
import createStore from "./app/store";

require("vuetify/dist/vuetify.css");

// Consider inlining icons with:
// https://vuetifyjs.com/en/customization/icons#installing-iconfonts

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(Vuex);

console.log("RENDER APP");
/* eslint-disable no-new */
new Vue({
  "el": "#app",
  "router": createRouter(),
  "store": createStore(),
  "vuetify": new Vuetify({
    "icons": {
      "iconfont": "md",
    },
  }),
  "render": (h) => h(App)
});
