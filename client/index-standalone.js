import Vue from "vue";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import Vuex from "vuex";

import "./module";
import App from "./app/app.vue";
import createRouter from "./app/router";
import createStore from "./app/store";

require("vuetify/dist/vuetify.css");

import {cache as codelistCache} from "./codelist/codelist-api";
import {
  WAGE_CLASS,
  ROLE,
  ORGANIZATION_STRUCTURE,
  DEPARTMENT,
  TIME,
} from "./job-position/codelist-names";

import wageClass from "../data/public/mzdové-třídy.json";
import role from "../data/public/role.json";
import organizationStructure from "../data/public/organizační-struktura.json";
import department from "../data/public/obor.json";
import time from "../data/public/úvazek.json";

/**
 * Add codelists to the client site.
 */

codelistCache[WAGE_CLASS] = wageClass;
codelistCache[ROLE] = role;
codelistCache[ORGANIZATION_STRUCTURE] = organizationStructure;
codelistCache[DEPARTMENT] = department;
codelistCache[TIME] = time;

// Now start rest of the application, we can not import index.js.
// as it would be executed before this code above.

Vue.config.productionTip = true;

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(Vuex);

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
