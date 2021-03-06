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
  POZICE,
  ORGANIZATION_STRUCTURE,
  DEPARTMENT,
  TIME,
  ISVAV,
  FORD
} from "./job-position/codelist-names";

import wageClass from "../data/public/mzdové-třídy.json";
import role from "../data/public/akademické-pozice.json";
import organizationStructure from "../data/public/organizační-struktura.json";
import department from "../data/public/obor.json";
import time from "../data/public/úvazek.json";
import isvav from "../data/public/klasifikace-oborů-isvav.json";
import ford from "../data/public/klasifikace-oborů-ford.json";

/**
 * Add codelists to the client site.
 */

codelistCache[WAGE_CLASS] = wageClass;
codelistCache[POZICE] = role;
codelistCache[ORGANIZATION_STRUCTURE] = organizationStructure;
codelistCache[DEPARTMENT] = department;
codelistCache[TIME] = time;
codelistCache[ISVAV] = isvav;
codelistCache[FORD] = ford;

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
